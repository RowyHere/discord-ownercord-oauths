/* Core Modules */
const Discord = require('discord.js')
//const client = global.client

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let Data = await Bots.findOne({ id: interaction.client.user.id })
        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setTitle(`${interaction.client.user.username} - Features (${Data?.type === "2" ? "Premium Plan" : Data?.type === "1" ? "VIP Plan" : "Free Plan"})`)

        let row2 = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
          .setLabel("⭐ Powered by OwnerCord")
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(global.ownercord || "http://youtube.com/RowyHere")
        )

        if(interaction.customId === "roles") {
            await interaction.deferUpdate();

            await interaction.editReply({ components: [row2], embeds: [embed.setDescription(`\`✅\` Automatic roles set to **${(interaction.values[0].split("+")[0])}** (\`${interaction.values[0].split("+")[1]}\`)`)]})

            let guild = interaction.client.guilds.cache.get(interaction.values[0].split("+")[2])
            if(!guild) return interaction.editReply({ components: [row2], embeds: [embed.setDescription(`\`⚠️\` I don't have access to the set server right now.`)]})
            let role = guild.roles.cache.get(interaction.values[0].split("+")[1])
            if(!role) return interaction.editReply({ components: [row2], embeds: [embed.setDescription(`\`⚠️\` There is no role on the set server.`)]})
            let Data = await Bots.findOne({ id: interaction.client.user.id })
            if(Data?.Features && Data?.Features.find(x => x.Roles)) await Bots.findOneAndUpdate({ id: interaction.client.user.id }, { $set: { Features: { Roles: { guild: guild.id, role: role.id }}}}, { upsert: true })
            else await Bots.findOneAndUpdate({ id: interaction.client.user.id }, { $push: { Features: { Roles: { guild: guild.id, role: role.id }}}}, { upsert: true })

        }
    
    }
}