import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  server: {
    port: 5000,
  },
  html: { template: "public/index.html", title: "" },
  plugins: [pluginReact()],
});
