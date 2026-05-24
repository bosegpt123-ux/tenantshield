'use strict'
const http           = require('http')
const fs             = require('fs')
const path           = require('path')
const { pathToFileURL } = require('url')

// Load .env.local without any external packages
try {
  const text = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const PORT = 3001

async function main() {
  // api/chat.js is ESM (package.json "type":"module") — must use dynamic import from CJS
  const handlerUrl = pathToFileURL(path.join(__dirname, 'api', 'chat.js')).href
  const { default: handler } = await import(handlerUrl)

  const server = http.createServer((req, res) => {
    if (req.url !== '/api/chat') {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    let raw = ''
    req.on('data', chunk => { raw += chunk })
    req.on('end', async () => {
      try { req.body = JSON.parse(raw || '{}') } catch { req.body = {} }

      // Adapt native ServerResponse to the Vercel-style API used in api/chat.js
      res.status = (code) => { res.statusCode = code; return res }
      res.json   = (data) => {
        if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }

      try {
        await handler(req, res)
      } catch (err) {
        console.error('Handler error:', err)
        if (!res.headersSent) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      }
    })
  })

  server.listen(PORT, () => {
    console.log(`\n  API dev server ready → http://localhost:${PORT}/api/chat\n`)
  })
}

main().catch(err => {
  console.error('Failed to start dev server:', err)
  process.exit(1)
})
