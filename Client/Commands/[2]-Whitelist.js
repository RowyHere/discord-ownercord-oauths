/* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('test')
    .addSubcommand(subcommand =>
        subcommand.setName('add').setDescription(`✅ Add a user to the whitelist`).addUserOption(option => option.setName('user').setDescription('user to add').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove').setDescription(`❌ Remove a user to the whitelist`).addUserOption(option => option.setName('user').setDescription('user to remove').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('list').setDescription(`📰 List of whitelisted users`)
    ),
    async execute(interaction, client) {
      
      let embed = new Discord.EmbedBuilder()
      .setColor('#2c2c34')
      .setTitle(`${client.user.username} - Whitelist`)
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
      
      let Data = await Bots.findOne({ id: client.user.id }).then(x => x.Whitelist), Core = await Bots.findOne({ id: client.user.id }).then(x => x.type)
      switch(interaction.options._subcommand) {

        case "add":

            if(!Core || Core === "0" && Data?.length >= 1) return interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **Free**. You can add **1 people** to whitelist. If you want to use more you should upgrade your plan.`)] }) 
            if(Core === "1" && Data?.length >= 3) return interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **VIP**. You can add **3 people** to whitelist. If you want to use more you should upgrade your plan.`)] }) 
            if(Core === "2" && Data?.length >= 7) return interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`❌\` Your currently plan is **Premium**. You can add **7 people** to whitelist.`)] }) 

            if(Data.includes(interaction.options.get('user').user.id)) return interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`❌\` This user is already whitelisted.`)] })
            else interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`✅\` Added ${interaction.options.get('user').user} to the whitelist.`)] }) 
            await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { Whitelist: interaction.options.get('user').user.id }}, { upsert: true })
        
        break;

        case "remove":

            if(!Data.includes(interaction.options.get('user').user.id)) interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`❌\` This user is not whitelisted.`)], ephemeral: true })
            else interaction.reply({ ephemeral: true, components: [row], embeds: [embed.setDescription(`\`✅\` Removed ${interaction.options.get('user').user} from the whitelist.`)] })
            await Bots.findOneAndUpdate({ id: client.user.id }, { $pull: { Whitelist: interaction.options.get('user').user.id }}, { upsert: true })
        
        break;

        case "list":

            interaction.reply({ components: [row], embeds: [embed.setDescription(`${Data?.length > 0 ? Data.map((x, i) => `\` ${i+1} \` \`${client.users.resolve(x) ? client.users.resolve(x).globalName ?? client.users.resolve(x).username : `Deleted User`}\` - \`${x}\``).join('\n') : `There are no users added to the whitelist.`}\n\nYou are currently using the **${Core === "0" ? "Free" : Core === "1" ? "VIP" : "Premium"}** plan and you have the right to add **${Core === "0" ? 1 - Data?.length : Core === "1" ? 3 - Data?.length : 7 - Data?.length}** whitelist.`)] })

        break;

    }

    }
}