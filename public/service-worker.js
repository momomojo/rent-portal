self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data,
    actions: data.actions?.map(action => ({
      action: action.action,
      title: action.label
    }))
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action) {
    // Handle notification action click
    const actionData = event.notification.data.actions?.find(
      action => action.action === event.action
    );
    if (actionData?.link) {
      event.waitUntil(clients.openWindow(actionData.link));
    }
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data.link || '/')
    );
  }
});