import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteImagemin from "vite-plugin-imagemin";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Only enable heavy image optimization during production build
    ...(process.env.NODE_ENV === "production"
      ? [
          viteImagemin({
            gifsicle: { optimizationLevel: 7 }, // optimize GIFs
            optipng: { optimizationLevel: 7 }, // optimize PNGs
            mozjpeg: { quality: 80 }, // compress JPEGs
            pngquant: { quality: [0.7, 0.9], speed: 4 }, // balanced PNG compression
            svgo: {
              // optimize SVGs
              plugins: [
                { name: "removeViewBox" },
                { name: "removeEmptyAttrs", active: false },
              ],
            },
            webp: { quality: 80 }, // output WebP if you import .webp
          }),
          visualizer({ filename: "dist/bundle-report.html", open: false }),
        ]
      : []),
  ],
  // Improve chunking for production builds so the main chunk stays small
  build: {
    rollupOptions: {
      output: {
        // Group by package name (handles scoped packages) to avoid splitting a package across chunks
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Extract the package name from the path. Examples:
          // node_modules/react/... -> react
          // node_modules/@headlessui/react/... -> @headlessui/react
          const nm = "node_modules";
          const idx = id.lastIndexOf(nm);
          if (idx === -1) return;
          const rel = id.slice(idx + nm.length + 1); // path after node_modules/
          const parts = rel.split(/[/\\]/);
          let pkg = parts[0];
          if (pkg && pkg.startsWith("@") && parts.length > 1)
            pkg = `${pkg}/${parts[1]}`;

          switch (pkg) {
            case "react":
            case "react-dom":
            case "scheduler":
              return "vendor-react";
            // Keep React-related UI/runtime libs together to avoid circular import/init order issues
            case "@gsap/react":
            case "gsap":
            case "@floating-ui/react":
            case "@floating-ui/dom":
            case "@floating-ui/core":
            case "@popperjs/core":
              return "vendor-react";
            case "react-router":
            case "react-router-dom":
            case "@remix-run/router":
              // Keep router packages with react to avoid circular init issues
              return "vendor-react";
            case "swiper":
              return "vendor-swiper";
            case "lucide-react":
              return "vendor-lucide";
            case "@headlessui/react":
              return "vendor-headlessui";
            case "axios":
              return "vendor-axios";
            case "gsap":
            case "gsap/ScrollTrigger":
              return "vendor-gsap";
            default:
              return "vendor";
          }
        },
      },
    },
  },
});
