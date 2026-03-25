import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NIKAHKU — Wedding Planner",
    short_name: "NIKAHKU",
    description: "Platform perencanaan pernikahan lengkap",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#8B6F4E",
    orientation: "portrait-primary",
    categories: ["lifestyle", "productivity"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
