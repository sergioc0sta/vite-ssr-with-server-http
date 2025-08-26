import fs from 'fs/promises'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'
const port = 5173

const SSR_ROUTES = ['/'] //  Just Home page with SSR

async function createSSRServer() {
  let vite: any = null

  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
  }

  const server = createServer(async (req, res) => {
    try {
      const url = req.url || '/'

      if (!isProduction && vite && (
        url.startsWith('/@') ||
        url.startsWith('/src/') ||
        url.startsWith('/node_modules/') ||
        url.includes('.js') ||
        url.includes('.ts') ||
        url.includes('.tsx') ||
        url.includes('.jsx') ||
        url.includes('.css') ||
        url.includes('.scss') ||
        url.includes('.sass') ||
        url.includes('.less') ||
        url.includes('.svg') ||
        url.includes('.png') ||
        url.includes('.jpg') ||
        url.includes('.jpeg') ||
        url.includes('.gif') ||
        url.includes('.webp') ||
        url.includes('.ico')
      )) {
        return new Promise<void>((resolve) => {
          vite.middlewares(req, res, () => resolve())
        })
      }

      let template: string

      if (!isProduction && vite) {
        template = await fs.readFile(path.resolve(__dirname, '../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
      } else {
        template = await fs.readFile(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8')
      }

      const shouldUseSSR = SSR_ROUTES.includes(url) || url === '/'

      if (shouldUseSSR) {
        let render: (url: string) => Promise<{ html: string }>

        if (!isProduction && vite) {
          const mod = await vite.ssrLoadModule('/src/entry-server.tsx')
          render = mod.render
        } else {
          const mod = await import('../dist/server/entry-server.js')
          render = mod.render
        }

        const { html } = await render(url)

        const jsonLD = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "SSR with Vite and TypeScript",
          description: "Server-side rendered homepage",
          url: `http://localhost:${port}${url}`
        }

        const finalHtml = template
          .replace('<!--json-ld-->', `<script type="application/ld+json">${JSON.stringify(jsonLD, null, 2)}</script>`)
          .replace('<!--ssr-outlet-->', html)

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(finalHtml)
      } else {
        const csr_template = template
          .replace('<!--json-ld-->', '') 
          .replace('<!--ssr-outlet-->', '<div id="root"></div>') 

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(csr_template)
      }

    } catch (error: any) {
      if (vite) vite.ssrFixStacktrace(error)
      console.error('❌ Server error:', error.stack)
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.end(error.stack)
    }
  })

  return { server, vite }
}

createSSRServer().then(({ server }) => {
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    console.log(`SSR routes: ${SSR_ROUTES.join(', ')}`)
    console.log('All other routes will be CSR')
  })
})
