const fetch = require('node-fetch');
const { WebhookClient, EmbedBuilder } = require('discord.js');

const webhookClient = new WebhookClient({ url: "https://discord.com/api/webhooks/1272806554261000246/rVEPsOODSEKq58Hw2pwM0rODx6KLkLE_O8OBvp8mUO4aeJpurIv6dzam1dAz0PSBhyB9" });

let lastSiteStatus = null;

async function checkSiteStatus() {
  try {
    const response = await fetch("http://45.141.150.60:8080/");
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function sendDiscordMessage(status) {
  const message = status ? '\`✅\` API Callback has been activated again.' : '\`❌\` An error occurred during the API Callback. The callback system is disabled.';
  webhookClient.send({ 
    username: "OwnerCord - API Checker",
    embeds: [new EmbedBuilder().setColor("#2c2c34")
    .setTitle(`\`🔱\` API Information`)
    .setFooter({
        text: `Powered by OwnerCord`
    })
    .setTimestamp().setDescription(message)]});
}

async function main() {
  const siteStatus = await checkSiteStatus();

  if (lastSiteStatus === null) {
    lastSiteStatus = siteStatus;
    sendDiscordMessage(siteStatus);
  } else if (siteStatus !== lastSiteStatus) {
    lastSiteStatus = siteStatus;
    sendDiscordMessage(siteStatus);
  }

  // `setTimeout` kullanarak tekrar çağır
  setTimeout(main, 60000);
}

console.log("API Checker bağlantısı kuruldu.");
main();
