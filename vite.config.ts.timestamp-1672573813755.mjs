// vite.config.ts
import { defineConfig } from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/vite@4.0.1_@types+node@18.11.15/node_modules/vite/dist/node/index.js";
import UnoCSS from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/unocss@0.47.6_vite@4.0.1/node_modules/unocss/dist/vite.mjs";
import { presetTagify, presetIcons, extractorSvelte } from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/unocss@0.47.6_vite@4.0.1/node_modules/unocss/dist/index.mjs";
import { imagetools } from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/vite-imagetools@4.0.11/node_modules/vite-imagetools/dist/index.mjs";
import { SvelteKitPWA } from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/@vite-pwa+sveltekit@0.0.1_n46hanechhcb4seycmn3d5vts4/node_modules/@vite-pwa/sveltekit/dist/index.mjs";
import { sveltekit } from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/@sveltejs+kit@1.0.0_svelte@3.55.0+vite@4.0.1/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import TailwindCSS from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/tailwindcss@3.2.4_postcss@8.4.20/node_modules/tailwindcss/lib/index.js";

// src/lib/config/general.ts
var theme = [
  {
    name: "cmyk",
    text: "\u{1F5A8} Light"
  },
  {
    name: "dracula",
    text: "\u{1F9DB} Dark"
  },
  {
    name: "valentine",
    text: "\u{1F338} Valentine"
  },
  {
    name: "aqua",
    text: "\u{1F4A6} Aqua"
  },
  {
    name: "synthwave",
    text: "\u{1F303} Synthwave"
  },
  {
    name: "night",
    text: "\u{1F303} Night"
  },
  {
    name: "lofi",
    text: "\u{1F3B6} Lo-Fi"
  },
  {
    name: "lemonade",
    text: "\u{1F34B} Lemonade"
  },
  {
    name: "cupcake",
    text: "\u{1F9C1} Cupcake"
  },
  {
    name: "garden",
    text: "\u{1F3E1} Garden"
  },
  {
    name: "retro",
    text: "\u{1F307} Retro"
  },
  {
    name: "black",
    text: "\u{1F5A4} Black"
  }
];

// tailwind.config.ts
import typography from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/@tailwindcss+typography@0.5.8_tailwindcss@3.2.4/node_modules/@tailwindcss/typography/src/index.js";
import daisyui from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/daisyui@2.43.2_r4gnkvssmvyxmi2wmat5xbx36a/node_modules/daisyui/src/index.js";
var tailwind_config_default = {
  content: ["./src/**/*.{html,md,js,svelte,ts}"],
  theme: { extend: {} },
  plugins: [typography, daisyui],
  daisyui: { themes: theme.map(({ name }) => name) }
};

