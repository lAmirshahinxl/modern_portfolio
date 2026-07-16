import { portfolio } from "@/data/portfolio";

function DocumentCommand({ command, file }: { command: string; file: string }) {
  return (
    <div className="command-row">
      <p><span>$</span> {command} <strong>{file}</strong></p>
      <time dateTime="2026-07-12">— 2026-07-12</time>
    </div>
  );
}

export function ProfileDocument() {
  return (
    <article className="profile-document route-document">
      <DocumentCommand command="cat" file="profile.md" />

      <section className="document-section about-document" aria-labelledby="profile-title">
        <p className="document-label">01 · ABOUT</p>
        <h1 id="profile-title">{portfolio.brand.name}.</h1>
        {portfolio.brand.legalName ? <p className="legal-name">{portfolio.brand.legalName}</p> : null}
        <p className="document-headline">{portfolio.intro.headline}</p>
        <div className="document-meta">
          <span>{portfolio.intro.eyebrow}</span>
          <i>·</i>
          <span>{portfolio.intro.location}</span>
          <i>·</i>
          <span>{portfolio.intro.timezone}</span>
          <i>·</i>
          <span className="available"><b /> available</span>
        </div>
      </section>

      <hr />

      <section className="document-section biography" aria-label="Biography">
        {portfolio.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
    </article>
  );
}

export function ExperienceDocument() {
  return (
    <article className="profile-document route-document">
      <DocumentCommand command="open" file="experience.tsx" />

      <section className="document-section document-intro" aria-labelledby="experience-title">
        <p className="document-label">01 · EXPERIENCE</p>
        <h1 id="experience-title">Experience &amp; approach.</h1>
        <p className="document-headline">
          Eight years of building mobile, web, crypto, and full-stack products for clients around the world.
        </p>
      </section>

      <hr />

      <section className="document-section numbers" aria-labelledby="numbers-title">
        <h2 className="document-label" id="numbers-title">02 · BY THE NUMBERS</h2>
        <div className="numbers-grid">
          {portfolio.statistics.map((stat) => (
            <div className="number-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
      </section>

      <hr />

      <section className="document-section skills-document" aria-labelledby="skills-title">
        <h2 className="document-label" id="skills-title">03 · TECH STACK</h2>
        <ul className="skill-list">
          {portfolio.skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </section>

      <hr />

      <section className="document-section principles" aria-labelledby="principles-title">
        <h2 className="document-label" id="principles-title">04 · HOW I WORK</h2>
        <ol>
          {portfolio.principles.map((principle, index) => (
            <li key={principle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{principle}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export function ProjectsDocument() {
  return (
    <article className="profile-document route-document projects-document">
      <DocumentCommand command="ls" file="projects.dir" />

      <section className="document-section document-intro" aria-labelledby="projects-title">
        <p className="document-label">01 · SELECTED WORK</p>
        <h1 id="projects-title">Projects.</h1>
        <p className="document-headline">
          Mobile applications, crypto products, AI tools, streaming platforms, and web experiences shipped across industries.
        </p>
      </section>

      <hr />

      <ol className="project-list" aria-label="Project portfolio">
        {portfolio.projects.map((project, index) => (
          <li key={project.title}>
            <article className="project-item">
              <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="project-content">
                <div className="project-heading">
                  <div>
                    <p>{project.category}</p>
                    <h2>{project.title}</h2>
                  </div>
                  <span><i /> {project.status}</span>
                </div>
                <p className="project-description">{project.description}</p>
                <ul className="project-highlights" aria-label={`${project.title} highlights`}>
                  {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <div className="project-footer">
                  <div className="project-tags" aria-label={`${project.title} technologies`}>
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <a href={project.href} target="_blank" rel="noreferrer">View live ↗</a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function ContactDocument() {
  const channels = [
    {
      label: "Email",
      value: portfolio.contact.email,
      href: `mailto:${portfolio.contact.email}`,
      external: false,
    },
    {
      label: "LinkedIn",
      value: "/in/amir-abasi",
      href: portfolio.social.linkedin,
      external: true,
    },
    {
      label: "X",
      value: "@lamirabasil",
      href: portfolio.social.twitter,
      external: true,
    },
    {
      label: "Instagram",
      value: "@amirabasi___",
      href: portfolio.social.instagram,
      external: true,
    },
    {
      label: "Resume",
      value: portfolio.resume.label,
      href: portfolio.resume.href,
      external: true,
    },
  ] as const;

  return (
    <article className="profile-document route-document">
      <DocumentCommand command="cat" file="contact.sh" />

      <section className="document-section contact-document" aria-labelledby="contact-title">
        <p className="contact-kicker"><b aria-hidden="true" /> CONTACT</p>
        <h1 id="contact-title">Let&apos;s build something together.</h1>
        <p className="document-headline">
          Tell me about a role, or tell me about a project. Pick a channel — I reply within 24 hours, weekdays.
        </p>

        <ul className="contact-channels" aria-label="Contact channels">
          {channels.map((channel, index) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
              >
                <span className="contact-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="contact-label">{channel.label}</span>
                <span className="contact-value">{channel.value}</span>
                <span className="contact-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="contact-tip">tip — best opener is one line on what you&apos;re building + your timeline.</p>
      </section>
    </article>
  );
}

export function SkillsDocument() {
  const skillsJson = JSON.stringify(
    {
      stack: portfolio.skills,
      focus: ["Flutter", "React", "Full-stack"],
      years: portfolio.intro.experience,
    },
    null,
    2,
  );

  return (
    <article className="profile-document route-document">
      <DocumentCommand command="cat" file="skills.json" />

      <section className="document-section document-intro" aria-labelledby="skills-file-title">
        <p className="document-label">01 · SKILLS</p>
        <h1 id="skills-file-title">skills.json</h1>
        <p className="document-headline">
          Core technologies used across mobile, web, and full-stack delivery.
        </p>
      </section>

      <hr />

      <section className="document-section code-document" aria-label="Skills JSON">
        <pre><code>{skillsJson}</code></pre>
      </section>
    </article>
  );
}

export function PeerReviewsDocument() {
  const reviews = [
    {
      stamp: "2025-11-02 14:22:08",
      source: "client.exchange",
      message: "Shipped a production-ready Flutter trading app with clear communication and steady delivery.",
    },
    {
      stamp: "2025-08-19 09:41:33",
      source: "client.wallet",
      message: "Handled sensitive crypto wallet flows carefully — security and UX both felt intentional.",
    },
    {
      stamp: "2025-04-07 16:05:51",
      source: "client.education",
      message: "Turned a language-learning product into a polished cross-platform experience on a tight timeline.",
    },
    {
      stamp: "2024-12-11 11:18:02",
      source: "peer.fullstack",
      message: "Owns the path from API to pixel. Reliable collaborator on complex multi-platform work.",
    },
  ];

  return (
    <article className="profile-document route-document">
      <DocumentCommand command="tail" file="peer_reviews.log" />

      <section className="document-section document-intro" aria-labelledby="reviews-title">
        <p className="document-label">01 · PEER REVIEWS</p>
        <h1 id="reviews-title">peer_reviews.log</h1>
        <p className="document-headline">
          Recent feedback from clients and collaborators across shipped products.
        </p>
      </section>

      <hr />

      <section className="document-section log-document" aria-label="Peer review log">
        <ul>
          {reviews.map((review) => (
            <li key={review.stamp}>
              <code>[{review.stamp}]</code>
              <span>{review.source}</span>
              <p>{review.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function CodingActivityDocument() {
  const activity = portfolio.projects.slice(0, 8).map((project, index) => ({
    stamp: `2026-${String(7 - (index % 6)).padStart(2, "0")}-${String(22 - index).padStart(2, "0")} ${String(9 + index).padStart(2, "0")}:${String(14 + index * 3).padStart(2, "0")}:00`,
    action: index % 2 === 0 ? "ship" : "iterate",
    target: project.title,
    detail: project.highlights[0],
  }));

  return (
    <article className="profile-document route-document">
      <DocumentCommand command="tail" file="coding_activity.log" />

      <section className="document-section document-intro" aria-labelledby="activity-title">
        <p className="document-label">01 · CODING ACTIVITY</p>
        <h1 id="activity-title">coding_activity.log</h1>
        <p className="document-headline">
          A rolling log of recent shipping and iteration across selected work.
        </p>
      </section>

      <hr />

      <section className="document-section log-document" aria-label="Coding activity log">
        <ul>
          {activity.map((entry) => (
            <li key={`${entry.stamp}-${entry.target}`}>
              <code>[{entry.stamp}]</code>
              <span>{entry.action}</span>
              <p>
                <strong>{entry.target}</strong> — {entry.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
