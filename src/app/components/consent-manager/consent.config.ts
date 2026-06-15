import type { ConsentManagerProviderProps } from "@c15t/react";
import { C15T_ROUTE_PREFIX } from "@/app/shared/c15t";
import { APP_URL } from "@/app/lib/url";

export const consentOptions = {
  mode: "hosted" as const,
  backendURL: C15T_ROUTE_PREFIX,
  consentCategories: ["necessary", "measurement", "marketing"] as const,
  colorScheme: "system" as const,
  legalLinks: {
    privacyPolicy: { href: `${APP_URL}/privacy` },
    termsOfService: { href: `${APP_URL}/terms` },
  },
  theme: {
    colors: {
      primary: "#0a6b63",
      primaryHover: "#054640",
      surface: "#ffffff",
      surfaceHover: "#fff9da",
      text: "#141414",
      textMuted: "#48473d",
      textOnPrimary: "#0d0d0d",
      border: "#dad6c9",
      switchTrack: "#e4e4e4",
      switchTrackActive: "#0cd2c8",
      switchThumb: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    dark: {
      primary: "#0cd2c8",
      primaryHover: "#3dded3",
      surface: "#141413",
      surfaceHover: "#1f1f1d",
      text: "#f0ecdb",
      textMuted: "#c8c2ae",
      textOnPrimary: "#0d0d0d",
      border: "#3d3c35",
      switchTrack: "#1f1f1d",
      switchTrackActive: "#0cd2c8",
      switchThumb: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.7)",
    },
    radius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      full: "9999px",
    },
    spacing: {
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    typography: {
      fontFamily:
        '"DM Sans Variable", Inter, system-ui, -apple-system, sans-serif',
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
      },
    },
    consentActions: {
      default: { mode: "stroke" as const },
      accept: { variant: "primary" as const, mode: "filled" as const },
      customize: { variant: "neutral" as const, mode: "ghost" as const },
    },
    slots: {
      consentBannerCard: "shadow-xl rounded-xl max-w-[440px]",
      consentBannerFooter: "border-t border-border",
      consentBannerTitle: "text-lg font-semibold",
    },
  },
} satisfies ConsentManagerProviderProps["options"];
