toCache = ["/p5.js"];

this.addEventListener('install', (event) => {
    console.log("install");
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll(toCache);
        })
    );

});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('v1').then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) { 
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});