// LIVREX — Service Worker pour notifications push coursier
const CACHE_NAME = 'livrex-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

// Recevoir une notification push
self.addEventListener('push', e => {
  let data = { title: 'LIVREX', body: 'Nouvelle commande !', store: '', items: 0 };
  try { data = { ...data, ...e.data.json() }; } catch(err) {}

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png',
    tag: 'livrex-order',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      { action: 'accept', title: 'Voir la commande' },
      { action: 'dismiss', title: 'Ignorer' }
    ],
    data: { url: self.registration.scope }
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clic sur la notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'accept' || !e.action) {
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('livrexcoursier') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
    );
  }
});
