import { PieSocket } from "https://cdn.piesocket.com/piesocket.js";

const ticketId = localStorage.getItem("ticketId");
const username = localStorage.getItem("username") || "Guest";
const department = localStorage.getItem("department") || "Support";
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

document.getElementById("ticket-id").textContent = ticketId || "Unknown";

if (!ticketId) {
  alert("No ticket found. Please go back to the contact form.");
  window.location.href = "contact.html";
}

const piesocket = new PieSocket({
  clusterId: "nyc1",
  apiKey: "UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV",
  notifySelf: true,
});

const channel = piesocket.subscribe(ticketId);

channel.listen("message", (data) => {
  const msg = typeof data === "string" ? JSON.parse(data) : data;
  displayMessage(msg.from, msg.message);
  if (msg.from === "Admin") {
    playAlert();
    sendNotification("Reply from True-Fort Staff", msg.message);
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message === "") return;

  const payload = {
    from: username,
    message,
    department,
    ticketId,
  };

  displayMessage(username, message);
  channel.publish("message", JSON.stringify(payload));
  chatInput.value = "";
});

function displayMessage(sender, message) {
  const div = document.createElement("div");
  div.className = "chat-message";
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function playAlert() {
  const audio = new Audio("notification.mp3");
  audio.play().catch(() => {});
}

function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
                                          }
