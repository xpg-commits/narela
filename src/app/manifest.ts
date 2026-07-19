import type { MetadataRoute } from "next"

// capture_links isn't in Next's Manifest type yet — it's a Chromium-only,
// still-experimental Web App Manifest field (no effect on browsers that
// don't recognize it, including iOS Safari, which has no equivalent at all).
type ManifestWithLinkCapture = MetadataRoute.Manifest & {
  capture_links?: "none" | "new-client" | "existing-client-navigate" | "existing-client-event"
}

export default function manifest(): ManifestWithLinkCapture {
  return {
    name: "wwwelly — La memoria de tu hogar",
    short_name: "wwwelly",
    description:
      "La app que recuerda por ti todo lo que normalmente llevas en la cabeza.",
    start_url: "/dashboard",
    // Explicit, not left to default inference — capture_links only applies
    // within scope, and invitation links (/invitacion/[id]) need to be
    // covered too, not just start_url's own directory.
    scope: "/",
    capture_links: "existing-client-navigate",
    display: "standalone",
    background_color: "#FBF7F3",
    theme_color: "#FBF7F3",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
