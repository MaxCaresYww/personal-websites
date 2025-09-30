const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true)
      
      // Handle the request
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Personal website ready on http://${hostname}:${port}`)
      console.log(`> Environment: ${process.env.NODE_ENV}`)
    })
    
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    process.exit(0)
  })
  
  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully')
    process.exit(0)
  })
})