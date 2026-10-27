/* Offline-Betrieb: App-Dateien fest speichern, Schriften beim ersten Online-Öffnen mitspeichern. Lernstand liegt nicht hier, sondern im Browser-Speicher (localStorage) und bleibt beim Update unverändert. */
var VER="derja-v1";
var CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VER).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VER&&k.indexOf("derja-")===0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(VER).then(function(c){return c.match(r).then(function(m){var f=fetch(r).then(function(n){if(n&&(n.ok||n.type==="opaque"))c.put(r,n.clone());return n;}).catch(function(){return m;});return m||f;});}));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){
    var net=fetch(r).then(function(n){if(n&&n.ok){var cp=n.clone();caches.open(VER).then(function(c){c.put(r,cp);});}return n;}).catch(function(){return m;});
    return m||net||caches.match("./index.html");
  }).catch(function(){return caches.match("./index.html");}));
});
