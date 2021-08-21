import { homeHandler } from './home'
import { scrapeHandler } from './scraper'

const handleRequest = request => {
  try {
    if (request.method === 'GET' && new URL(request.url).pathname === '/') {
      return homeHandler(request)
    }
    return new Response('not found', {status: 404})
  } catch (error) {
    return new Response('internal server error', {status: 500})
  }
}

addEventListener('fetch', event => event.respondWith(handleRequest(event.request)))
addEventListener('scheduled', event => event.waitUntil(scrapeHandler(event)))
