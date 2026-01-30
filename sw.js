self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("cards-app").then(c=>{
      return c.addAll(["cards.html","card.html","manifest.json"]);
    })
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
