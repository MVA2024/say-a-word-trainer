'use strict'

const cacheName = 'say-a-word-shell-v1'
const indexPage = new URL('./index.html', self.registration.scope).href

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) =>
    cache.add(new Request(indexPage, { cache: 'reload' }))
  ))
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  const url = new URL(event.request.url)
  const root = new URL(self.registration.scope)
  if (url.origin !== root.origin || ![root.pathname, new URL(indexPage).pathname].includes(url.pathname)) return
  event.respondWith(fetch(event.request).catch(async () => {
    const cache = await caches.open(cacheName)
    return (await cache.match(indexPage)) || Response.error()
  }))
})
