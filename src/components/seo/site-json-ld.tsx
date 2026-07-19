import { getJsonLdGraph } from "@/lib/seo";

export function SiteJsonLd() {
  const jsonLd = getJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
