#!/bin/sh

set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_ROOT"

DEPLOY_HOST=${DEPLOY_HOST:-turkeyVps}
APP_NAME=${DEPLOY_APP_NAME:-portfolio}
DOMAIN=${DEPLOY_DOMAIN:-amirabasi.info}
RELEASE_ROOT=${DEPLOY_RELEASE_ROOT:-/var/www/modern-portfolio-releases}
CANDIDATE_PORT=${DEPLOY_CANDIDATE_PORT:-3100}
CANDIDATE_NAME="${APP_NAME}-candidate"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)-$$"
RELEASE_DIR="${RELEASE_ROOT}/${RELEASE_ID}"
LOCK_DIR="${RELEASE_ROOT}/.deploy-lock"
SERVER_APP_DIR="${RELEASE_DIR}/app"
LOCK_HELD=0
RELEASE_ACTIVATED=0

log() {
  printf '\n==> %s\n' "$1"
}

fail() {
  printf '\nDeployment failed: %s\n' "$1" >&2
  exit 1
}

cleanup() {
  if [ "$LOCK_HELD" = 1 ]; then
    if [ "$RELEASE_ACTIVATED" = 0 ]; then
      ssh "$DEPLOY_HOST" sh -s -- "$SERVER_APP_DIR" "$RELEASE_DIR" "$RELEASE_ROOT/current" <<'REMOTE_CLEANUP' >/dev/null 2>&1 || true
server_app_dir=$1
release_dir=$2
current_link=$3
active_dir=$(readlink -f "$current_link" 2>/dev/null || true)

if [ "$active_dir" != "$server_app_dir" ]; then
  rm -rf -- "$release_dir"
fi
REMOTE_CLEANUP
    fi

    ssh "$DEPLOY_HOST" "rmdir -- $LOCK_DIR" >/dev/null 2>&1 || true
    LOCK_HELD=0
  fi
}

trap cleanup 0
trap 'exit 130' 1 2 15

case "$APP_NAME" in
  *[!A-Za-z0-9_-]* | "") fail "DEPLOY_APP_NAME contains unsupported characters" ;;
esac

case "$DOMAIN" in
  *[!A-Za-z0-9.-]* | "") fail "DEPLOY_DOMAIN is not a valid hostname" ;;
esac

case "$CANDIDATE_PORT" in
  *[!0-9]* | "") fail "DEPLOY_CANDIDATE_PORT must be numeric" ;;
esac

if [ "$CANDIDATE_PORT" -lt 1 ] || [ "$CANDIDATE_PORT" -gt 65535 ]; then
  fail "DEPLOY_CANDIDATE_PORT must be between 1 and 65535"
fi

