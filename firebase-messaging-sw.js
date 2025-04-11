importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA_NKYwvwLg2KQOB--RX05rimEiEkcSpho",
  authDomain: "true-fort.firebaseapp.com",
  projectId: "true-fort",
  storageBucket: "true-fort.firebasestorage.app",
  messagingSenderId: "750729345906",
  appId: "1:750729345906:web:7ab18054f7be68f7327beb",
  measurementId: "G-WRFK68BCSR"
});

const messaging = firebase.messaging();

// Background push
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
