import type { Plugin, ViteDevServer } from 'vite'

const virtualCssPath = '/@virtual:ssr-css.css'
const collectedStyles = new Map<string, string>()

export function pluginSsrDevCssFix(): Plugin {
  let server: ViteDevServer

  return {
    name: 'ssr-dev-css-fix',
    apply: 'serve',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return null
      if (id.includes('.css')) {
        collectedStyles.set(id, code)
      }
      return null
    },
    configureServer(server_) {
      server = server_

      server.middlewares.use((req, res, next) => {
        if (req.url === virtualCssPath) {
          res.setHeader('Content-Type', 'text/css')
          res.write(Array.from(collectedStyles.values()).join('\n'))
          res.end()
          return
        }
        next()
      })
    },
    transformIndexHtml: {
      handler: async () => {
        return [
          {
            tag: 'link',
            injectTo: 'head',
            attrs: {
              rel: 'stylesheet',
              href: virtualCssPath,
            },
          },
        ]
      },
    },
  }
}
