import { serializeJsonLd } from "@/lib/seo";

/** Server-rendered structured data. Adds no client JavaScript. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
