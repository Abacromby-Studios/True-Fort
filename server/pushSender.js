const express = require("express");
const bodyParser = require("body-parser");
const sendMail = require("./mailer");
const sendPush = require("./pushSender");

const app = express();
app.use(bodyParser.json());

app.post("/send-mail", async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await sendMail(to, subject, html);
    res.status(200).send("Mail sent.");
  } catch (err) {
    res.status(500).send("Failed to send mail.");
  }
});

app.post("/send-push", async (req, res) => {
  const { subscription, payload } = req.body;
  try {
    await sendPush(subscription, payload);
    res.status(200).send("Push sent.");
  } catch (err) {
    res.status(500).send("Failed to send push.");
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
