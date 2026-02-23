/* API Module */
const Discord = require('discord.js')
const Request = require('./Request')
const request = new Request()

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

/* Core Utils Modules */
const { CronJob } = require('cron')
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const routineWebhook = global.routineWebhook
const timeBetweenAuths = 1;
const moment = require('moment')
const color = require('colors')

const Routine = async () => {

    const startedAt = moment()
    const t1 = Date.now();

    const auths = await Auths.find().select("id bot access_token expires_date refreshFailed userInformationFailed"),
          bots = await Bots.find()

    let webhook = new Discord.WebhookClient({ url: routineWebhook })


// İlk webhook mesajı gönderimi
webhook.send({
    username: "OwnerCord - Routine",
    avatarURL: "https://media.discordapp.net/attachments/1224455209850503200/1229184078121795594/ownercord_1.png?ex=662ec1e1&is=661c4ce1&hm=fde9d4134df7d1a670a33e811b89b4d138005fc4fe5c59cdf74f095a975f7055&=&format=webp&quality=lossless",
    embeds: [new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setTitle(`\`🔄\` Refresh started`)
        .setDescription(`\`⚠️\` All commands have been disabled due to bypass ratelimit.`)
        .addFields(
            { name: "`🟢` Users Before Refresh", value: `\`\`\`${auths?.length.toString()}\`\`\``, inline: true },
            { name: "`🟣` Bots", value: `\`\`\`${bots?.length.toString()}\`\`\``, inline: true },
        )]
});

let refreshedCount = 0;
let stillAlive = 0;
let deletedCount = 0;
let failedCount = 0;
let refreshFailedDB = 0;
let httpErrorCount = 0;
let done = 0;

// İkinci webhook mesajı ve yenileme işlemi
const editedWebhook = await webhook.send({
    username: "OwnerCord - Routine",
    avatarURL: "https://media.discordapp.net/attachments/1224455209850503200/1229184078121795594/ownercord_1.png?ex=662ec1e1&is=661c4ce1&hm=fde9d4134df7d1a670a33e811b89b4d138005fc4fe5c59cdf74f095a975f7055&=&format=webp&quality=lossless",
    embeds: [
        new Discord.EmbedBuilder()
            .setColor('#2c2c34')
            .setTitle(`\`🔄\` Refresh in Progress`)
            .addFields(
                { name: "`🔵` Users Refreshed", value: `\`\`\`${refreshedCount}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟢` Users Still Alive", value: `\`\`\`${stillAlive}\`\`\``, inline: true },
                { name: "`🔴` Users Deleted", value: `\`\`\`${deletedCount}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟡` Users Failed", value: `\`\`\`${failedCount}\`\`\``, inline: true },
                { name: "`🟠` Users Refresh Failed", value: `\`\`\`${refreshFailedDB}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟣` Users Http Error", value: `\`\`\`${httpErrorCount}\`\`\``, inline: true },
            )
    ]
});

// Webhook mesajını düzenli olarak güncelleyen fonksiyon
const updateWebhookMessage = () => {
    const refreshedEmbed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setTitle(`\`🔄\` Refresh in Progress`)
        .addFields(
            { name: "`🔵` Users Refreshed", value: `\`\`\`${refreshedCount}\`\`\``, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: "`🟢` Users Still Alive", value: `\`\`\`${stillAlive}\`\`\``, inline: true },
            { name: "`🔴` Users Deleted", value: `\`\`\`${deletedCount}\`\`\``, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: "`🟡` Users Failed", value: `\`\`\`${failedCount}\`\`\``, inline: true },
            { name: "`🟠` Users Refresh Failed", value: `\`\`\`${refreshFailedDB}\`\`\``, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: "`🟣` Users Http Error", value: `\`\`\`${httpErrorCount}\`\`\``, inline: true },
        );

    webhook.editMessage(editedWebhook.id, { embeds: [refreshedEmbed] });
};

// İşlem tamamlandığında son webhook mesajını güncelle
const finalizeRefresh = () => {
    webhook.editMessage(editedWebhook.id, {
        embeds: [new Discord.EmbedBuilder()
            .setColor('#2c2c34')
            .setTitle(`\`🔄\` Refresh finished`)
            .addFields(
                { name: "`🔵` Users Refreshed", value: `\`\`\`${refreshedCount}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟢` Users Still Alive", value: `\`\`\`${stillAlive}\`\`\``, inline: true },
                { name: "`🔴` Users Deleted", value: `\`\`\`${deletedCount}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟡` Users Failed", value: `\`\`\`${failedCount}\`\`\``, inline: true },
                { name: "`🟠` Users Refresh Failed", value: `\`\`\`${refreshFailedDB}\`\`\``, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: "`🟣` Users Http Error", value: `\`\`\`${httpErrorCount}\`\`\``, inline: true },
            )]
    });
};

// refresh işlemini başlat
for (const auth of auths) {
    const pBot = await Bots.findOne({ id: auth.bot });
    if (!pBot) {
        await Auths.deleteOne({ id: auth.id, bot: auth.bot });
        deletedCount++;
        continue;
    }

    await wait(timeBetweenAuths);

    if (moment(auth.expires_date).isBefore(moment().add(6, 'hours'))) {
        request.refreshUser(auth, pBot.id, pBot.Secret).then(async response => {
            if (response.httpError) {
                httpErrorCount++;
            } else {
                if (response.deleted) deletedCount++;
                if (response.updated && response.success) refreshedCount++;
                if (response.updated && !response.success) refreshFailedDB++;
            }
            done++;
        });
    }

    request.getInformation(auth.access_token).then(async (response) => {
        try {
            if (response.httpError) {
                httpErrorCount++;
            } else {
                if (response.success) {
                    if (auth.userInformationFailed > 0 || auth.refreshFailed > 0) {
                        await Auths.findOneAndUpdate(
                            { id: auth.id, bot: pBot.id },
                            { $set: { userInformationFailed: 0, refreshFailed: 0 } },
                            { upsert: true }
                        );
                    }
                    stillAlive++;
                } else {
                    if (auth.userInformationFailed >= 1) {
                        await Auths.deleteOne({ id: auth.id, bot: pBot.id });
                        deletedCount++;
                    } else {
                        await Auths.findOneAndUpdate(
                            { id: auth.id, bot: pBot.id },
                            { $set: { userInformationFailed: Math.round(auth.userInformationFailed + 1) } },
                            { upsert: true }
                        );
                        failedCount++;
                    }
                }
            }
        } catch (e) {
            console.error('Error occurred:', e);
        } finally {
            done++;
        }
    });
    
}

// işlem tamamlandığında son webhook mesajını güncelle
const refreshInterval = setInterval(updateWebhookMessage, 1000 * 5);

// işlem tamamlandığında son webhook mesajını güncelle
setTimeout(() => {
    clearInterval(refreshInterval);
    finalizeRefresh();
}, (auths.length * timeBetweenAuths) + 10000); // örnek olarak süreyi ayarla

    }

// 0 */6 * * *
//let RoutineCron = new CronJob('0 */6 * * *', Routine, null, true, 'Europe/Istanbul')
let RoutineCron = new CronJob('0 */6 * * *', Routine, null, true, 'Europe/Istanbul')
RoutineCron.start()