case "$RELEASE_ROOT" in
  /var/www/*) ;;
  *) fail "DEPLOY_RELEASE_ROOT must be below /var/www" ;;
esac

case "$RELEASE_ROOT" in
  *[!A-Za-z0-9_./-]* | *"/../"* | *"/.." | *"//"*)
    fail "DEPLOY_RELEASE_ROOT contains unsafe path components"
    ;;
esac

for required_command in npm ssh rsync curl; do
  command -v "$required_command" >/dev/null 2>&1 || fail "Missing required command: $required_command"
done

log "Checking server access and acquiring deployment lock"
ssh "$DEPLOY_HOST" \
  'command -v node >/dev/null && command -v npm >/dev/null && command -v pm2 >/dev/null && command -v curl >/dev/null && command -v ss >/dev/null' \
  || fail "The server must provide node, npm, pm2, curl, and ss"

ssh "$DEPLOY_HOST" "mkdir -p -- $RELEASE_ROOT && mkdir -- $LOCK_DIR" \
  || fail "Another deployment may already be running; remove $LOCK_DIR only if it is stale"
LOCK_HELD=1

log "Validating application"
npm run lint
npm run typecheck

log "Uploading source for release $RELEASE_ID"
ssh "$DEPLOY_HOST" "mkdir -p -- $RELEASE_DIR/source"
rsync -az --delete \
  --exclude .git \
  --exclude .next \
  --exclude node_modules \
  --exclude playwright-report \
  --exclude test-results \
  ./ "$DEPLOY_HOST:$RELEASE_DIR/source/"

log "Building standalone release on the Ubuntu server"
ssh "$DEPLOY_HOST" sh -s -- "$RELEASE_DIR" <<'REMOTE_BUILD'
set -eu

release_dir=$1
source_dir="$release_dir/source"
app_dir="$release_dir/app"

cd "$source_dir"
npm ci
npm run build

[ -f .next/standalone/server.js ] || {
  printf 'Standalone server was not generated; check next.config.ts\n' >&2
  exit 1
}

rm -rf "$app_dir"
mkdir -p "$app_dir/.next"
cp -a .next/standalone/. "$app_dir/"
cp -a public "$app_dir/public"
cp -a .next/static "$app_dir/.next/static"

cd "$release_dir"
rm -rf source
REMOTE_BUILD

log "Smoke-testing uploaded release on port $CANDIDATE_PORT"
ssh "$DEPLOY_HOST" sh -s -- \
  "$SERVER_APP_DIR" "$CANDIDATE_NAME" "$CANDIDATE_PORT" <<'REMOTE_SMOKE_TEST'
set -eu

release_dir=$1
candidate_name=$2
candidate_port=$3

cleanup_candidate() {
  pm2 delete "$candidate_name" >/dev/null 2>&1 || true
}

finish() {
  status=$?
  trap - 0 1 2 15
  cleanup_candidate
  exit "$status"
}

trap finish 0
trap 'exit 130' 1 2 15
cleanup_candidate

if ss -H -ltn "sport = :$candidate_port" | grep -q .; then
  printf 'Candidate port %s is already in use\n' "$candidate_port" >&2
  exit 1
fi

PORT="$candidate_port" HOSTNAME=127.0.0.1 \
  pm2 start "$release_dir/server.js" --name "$candidate_name" --cwd "$release_dir" >/dev/null
sleep 3

candidate_pid=$(pm2 pid "$candidate_name")
[ -n "$candidate_pid" ] && [ "$candidate_pid" != 0 ]

for path in / /projects /contact /robots.txt /sitemap.xml /AmirAbasi.pdf; do
  status=$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 15 \
    "http://127.0.0.1:${candidate_port}${path}")
  [ "$status" = 200 ] || {
    printf 'Candidate health check failed for %s with HTTP %s\n' "$path" "$status" >&2
    exit 1
  }
done
REMOTE_SMOKE_TEST

log "Switching PM2 to the new release"
ssh "$DEPLOY_HOST" sh -s -- \
  "$SERVER_APP_DIR" "$RELEASE_ROOT" "$APP_NAME" "$DOMAIN" <<'REMOTE_CUTOVER'
set -eu

release_dir=$1
release_root=$2
app_name=$3
domain=$4
current_link="$release_root/current"
next_link="$release_root/.current-next"
launcher="$release_root/run-current.sh"
launcher_next="$release_root/.run-current-next.sh"
previous_dir=
previous_script=
cutover_started=0
cutover_complete=0

switch_link() {
  target=$1
  rm -f "$next_link"
  ln -s "$target" "$next_link"
  mv -Tf "$next_link" "$current_link"
}

start_stable_process() {
  if [ "$previous_script" = "$launcher" ]; then
    pm2 restart "$app_name" >/dev/null
  else
    pm2 delete "$app_name" >/dev/null 2>&1 || true
    pm2 start "$launcher" --name "$app_name" --interpreter /bin/sh >/dev/null
  fi
}

start_previous_process() {
  if [ "$previous_script" = "$launcher" ]; then
    pm2 restart "$app_name" >/dev/null
  elif [ -f "$previous_dir/server.js" ]; then
    pm2 delete "$app_name" >/dev/null 2>&1 || true
    PORT=3000 HOSTNAME=127.0.0.1 \
      pm2 start "$previous_dir/server.js" --name "$app_name" --cwd "$previous_dir" >/dev/null
  elif [ -f "$previous_dir/package.json" ]; then
    pm2 delete "$app_name" >/dev/null 2>&1 || true
    PORT=3000 HOSTNAME=127.0.0.1 \
      pm2 start npm --name "$app_name" --cwd "$previous_dir" -- start >/dev/null
  else
    printf 'Previous release could not be restarted from %s\n' "$previous_dir" >&2
    return 1
  fi
}

rollback() {
  printf 'Cutover failed; rolling back to %s\n' "$previous_dir" >&2
  switch_link "$previous_dir" || return 1
  start_previous_process || return 1
  sleep 3

  status=$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 15 \
    http://127.0.0.1:3000/ || true)
  [ "$status" = 200 ] || {
    printf 'Rollback process did not pass its direct health check\n' >&2
    return 1
  }

  pm2 save >/dev/null
}

finish() {
  status=$?
  trap - 0 1 2 15

  if [ "$cutover_started" = 1 ] && [ "$cutover_complete" = 0 ]; then
    rollback || status=1
  fi

  rm -f "$next_link" "$launcher_next"
  exit "$status"
}

trap finish 0
trap 'exit 130' 1 2 15

current_pid=$(pm2 pid "$app_name" 2>/dev/null || true)
if [ -n "$current_pid" ] && [ "$current_pid" != 0 ]; then
  previous_dir=$(readlink -f "/proc/${current_pid}/cwd" 2>/dev/null || true)
fi

if [ -L "$current_link" ]; then
  linked_dir=$(readlink -f "$current_link" 2>/dev/null || true)
  if [ -n "$linked_dir" ]; then
    previous_dir=$linked_dir
  fi
fi

previous_script=$(pm2 jlist 2>/dev/null | node -e '
let input = "";
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const name = process.argv[1];
  const processInfo = JSON.parse(input).find((item) => item.name === name);
  process.stdout.write(processInfo?.pm2_env?.pm_exec_path || "");
});
' "$app_name" || true)

[ -n "$previous_dir" ] && [ -d "$previous_dir" ] \
  || {
    printf 'Cannot identify the currently running release; refusing cutover\n' >&2
    exit 1
  }

cat > "$launcher_next" <<'STABLE_LAUNCHER'
#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
release=$(readlink -f "$root/current")
cd "$release"
exec env PORT=3000 HOSTNAME=127.0.0.1 node server.js
STABLE_LAUNCHER
chmod 755 "$launcher_next"
mv -f "$launcher_next" "$launcher"

cutover_started=1
switch_link "$release_dir"
start_stable_process
sleep 3

new_pid=$(pm2 pid "$app_name")
[ -n "$new_pid" ] && [ "$new_pid" != 0 ]

direct_status=$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 15 \
  http://127.0.0.1:3000/)
[ "$direct_status" = 200 ] || {
  printf 'New process returned HTTP %s directly\n' "$direct_status" >&2
  exit 1
}

origin_status=$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 15 \
  -H "Host: $domain" http://127.0.0.1/)
[ "$origin_status" = 200 ] || {
  printf 'Nginx origin returned HTTP %s\n' "$origin_status" >&2
  exit 1
}

pm2 save >/dev/null
cutover_complete=1
printf 'PM2 is running %s\n' "$release_dir"
REMOTE_CUTOVER
RELEASE_ACTIVATED=1

log "Verifying public HTTPS"
public_status=$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 20 \
  "https://$DOMAIN/" || true)
[ "$public_status" = 200 ] \
  || fail "The origin is healthy, but https://$DOMAIN/ returned HTTP $public_status; check Cloudflare or DNS"

printf 'Live: https://%s/\n' "$DOMAIN"
printf '\nDeployment complete. Previous releases were retained in %s for rollback.\n' "$RELEASE_ROOT"
