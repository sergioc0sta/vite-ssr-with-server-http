import fs from "fs/promises";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
const port = 5173;

async function createSSRServer() {
  let vite: any = null;

  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
  }

  const server = createServer(async (req, res) => {
    try {
      const url = req.url || "/";

      if (!isProduction && vite) {
        //  I add to condition all, I dont know witch can be use
        if (
          url.startsWith("/@") ||
          url.startsWith("/src/") ||
          url.startsWith("/node_modules/") ||
          url.includes(".js") ||
          url.includes(".ts") ||
          url.includes(".tsx") ||
          url.includes(".jsx") ||
          url.includes(".css") ||
          url.includes(".scss") ||
          url.includes(".sass") ||
          url.includes(".less") ||
          url.includes(".svg") ||
          url.includes(".png") ||
          url.includes(".jpg") ||
          url.includes(".jpeg") ||
          url.includes(".gif") ||
          url.includes(".webp") ||
          url.includes(".ico")
        ) {
          return new Promise<void>((resolve) => {
            vite.middlewares(req, res, () => resolve());
          });
        }
      }

      let template: string, render: (url: string) => Promise<{ html: string }>;

      if (!isProduction && vite) {
        template = await fs.readFile(
          path.resolve(__dirname, "../index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
        const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
        render = mod.render;
      } else {
        template = await fs.readFile(
          path.resolve(__dirname, "../dist/client/index.html"),
          "utf-8",
        );
        const mod = await import("../dist/server/entry-server.js");
        render = mod.render;
      }

      const { html } = await render(url);

      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "SSR + Vite + TypeScript and Json+LD",
        description: "Hydratation in cool mode",
        url: `http://localhost:${port}${url}`,
      };

      const finalHtml = template
        .replace(
          "<!--json-ld-->",
          `<script type="application/ld+json">${JSON.stringify(jsonLD, null, 2)}</script>`,
        )
        .replace("<!--ssr-outlet-->", html);

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(finalHtml);
    } catch (error: any) {
      if (vite) vite.ssrFixStacktrace(error);
      console.error("❌ Erro SSR:", error.stack);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(error.stack);
    }
  });

  return { server, vite };
}

createSSRServer().then(({ server }) => {
  server.listen(port, () => {
    console.log(`🚀 SSR running http://localhost:${port}`);
  });
});
