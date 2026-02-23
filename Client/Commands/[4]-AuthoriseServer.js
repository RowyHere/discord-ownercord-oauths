/* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('authoriseserver')
    .setDescription('test')
    .addSubcommand(subcommand =>
        subcommand.setName('add').setDescription(`✅ Add a server to the whitelist`).addStringOption(option => option.setName('guild').setDescription('guild to add').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription(`❌ Remove a server to the whitelist`).addStringOption(option => option.setName('guild').setDescription('guild to remove').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('list').setDescription(`📰 List of whitelisted guilds`)
    ),
    async execute(interaction, client) {
      
      let embed = new Discord.EmbedBuilder()
      .setColor('#2c2c34')
      .setFooter({
        text: `Powered by OwnerCord`
      })
      .setTitle(client.user.username + " - Authorise Server")
      .setTimestamp()
        
      let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel("⭐ Powered by OwnerCord")
        .setStyle(Discord.ButtonStyle.Link)
        .setURL(global.ownercord || "http://youtube.com/RowyHere")
      )

      let Data = await Bots.findOne({ id: client.user.id }).then(x => x.AuthoriseServer), Core = await Bots.findOne({ id: client.user.id }).then(x => x.type)
      switch(interaction.options._subcommand) {

        case "add":

            /*if(!Core || Core === "0" && Data?.length >= 1) return interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **Free**. You can add **1 server** to whitelist. If you want to use more you should upgrade your plan.`)] }) 
            if(Core === "1" && Data?.length >= 3) return interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **VIP**. You can add **3 server** to whitelist. If you want to use more you should upgrade your plan.`)] }) 
            if(Core === "2" && Data?.length >= 7) return interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **Premium**. You can add **7 server** to whitelist.`)] })*/ 

            let URL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot&guild_id=${interaction.options.getString('guild')}&disable_guild_select=truepm`
            if(!client.guilds.cache.get(interaction.options.getString('guild'))) row.addComponents(new Discord.ButtonBuilder()
            .setLabel("⭐ Add bot to server")
            .setStyle(Discord.ButtonStyle.Link)
            .setURL(URL))
            if(Data.includes(interaction.options.getString('guild'))) return interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` This guild is already whitelisted.`)], ephemeral: true })
            else interaction.reply({ components: [row], embeds: [embed.setDescription(`\`✅\` Added ${interaction.options.getString('guild')} to the whitelist.`)] }) 
            await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { AuthoriseServer: interaction.options.getString('guild') }}, { upsert: true })
        
        break;

        case "remove":

            if(!Data.includes(interaction.options.getString('guild'))) interaction.reply({ components: [row], embeds: [embed.setDescription(`\`❌\` This guild is not whitelisted.`)], ephemeral: true })
            else interaction.reply({ components: [row], embeds: [embed.setDescription(`\`✅\` Removed ${interaction.options.getString('guild')} from the whitelist.`)] })
            await Bots.findOneAndUpdate({ id: client.user.id }, { $pull: { AuthoriseServer: interaction.options.getString('guild') }}, { upsert: true })
        
            if(client.guilds.cache.get(interaction.options.getString('guild'))) client.guilds.cache.get(interaction.options.getString('guild')).leave()

        break;

        case "list":

            interaction.reply({ components: [row], embeds: [embed.setDescription(`${Data?.length > 0 ? Data.map((x, i) => `\` ${i+1} \` [\`${client.guilds.cache.get(x)?.name ?? "Unknown"}\`](https://discord.com/channels/${x}) - \`${x}\``).join('\n') : `No authorised server found.`}`)] })

        break;

    }

    }
}