// server-info.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Server Info page loaded successfully.");

  // Optional: add interactive copy buttons for IP addresses
  const javaIp = "play.truefortmc.net";
  const bedrockIp = "play.truefortmc.net";
  const bedrockPort = "19132";

  const infoList = document.querySelector("ul");
  if (infoList) {
    const copyBtn = (label, value) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${label}:</strong> ${value} <button class="copy-btn" data-copy="${value}">Copy</button>`;
      return li;
    };

    const buttons = [
      copyBtn("Java IP", javaIp),
      copyBtn("Bedrock IP", bedrockIp),
      copyBtn("Bedrock Port", bedrockPort),
    ];

    infoList.innerHTML = ""; // Clear default list if needed
    buttons.forEach(btn => infoList.appendChild(btn));

    // Event listener for copy buttons
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const value = e.target.getAttribute("data-copy");
        navigator.clipboard.writeText(value).then(() => {
          e.target.textContent = "Copied!";
          setTimeout(() => (e.target.textContent = "Copy"), 1500);
        });
      });
    });
  }
});
