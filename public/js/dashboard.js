document.addEventListener('DOMContentLoaded', function () {
  const discordFrame = document.getElementById('discord-widget');
  if (discordFrame) {
    discordFrame.src = 'https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark';
  }
});
