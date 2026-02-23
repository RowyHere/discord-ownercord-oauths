/* Core Module */
const Discord = require('discord.js')
const Request = require('../Utils/Request')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')

/* Core Utils */
let Process = new Map()
const moment = require('moment')
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('switch')
    .setDescription('🔄 Switch Key')
    .addStringOption(
      option => option.setName("key")
      .setDescription(`🔑 Enter a switch key`)
      .setRequired(true)
    ),
    async execute(interaction, client) {
      
      let embed = new Discord.EmbedBuilder()
      .setColor('#2c2c34')
      .setFooter({
        text: `Powered by OwnerCord`
      })
      .setTimestamp()
        
      let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel("⭐ Powered by OwnerCord")
        .setStyle(Discord.ButtonStyle.Link)
        .setURL(global.ownercord || "http://youtube.com/RowyHere")
      )

      let webhook = new Discord.WebhookClient({ url: global.sWebhook })

      let enteredKey = interaction.options.getString("key")

      let Data = await Bots.findOne({ id: interaction.client.user.id })

      if(Data.switchKey === enteredKey) {

        interaction.reply({ components: [row], embeds: [embed.setDescription(`\`🔱\` The switch key you entered has been verified. Bot owner has been transferred.\n\n- \`🔱\` Old Owner: <@${Data.Owners}> (\`${Data.Owners}\`)\n\n- \`🔱\` New Owner: ${interaction.member} (\`${interaction.member.id}\`)\n\n\`⚠️\` Don't forget to create a **new switch key**!`)]})
        webhook.send({ embeds: [embed.setTitle(`${global.title} - Bot Transfer`).setDescription(`The ownership of the **${client.user.tag}** bot has been transferred.`).addFields({ name: `\`🔱\` Old Owner`, value: `<@${Data.Owners}> (\`${Data.Owners}\`)`, inline: true }, { name: "\u200B", value: "\u200B", inline: true}, { name: `\`🔱\` New Owner`, value: `<@${interaction.user.id}> (\`${interaction.user.id}\`)`, inline: true })]})
        await Bots.findOneAndUpdate({ id: interaction.client.user.id }, { Owners: interaction.member.id, switchKey: null }, { upsert: true })

      } else {

        interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` The switch key you specified is invalid.`)]})

      }

    }
}