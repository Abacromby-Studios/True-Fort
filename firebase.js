import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyA_NKYwvwLg2KQOB--RX05rimEiEkcSpho",
  authDomain: "true-fort.firebaseapp.com",
  projectId: "true-fort",
  storageBucket: "true-fort.appspot.com",
  messagingSenderId: "750729345906",
  appId: "1:750729345906:web:7ab18054f7be68f7327beb"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.VAPID_PUBLIC_KEY
    });
    if (token) {
      console.log('Notification token:', token);
    }
  } catch (err) {
    console.error('Failed to get token:', err);
  }
};

onMessage(messaging, payload => {
  console.log('Message received:', payload);
});
