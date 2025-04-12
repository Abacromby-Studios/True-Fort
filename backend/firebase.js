// firebase.js
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:truefortmc@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Push notification error:', error);
    }
};

module.exports = { sendPushNotification };