// vite.config.ts
import autoprefixer from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/autoprefixer@10.4.13_postcss@8.4.20/node_modules/autoprefixer/lib/autoprefixer.js";
import cssnano from "file:///home/avik/Desktop/git_projects/github-pages/blog-post/node_modules/.pnpm/cssnano@5.1.14_postcss@8.4.20/node_modules/cssnano/src/index.js";
var vite_config_default = defineConfig({
  envPrefix: "URARA_",
  css: {
    postcss: {
      plugins: [
        TailwindCSS(tailwind_config_default),
        autoprefixer(),
        ...process.env.NODE_ENV === "production" ? [
          cssnano({
            preset: ["default", { discardComments: { removeAll: true } }]
          })
        ] : []
      ]
    }
  },
  plugins: [
    UnoCSS({
      include: [/\.svelte$/, /\.md?$/, /\.ts$/],
      extractors: [extractorSvelte],
      presets: [
        presetTagify({
          extraProperties: (matched) => matched.startsWith("i-") ? { display: "inline-block" } : {}
        }),
        presetIcons({ scale: 1.5 })
      ]
    }),
    imagetools(),
    sveltekit(),
    SvelteKitPWA({
      registerType: "autoUpdate",
      manifest: false,
      scope: "/",
      workbox: {
        globPatterns: ["posts.json", "**/*.{js,css,html,svg,ico,png,webp,avif}"],
        globIgnores: ["**/sw*", "**/workbox-*"]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL2xpYi9jb25maWcvZ2VuZXJhbC50cyIsICJ0YWlsd2luZC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hdmlrL0Rlc2t0b3AvZ2l0X3Byb2plY3RzL2dpdGh1Yi1wYWdlcy9ibG9nLXBvc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2F2aWsvRGVza3RvcC9naXRfcHJvamVjdHMvZ2l0aHViLXBhZ2VzL2Jsb2ctcG9zdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hdmlrL0Rlc2t0b3AvZ2l0X3Byb2plY3RzL2dpdGh1Yi1wYWdlcy9ibG9nLXBvc3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlIGRlZmluZSBjb25maWdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG4vLyB2aXRlIHBsdWdpblxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7IHByZXNldFRhZ2lmeSwgcHJlc2V0SWNvbnMsIGV4dHJhY3RvclN2ZWx0ZSB9IGZyb20gJ3Vub2NzcydcbmltcG9ydCB7IGltYWdldG9vbHMgfSBmcm9tICd2aXRlLWltYWdldG9vbHMnXG5pbXBvcnQgeyBTdmVsdGVLaXRQV0EgfSBmcm9tICdAdml0ZS1wd2Evc3ZlbHRla2l0J1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xuLy8gcG9zdGNzcyAmIHRhaWx3aW5kY3NzXG5pbXBvcnQgVGFpbHdpbmRDU1MgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgdGFpbHdpbmRDb25maWcgZnJvbSAnLi90YWlsd2luZC5jb25maWcnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCBjc3NuYW5vIGZyb20gJ2Nzc25hbm8nXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGVudlByZWZpeDogJ1VSQVJBXycsXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgVGFpbHdpbmRDU1ModGFpbHdpbmRDb25maWcpLFxuICAgICAgICBhdXRvcHJlZml4ZXIoKSxcbiAgICAgICAgLi4uKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcbiAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgY3NzbmFubyh7XG4gICAgICAgICAgICAgICAgcHJlc2V0OiBbJ2RlZmF1bHQnLCB7IGRpc2NhcmRDb21tZW50czogeyByZW1vdmVBbGw6IHRydWUgfSB9XVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXVxuICAgICAgICAgIDogW10pXG4gICAgICBdXG4gICAgfVxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgVW5vQ1NTKHtcbiAgICAgIGluY2x1ZGU6IFsvXFwuc3ZlbHRlJC8sIC9cXC5tZD8kLywgL1xcLnRzJC9dLFxuICAgICAgZXh0cmFjdG9yczogW2V4dHJhY3RvclN2ZWx0ZV0sXG4gICAgICBwcmVzZXRzOiBbXG4gICAgICAgIHByZXNldFRhZ2lmeSh7XG4gICAgICAgICAgZXh0cmFQcm9wZXJ0aWVzOiAobWF0Y2hlZDogc3RyaW5nKSA9PiAobWF0Y2hlZC5zdGFydHNXaXRoKCdpLScpID8geyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyB9IDoge30pXG4gICAgICAgIH0pLFxuICAgICAgICBwcmVzZXRJY29ucyh7IHNjYWxlOiAxLjUgfSlcbiAgICAgIF1cbiAgICB9KSxcbiAgICBpbWFnZXRvb2xzKCksXG4gICAgc3ZlbHRla2l0KCksXG4gICAgU3ZlbHRlS2l0UFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgbWFuaWZlc3Q6IGZhbHNlLFxuICAgICAgc2NvcGU6ICcvJyxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJ3Bvc3RzLmpzb24nLCAnKiovKi57anMsY3NzLGh0bWwsc3ZnLGljbyxwbmcsd2VicCxhdmlmfSddLFxuICAgICAgICBnbG9iSWdub3JlczogWycqKi9zdyonLCAnKiovd29ya2JveC0qJ11cbiAgICAgIH1cbiAgICB9KVxuICBdXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hdmlrL0Rlc2t0b3AvZ2l0X3Byb2plY3RzL2dpdGh1Yi1wYWdlcy9ibG9nLXBvc3Qvc3JjL2xpYi9jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2F2aWsvRGVza3RvcC9naXRfcHJvamVjdHMvZ2l0aHViLXBhZ2VzL2Jsb2ctcG9zdC9zcmMvbGliL2NvbmZpZy9nZW5lcmFsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2F2aWsvRGVza3RvcC9naXRfcHJvamVjdHMvZ2l0aHViLXBhZ2VzL2Jsb2ctcG9zdC9zcmMvbGliL2NvbmZpZy9nZW5lcmFsLnRzXCI7aW1wb3J0IHR5cGUgeyBUaGVtZUNvbmZpZywgSGVhZENvbmZpZywgSGVhZGVyQ29uZmlnLCBGb290ZXJDb25maWcsIERhdGVDb25maWcsIEZlZWRDb25maWcgfSBmcm9tICckbGliL3R5cGVzL2dlbmVyYWwnXG5cbmV4cG9ydCBjb25zdCB0aGVtZTogVGhlbWVDb25maWcgPSBbXG5cdHtcblx0XHRuYW1lOiAnY215aycsXG5cdFx0dGV4dDogJ1x1RDgzRFx1RERBOCBMaWdodCdcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdkcmFjdWxhJyxcblx0XHR0ZXh0OiAnXHVEODNFXHVERERCIERhcmsnXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAndmFsZW50aW5lJyxcblx0XHR0ZXh0OiAnXHVEODNDXHVERjM4IFZhbGVudGluZSdcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdhcXVhJyxcblx0XHR0ZXh0OiAnXHVEODNEXHVEQ0E2IEFxdWEnXG5cdH0sXG5cdHtcblx0XHRuYW1lOiAnc3ludGh3YXZlJyxcblx0XHR0ZXh0OiAnXHVEODNDXHVERjAzIFN5bnRod2F2ZSdcblx0fSxcblx0e1xuXHRcdG5hbWU6ICduaWdodCcsXG5cdFx0dGV4dDogJ1x1RDgzQ1x1REYwMyBOaWdodCdcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdsb2ZpJyxcblx0XHR0ZXh0OiAnXHVEODNDXHVERkI2IExvLUZpJ1xuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ2xlbW9uYWRlJyxcblx0XHR0ZXh0OiAnXHVEODNDXHVERjRCIExlbW9uYWRlJ1xuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ2N1cGNha2UnLFxuXHRcdHRleHQ6ICdcdUQ4M0VcdUREQzEgQ3VwY2FrZSdcblx0fSxcblx0e1xuXHRcdG5hbWU6ICdnYXJkZW4nLFxuXHRcdHRleHQ6ICdcdUQ4M0NcdURGRTEgR2FyZGVuJ1xuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ3JldHJvJyxcblx0XHR0ZXh0OiAnXHVEODNDXHVERjA3IFJldHJvJ1xuXHR9LFxuXHR7XG5cdFx0bmFtZTogJ2JsYWNrJyxcblx0XHR0ZXh0OiAnXHVEODNEXHVEREE0IEJsYWNrJ1xuXHR9XG5dXG5cbmV4cG9ydCBjb25zdCBoZWFkOiBIZWFkQ29uZmlnID0ge31cblxuZXhwb3J0IGNvbnN0IGhlYWRlcjogSGVhZGVyQ29uZmlnID0ge1xuXHRuYXY6IFtcblx0XHR7XG5cdFx0XHR0ZXh0OiAnV2VsY29tZSBXZWIzIFdyaXRldXAnLFxuXHRcdFx0bGluazogJy9XZWxjb21lIFdlYjMnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0ZXh0OiAnWW9nb3NoYSBDaHJpc3RtYW5zIENURiAyMScsXG5cdFx0XHRsaW5rOiAnL1lvZ29zaGEgQ2hyaXN0bWFucyBDVEYgMjEnXG5cdFx0fVxuXHRdXG59XG5cbmV4cG9ydCBjb25zdCBmb290ZXI6IEZvb3RlckNvbmZpZyA9IHtcblx0bmF2OiBbXG5cdFx0e1xuXHRcdFx0dGV4dDogJ0ZlZWQnLFxuXHRcdFx0bGluazogJy9hdG9tLnhtbCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdHRleHQ6ICdTaXRlbWFwJyxcblx0XHRcdGxpbms6ICcvc2l0ZW1hcC54bWwnXG5cdFx0fVxuXHRdXG59XG5cbmV4cG9ydCBjb25zdCBkYXRlOiBEYXRlQ29uZmlnID0ge1xuXHRsb2NhbGVzOiAnZW4tVVMnLFxuXHRvcHRpb25zOiB7XG4gICAgICAgIHllYXI6ICdudW1lcmljJywgLy8gWWVhcjogYG51bWVyaWNgLCBgMi1kaWdpdFxuXHRcdHdlZWtkYXk6ICdsb25nJywgLy8gV2VlazogYG5hcnJvd2AsIGBzaG9ydGAsIGBsb25nYFxuXHRcdG1vbnRoOiAnc2hvcnQnLCAvLyBNb250aDogYG51bWVyaWNgLCBgMi1kaWdpdGAsIGBuYXJyb3dgLCBgc2hvcnRgLCBgbG9uZ2Bcblx0XHRkYXk6ICdudW1lcmljJyAvLyBkYXk6IGBudW1lcmljYCwgYDItZGlnaXRgXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGZlZWQ6IEZlZWRDb25maWcgPSB7fVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hdmlrL0Rlc2t0b3AvZ2l0X3Byb2plY3RzL2dpdGh1Yi1wYWdlcy9ibG9nLXBvc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2F2aWsvRGVza3RvcC9naXRfcHJvamVjdHMvZ2l0aHViLXBhZ2VzL2Jsb2ctcG9zdC90YWlsd2luZC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYXZpay9EZXNrdG9wL2dpdF9wcm9qZWN0cy9naXRodWItcGFnZXMvYmxvZy1wb3N0L3RhaWx3aW5kLmNvbmZpZy50c1wiO2ltcG9ydCB7IHRoZW1lIH0gZnJvbSAnLi9zcmMvbGliL2NvbmZpZy9nZW5lcmFsJ1xuLy8gQHRzLWlnbm9yZSBDb3VsZCBub3QgZmluZCBhIGRlY2xhcmF0aW9uIGZpbGUgZm9yIG1vZHVsZSAnQHRhaWx3aW5kY3NzL3R5cG9ncmFwaHknLlxuaW1wb3J0IHR5cG9ncmFwaHkgZnJvbSAnQHRhaWx3aW5kY3NzL3R5cG9ncmFwaHknXG4vLyBAdHMtaWdub3JlIENvdWxkIG5vdCBmaW5kIGEgZGVjbGFyYXRpb24gZmlsZSBmb3IgbW9kdWxlICdkYWlzeXVpJy5cbmltcG9ydCBkYWlzeXVpIGZyb20gJ2RhaXN5dWknXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29udGVudDogWycuL3NyYy8qKi8qLntodG1sLG1kLGpzLHN2ZWx0ZSx0c30nXSxcbiAgdGhlbWU6IHsgZXh0ZW5kOiB7fSB9LFxuICBwbHVnaW5zOiBbdHlwb2dyYXBoeSwgZGFpc3l1aV0sXG4gIGRhaXN5dWk6IHsgdGhlbWVzOiB0aGVtZS5tYXAoKHsgbmFtZSB9KSA9PiBuYW1lKSB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFFN0IsT0FBTyxZQUFZO0FBQ25CLFNBQVMsY0FBYyxhQUFhLHVCQUF1QjtBQUMzRCxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGlCQUFpQjtBQUUxQixPQUFPLGlCQUFpQjs7O0FDUGpCLElBQU0sUUFBcUI7QUFBQSxFQUNqQztBQUFBLElBQ0MsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBO0FBQUEsSUFDQyxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxJQUNDLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQTtBQUFBLElBQ0MsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBO0FBQUEsSUFDQyxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxJQUNDLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQTtBQUFBLElBQ0MsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBO0FBQUEsSUFDQyxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxJQUNDLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQTtBQUFBLElBQ0MsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBO0FBQUEsSUFDQyxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxJQUNDLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQ0Q7OztBQ2pEQSxPQUFPLGdCQUFnQjtBQUV2QixPQUFPLGFBQWE7QUFFcEIsSUFBTywwQkFBUTtBQUFBLEVBQ2IsU0FBUyxDQUFDLG1DQUFtQztBQUFBLEVBQzdDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtBQUFBLEVBQ3BCLFNBQVMsQ0FBQyxZQUFZLE9BQU87QUFBQSxFQUM3QixTQUFTLEVBQUUsUUFBUSxNQUFNLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUU7QUFDbkQ7OztBRkFBLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sYUFBYTtBQUVwQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixXQUFXO0FBQUEsRUFDWCxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxZQUFZLHVCQUFjO0FBQUEsUUFDMUIsYUFBYTtBQUFBLFFBQ2IsR0FBSSxRQUFRLElBQUksYUFBYSxlQUN6QjtBQUFBLFVBQ0UsUUFBUTtBQUFBLFlBQ04sUUFBUSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEtBQUssRUFBRSxDQUFDO0FBQUEsVUFDOUQsQ0FBQztBQUFBLFFBQ0gsSUFDQSxDQUFDO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxTQUFTLENBQUMsYUFBYSxVQUFVLE9BQU87QUFBQSxNQUN4QyxZQUFZLENBQUMsZUFBZTtBQUFBLE1BQzVCLFNBQVM7QUFBQSxRQUNQLGFBQWE7QUFBQSxVQUNYLGlCQUFpQixDQUFDLFlBQXFCLFFBQVEsV0FBVyxJQUFJLElBQUksRUFBRSxTQUFTLGVBQWUsSUFBSSxDQUFDO0FBQUEsUUFDbkcsQ0FBQztBQUFBLFFBQ0QsWUFBWSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQUEsTUFDNUI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLGFBQWE7QUFBQSxNQUNYLGNBQWM7QUFBQSxNQUNkLFVBQVU7QUFBQSxNQUNWLE9BQU87QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGNBQWMsQ0FBQyxjQUFjLDBDQUEwQztBQUFBLFFBQ3ZFLGFBQWEsQ0FBQyxVQUFVLGNBQWM7QUFBQSxNQUN4QztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
