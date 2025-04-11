importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA_NKYwvwLg2KQOB--RX05rimEiEkcSpho",
  authDomain: "true-fort.firebaseapp.com",
  projectId: "true-fort",
  storageBucket: "true-fort.appspot.com",
  messagingSenderId: "750729345906",
  appId: "1:750729345906:web:7ab18054f7be68f7327beb",
  vapidKey: "BBJN8bLTD27x5GSULI4hrs3yotWlj7WISe5FAbGeqaNrFL26dUHMxTnVY7fm0kJc2txkVGVHs9o5gd0wK7GpGDo"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'TrueFort Notification';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icon-192.png' // Optional: adjust the icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
