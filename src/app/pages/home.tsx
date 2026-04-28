import { CommunitySection } from "@/app/components/community-section";
import { EventSection } from "@/app/components/event-section";
import { FaqSection } from "@/app/components/faq-section";
import { HeroSection } from "@/app/components/hero-section";
import { HowItWorksSection } from "@/app/components/how-it-works-section";
import { JsonLd } from "@/app/components/json-ld";
import { PwvSection } from "@/app/components/pwv-section";
import { Seo } from "@/app/components/seo";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://agentcribs.com/#organization",
      name: "AgentCribs",
      url: "https://agentcribs.com/",
      description:
        "AgentCribs is a curated PWV community for founders, developers, and hackers building tools and workflows for agentic software development.",
      parentOrganization: {
        "@type": "Organization",
        name: "PWV",
        url: "https://pwv.com/",
      },
      sameAs: ["https://pwv.com/"],
    },
    {
      "@type": "WebPage",
      "@id": "https://agentcribs.com/#webpage",
      url: "https://agentcribs.com/",
      name: "AgentCribs | PWV Community + May 6 Event in San Francisco",
      description:
        "AgentCribs is a curated PWV community for builders working with AI agents. Apply for May 6 in San Francisco with Peter Levine and Tom Preston-Werner.",
      about: { "@id": "https://agentcribs.com/#organization" },
      isPartOf: {
        "@type": "WebSite",
        name: "AgentCribs",
        url: "https://agentcribs.com/",
      },
    },
    {
      "@type": "Event",
      "@id": "https://agentcribs.com/#may-6-event",
      name: "AgentCribs: Show & Tell, hosted by PWV",
      description:
        "An evening gathering in San Francisco for PWV founders, seasoned developers, and selected builders focused on agentic software development, with a fireside chat between Peter Levine and Tom Preston-Werner.",
      startDate: "2026-05-06",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "San Francisco",
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Francisco",
          addressRegion: "CA",
          addressCountry: "US",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "PWV",
        url: "https://pwv.com/",
      },
      performer: [
        {
          "@type": "Person",
          name: "Peter Levine",
          affiliation: { "@type": "Organization", name: "a16z" },
        },
        {
          "@type": "Person",
          name: "Tom Preston-Werner",
          description: "GitHub co-founder and PWV founder/investor",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://agentcribs.com/#faq",
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
          name: "Is the May 6 AgentCribs event public?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The event is curated and space is limited. Apply to join AgentCribs first. Selected applicants will receive a separate registration invite.",
          },
        },
        {
          "@type": "Question",
          name: "What if I cannot attend on May 6?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You should still apply. AgentCribs will follow up with selected applicants about future opportunities online and in person.",
          },
        },
      ],
    },
  ],
};

export const Home = () => {
  return (
    <>
      <Seo
        title="PWV Community + May 6 Event in San Francisco"
        description="AgentCribs is a curated PWV community for builders working with AI agents. Apply for May 6 in San Francisco with Peter Levine and Tom Preston-Werner."
      />
      <JsonLd schema={schema} />
      <HeroSection />
      <EventSection />
      <CommunitySection />
      <HowItWorksSection />
      <PwvSection />
      <FaqSection />
    </>
  );
};
