const test="radioLine";
const assets=["/","/index.html",'/styles/styles.css','/script/script.js']

self.addEventListener("install",installEvent=>{
    installEvent.waitUntil(caches.open(test).then(cache=>{
        cache.addAll(assets)
    }))
})
self.addEventListener("fetch",fetchEvent=>{
    fetchEvent.waitUntil(caches.match(fetchEvent.request).then(res=>{
        return res || fetch(fetchEvent.request)
    }))
})
