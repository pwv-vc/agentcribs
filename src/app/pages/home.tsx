import { CommunitySection } from "@/app/components/community-section";
import { EventSection } from "@/app/components/event-section";
import { FaqSection } from "@/app/components/faq-section";
import { HeroSection } from "@/app/components/hero-section";
import { PodcastSection } from "@/app/components/podcast-section";
import { JsonLd } from "@/app/components/json-ld";
import { Seo } from "@/app/components/seo";
import { getFeaturedEvent, type Event } from "@/app/queries/events";
import { getFeaturedPodcast } from "@/app/queries/podcasts";
import { getFaqs, type Faq } from "@/app/queries/faqs";

function faqToPlainText(faq: Faq): string {
  return faq.content
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSchema(
  featuredEvent: Event | null,
  faqs: Faq[],
): Record<string, unknown> {
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Organization",
      "@id": "https://pwv.agentcribs.com/#organization",
      name: "AgentCribs",
      url: "https://pwv.agentcribs.com/",
      description:
        "AgentCribs is a curated PWV community project for people already building with AI agents and agentic software development workflows.",
      parentOrganization: {
        "@type": "Organization",
        name: "PWV",
        url: "https://pwv.com/",
      },
      sameAs: ["https://pwv.com/"],
      potentialAction: {
        "@type": "JoinAction",
        name: "Apply to join AgentCribs",
        target: "https://pwv.agentcribs.com/apply",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://pwv.agentcribs.com/#webpage",
      url: "https://pwv.agentcribs.com/",
      name: "AgentCribs | A Curated Community for Agentic Software Builders",
      description:
        "AgentCribs is a curated PWV community for builders working with AI agents. Apply to join the waitlist for upcoming events and community opportunities.",
      inLanguage: "en-US",
      about: { "@id": "https://pwv.agentcribs.com/#organization" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://pwv.agentcribs.com/og-image.png?v=5",
        width: 1200,
        height: 630,
      },
      isPartOf: {
        "@type": "WebSite",
        name: "AgentCribs",
        url: "https://pwv.agentcribs.com/",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://pwv.agentcribs.com/#faq",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqToPlainText(faq),
        },
      })),
    },
  ];

  if (featuredEvent) {
    const speakers = featuredEvent.speakers.map((s) => ({
      "@type": "Person",
      name: s.name,
      ...(s.affiliation
        ? { affiliation: { "@type": "Organization", name: s.affiliation } }
        : {}),
    }));

    graph.push({
      "@type": "Event",
      "@id": `https://pwv.agentcribs.com/#${featuredEvent.id}-event`,
      name: featuredEvent.title,
      description: featuredEvent.content.slice(0, 300),
      startDate: featuredEvent.date,
      url: `https://pwv.agentcribs.com/community/events/${featuredEvent.id}`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: featuredEvent.location,
      },
      organizer: {
        "@type": "Organization",
        name: "PWV",
        url: "https://pwv.com/",
      },
      potentialAction: {
        "@type": "RegisterAction",
        name: "Apply to join AgentCribs",
        target: "https://pwv.agentcribs.com/apply",
      },
      performer: speakers,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export const Home = async () => {
  const [featuredEvent, featuredPodcast, faqs] = await Promise.all([
    getFeaturedEvent(),
    getFeaturedPodcast(),
    getFaqs(),
  ]);
  const schema = buildSchema(featuredEvent, faqs);

  return (
    <>
      <Seo
        title="AgentCribs | A Curated Community for Agentic Software Builders"
        description="AgentCribs is a curated PWV community for builders working with AI agents. Apply to join the waitlist for upcoming events and community opportunities."
      />
      <JsonLd schema={schema} />
      <HeroSection />
      <PodcastSection podcast={featuredPodcast} />
      <CommunitySection />
      <EventSection event={featuredEvent} />
      <FaqSection />
    </>
  );
};
