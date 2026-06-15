import { CommunitySection } from "@/app/components/community-section";
import { EventSection } from "@/app/components/event-section";
import { FaqSection } from "@/app/components/faq-section";
import { HeroSection } from "@/app/components/hero-section";
import { JsonLd } from "@/app/components/json-ld";
import { Seo } from "@/app/components/seo";
import { getFeaturedEvent, type Event } from "@/app/queries/events";

function buildSchema(featuredEvent: Event | null): Record<string, unknown> {
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
      mainEntity: [
        {
          "@type": "Question",
          name: "Who should apply to AgentCribs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "People already building with AI agents, developer tools, command-line workflows, or agentic software development practices. The strongest fit is a technical founder, senior developer, or hands-on builder actively experimenting in real projects.",
          },
        },
        {
          "@type": "Question",
          name: "Are AgentCribs events public?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. AgentCribs events are curated and space is limited. Apply to join AgentCribs first. Selected applicants receive a separate registration invite for events.",
          },
        },
        {
          "@type": "Question",
          name: "How do applications work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Applications are reviewed by our team. Selected applicants receive invitations to upcoming events and community opportunities. If you are not selected for a particular event, you remain on our list for future opportunities online and in person.",
          },
        },
        {
          "@type": "Question",
          name: "What if I cannot attend an event?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You should still apply. We will follow up with selected applicants about future AgentCribs opportunities online and in person.",
          },
        },
        {
          "@type": "Question",
          name: "Where are events held?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Event locations vary. Venue details will be shared with registered attendees for each event.",
          },
        },
      ],
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
  const featuredEvent = await getFeaturedEvent();
  const schema = buildSchema(featuredEvent);

  return (
    <>
      <Seo
        title="AgentCribs | A Curated Community for Agentic Software Builders"
        description="AgentCribs is a curated PWV community for builders working with AI agents. Apply to join the waitlist for upcoming events and community opportunities."
      />
      <JsonLd schema={schema} />
      <HeroSection />
      <CommunitySection />
      <EventSection event={featuredEvent} />
      <FaqSection />
    </>
  );
};
