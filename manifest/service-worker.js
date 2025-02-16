const test="radioProject";
// ,"././styles/styles.css","././script/script.js"
const assets=["/","./index.html",'./styles/styles.css','./script/scripts.js']

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
