self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("card-app").then(c=>{
      return c.addAll(["card.html","manifest.json"]);
    })
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
