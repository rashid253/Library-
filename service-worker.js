self.addEventListener("install",e=>{
 e.waitUntil(
  caches.open("card").then(c=>{
   return c.addAll([
    "index.html",
    "card.html",
    "style.css",
    "app.js",
    "card.js"
   ]);
  })
 );
});
self.addEventListener("fetch",e=>{
 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 );
});
