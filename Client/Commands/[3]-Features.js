/* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('features')
    .setDescription('test')
    .addSubcommand(subcommand =>
      subcommand.setName('joiner').setDescription(`OAuth allows the user to log in to the server automatically`).addStringOption(option => option.setName('guild').setDescription(`Select the server to log in to.`).setRequired(true).setAutocomplete(true)).addStringOption(option => option.setName('force_member').setDescription('Make your members to join your server and wont let them to leave').setRequired(true).addChoices({ name: 'true', value: "true" }, { name: 'false', value: "false" }))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('message').setDescription(`It sends an automatic message to the OAuth user.`).addStringOption(option => option.setName('message').setDescription(`Enter the message that will be sent..`).setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('roles').setDescription(`OAuth allows the user to assign a role on the specified server.`).addStringOption(option => option.setName('guild').setDescription(`Specify the server to be assigned the role.`).setRequired(true).setAutocomplete(true))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('info').setDescription(`It shows the current features that you have set.`)
    )
    .addSubcommand(subcommand =>
      subcommand.setName('reset').setDescription("Resets features.").addStringOption(option => option.setName('feature').setDescription("Select the feature to reset.").setRequired(true).setAutocomplete(true))
    ),
    async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused(true);
      let choices = [];

      if(focusedValue.name === "guild") {
      client.guilds.cache.map(guild => choices.push(guild.name));
      }

      if(focusedValue.name === "feature") {
        let Data = await Bots.findOne({ id: client.user.id })
        if(Data && Data?.Features) {
          if(Data && Data.Features.find(x => x.Joiner)) choices.push("Joiner")
          if(Data && Data.Features.find(x => x.Roles)) choices.push("Roles")
          if(Data && Data.Features.find(x => x.Message)) choices.push("Message")
        }
      }

      const filtered = choices.filter(choice => choice.includes(focusedValue.value));
      if(filtered) await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })),
      );

    },
    async execute(interaction, client) {
      
      let Data = await Bots.findOne({ id: client.user.id })

      let embed = new Discord.EmbedBuilder()
      .setColor('#2c2c34')
      .setTitle(`${client.user.username} - Features (${Data?.type === "2" ? "Premium Plan" : Data?.type === "1" ? "VIP Plan" : "Free Plan"})`)
      .setFooter({
        text: `Powered by OwnerCord`
      })
      .setTimestamp()
        
      let row2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel("⭐ Powered by OwnerCord")
        .setStyle(Discord.ButtonStyle.Link)
        .setURL(global.ownercord || "http://youtube.com/RowyHere")
      )

       if(Data && Data?.type < 1) return interaction.reply({ components: [row2], embeds: [embed.setDescription(`\`❌\` Upgrade plan to use features.`)], ephemeral: true })
      
      switch(interaction.options._subcommand) {

        case "joiner":
        
        let getGuild = client.guilds.cache.find(x => x.name.includes(interaction.options.getString('guild')))
        let force_member = interaction.options.getString('force_member')
        
        interaction.reply({ components: [row2], embeds: [embed.setDescription(`${getGuild?.name ? `\`✅\` Automatic login set for **${getGuild && getGuild?.name ? getGuild.name : "Unknown"}** (**${getGuild && getGuild?.id ? getGuild.id : "Unknown"}**)${Data.type < 2 && force_member === "true" ? `\`⚠️\` Upgrade plan for force member feature.` :  ""}` : `\`⚠️\` The bot cannot access server data. Please check the servers where the bot is located.`}`)] })
        if(Data?.Features && Data?.Features.find(x => x.Joiner)) await Bots.findOneAndUpdate({ id: client.user.id }, { $set: { Features: { Joiner: { guild: getGuild.id, force_member: Data.type > 1 ? force_member === "true" ? true : false : false }}}}, { upsert: true })
        else if(getGuild && getGuild?.name) await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { Features: { Joiner: { guild: getGuild.id, force_member: Data.type > 1 ? force_member === "true" ? true : false : false  }}}}, { upsert: true })
        break;

        case "message":

        let getMessage = interaction.options.getString('message')
        interaction.reply({ components: [row2], embeds: [embed.setDescription(`\`✅\` Automatic message set to **${getMessage}**`)] })
        if(Data?.Features && Data?.Features.find(x => x.Message)) await Bots.findOneAndUpdate({ id: client.user.id }, { $set: { Features: { Message: { message: getMessage }}}}), { upsert: true }
        else await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { Features: { Message: { message: getMessage }}}}, { upsert: true })

        break;

        case "roles":

            let getGuildRoles = client.guilds.cache.find(x => x.name.includes(interaction.options.getString('guild')))
            /*const rolesCache = getGuildRoles.roles.cache;
            const roleArray = rolesCache.filter(x => x.id !== getGuildRoles.id).values();
            */
            const rolesCache = getGuildRoles.roles.cache.values(); // Cache'i .values() ile alın

            const roleArray = Array.from(rolesCache).filter(x => x.id !== getGuildRoles.id);
            
            const options = getGuildRoles.roles.cache.size > 25
            ? roleArray.slice(0, 25).map(role => ({
                label: role.name,
                description: `${role.members.size} users`,
                value: `${role.name}+${role.id}+${getGuildRoles.id}`
              }))
            : roleArray.map(role => ({
                label: role.name,
                description: `${role.members.size} users`,
                value: `${role.name}+${role.id}+${getGuildRoles.id}`
              }));

            const roles = new Discord.StringSelectMenuBuilder()
            .setCustomId('roles')
            .setPlaceholder('Choose a role')
            .setMaxValues(1)
            .addOptions(options)
            //.addOptions(getGuildRoles.roles.cache.size > 25 ? getGuildRoles.roles.cache.filter(x => x.id !== getGuildRoles.id).slice(0, 25).map(role => ({ label: role.name, description: `${role.members.size} users`, value: `${role.name}+${role.id}+${getGuildRoles.id}` })) : getGuildRoles.roles.cache.filter(x => x.id !== getGuildRoles.id).map(role => ({ label: role.name, description: `${role.members.size} users`, value: `${role.name}+${role.id}+${getGuildRoles.id}` })))

            const row = new Discord.ActionRowBuilder()
            .addComponents(roles)

            await interaction.reply({
                components: [row]
            });
            
        break;

        case "info":
          
          let Joiner = Data?.Features?.find(x => x.Joiner)?.Joiner
          let Roles = Data?.Features?.find(x => x.Roles)?.Roles
          let Message = Data?.Features?.find(x => x.Message)?.Message
          interaction.reply({ components: [row2], embeds: [embed.setTitle(`\`🔱\` ${client.user.username} - Feature Information`).setDescription(`
          ${Data?.Features && Joiner ? `\`🟢\` Features Joiner ${Discord.codeBlock(`ansi`, `[0;32mStatus: enabled\nMode: On first user authorize\nGuild: ${await client.guilds.cache.get(Joiner.guild)} (${Joiner.guild})\nForce Member: ${Data?.type >= 2 ? `${Data?.Features && Joiner.force_member ? "enabled" : "disabled"}` : `Upgrade the plan for this feature.`}`)}` : `\`🔴\` Features Joiner ${Discord.codeBlock(`ansi`, `[0;31mStatus: disabled`)}`}
          ${Data?.Features && Roles ? `\`🟢\` Features Roles ${Discord.codeBlock(`ansi`, `[0;32mStatus: enabled\nMode: On first user authorize\nGuild: ${await client.guilds.cache.get(Roles.guild)} (${Roles.guild})\nRoles: ${await client.guilds.cache.get(Roles.guild).roles.cache.get(Roles.role).name} (${await client.guilds.cache.get(Roles.guild).roles.cache.get(Roles.role).id})`)}` : `\`🔴\` Features Roles ${Discord.codeBlock(`ansi`, `[0;31mStatus: disabled`)}`}
          ${Data?.Features && Message ? `\`🟢\` Features Message ${Discord.codeBlock(`ansi`, `[0;32mStatus: enabled\nMode: On first user authorize\nMessage: ${Message.message}`)}` : `\`🔴\` Features Message ${Discord.codeBlock(`ansi`, `[0;31mStatus: disabled`)}`}
          `)]})
            
        break;

        case "reset": 
      
        let resetSelect = interaction.options.getString('feature')    

        //  if(Data?.Features && !Data.Features[resetSelect]) return interaction.reply({ components: [row2], embeds: [embed.setTitle(`\`🔱\` OwnerCord - Feature Reset`).setDescription(`\`❌\`The feature to be reset is already disabled`)]})

          if(Data?.Features && Data.Features.find(x => x[resetSelect])) {
           // await Bots.findOneAndDelete({ Features: { resetSelect } } , { where: client.user.id, upsert: true })
          
           let newData = Data.Features.filter(f => !f[resetSelect])

           await Bots.updateOne({ id: client.user.id }, { $set: { Features: newData }}, { upsert: true })

          }

          interaction.reply({ components: [row2], embeds: [embed.setTitle(`\`🔱\` OwnerCord - Feature Reset`).setDescription(`\`✅\` Feature **${resetSelect}** has been deleted.`)] })

        break;

    }

    }
}