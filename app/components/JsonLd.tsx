import { footerConfig } from "../config/footer";
import { siteConfig, siteUrl } from "../config/site";

export function JsonLd() {
  const sameAs = Object.values(footerConfig.social).filter(
    (href) => typeof href === "string" && href.startsWith("http")
  );

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.siteName,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: siteConfig.person.name,
      alternateName: [...siteConfig.person.alternateNames],
      jobTitle: [...siteConfig.person.jobTitle],
      url: siteUrl,
      sameAs,
      knowsAbout: [
        "Software engineering",
        "Mechanical engineering",
        "Mechatronics",
        "Robotics",
        "STEAM",
      ],
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
