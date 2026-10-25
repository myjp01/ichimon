const V = "ichimon-1a030e04ff";
const FILES = ["./", "index.html", "data.enc", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("ichimon-") && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const FONTS = "fonts-ichimon";  /* 書体（Google Fonts）は版をまたいで残す */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = e.request.url;
  if (u.startsWith("https://fonts.googleapis.com/") || u.startsWith("https://fonts.gstatic.com/")) {
    e.respondWith(caches.open(FONTS).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok || res.type === "opaque") c.put(e.request, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
