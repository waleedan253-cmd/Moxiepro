// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";

// // export default defineConfig({
// //   plugins: [react()],
// //   base: "/",
// //   server: {
// //     port: 3000,
// //     open: true,
// //     // Remove the proxy section entirely
// //   },
// //   build: {
// //     outDir: "dist",
// //     assetsDir: "assets",
// //     sourcemap: false,
// //   },
// // });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   base: "/",
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000", // You'd run a separate Express server here
//         changeOrigin: true,
//       },
//     },
//   },
//   build: {
//     outDir: "dist",
//     assetsDir: "assets",
//     sourcemap: false,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5173, // Change to 5173 to avoid conflict with Vercel Dev
    open: true,
    // NO PROXY - Vercel Dev handles this
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
