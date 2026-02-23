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
    .setName('oauth')
    .setDescription('test')
    .addSubcommand(subcommand =>
        subcommand.setName('join').setDescription(`📥 Joining oauth on a server`).addStringOption(option => option.setName('guild').setDescription(`📂 Enter the server that will be entered.`).setAutocomplete(true)).addStringOption(option => option.setName("locale").setDescription("🎎 The locale").setAutocomplete(true)).addStringOption(option => option.setName('amount').setDescription('🔎 The amount of oauth'))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('list').setDescription(`👥 The list of your oauth`)
    )
    .addSubcommand(subcommand =>
        subcommand.setName('stop').setDescription(`❌ Stop oauth on a server`).addStringOption(option => option.setName('guild').setDescription(`📂 Enter the server to stop the process.`).setAutocomplete(true))
    ),
    async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused(true);
      let choices = [];
      let Bot = await Bots.findOne({ id: client.user.id })
      let oAuths = await Auths.find({ bot: client.user.id })

      if(focusedValue.name === "guild") {
      client.guilds.cache.filter(x => !Bot?.Whitelist_Server?.includes(x)).map(guild => choices.push(`${guild.name} (${guild.id})`));
      }

      if(focusedValue.name === "locale") {    

        let uniqueLocales = [...new Set(oAuths.map(x => x.locale))];
        let filteredFields = uniqueLocales.map(locale => {
          let count = oAuths.filter(x => x.locale === locale).length;
          let localeName = oAuths.find(x => x.locale === locale).localename;
          let cleanedLocale = locale.replace(/^:flag_/i, '').replace(/:/g, "")
          return {
            name: `(${cleanedLocale}) ${localeName}`,
            count: count
          }
      });
      filteredFields.sort((a, b) => b.count - a.count);

      filteredFields.map(field => 
        choices.push(`${field.name}: ${field.count} users`)
    );
      }

      const filtered = choices.filter(choice => choice.includes(focusedValue.value));
      await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })),
      );

    },
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

      switch(interaction.options._subcommand) {

        case "join":

          await interaction.deferReply()

          let request = new Request()
          let startedAt = moment()

          let Bot = await Bots.findOne({ id: client.user.id })
          var guild = interaction.options.getString("guild") ? client.guilds.cache.find(x => x.name.includes(interaction.options.getString('guild').split("(")[0])) : interaction.guild
          var quality = interaction.options.getString("amount")
          var locale = interaction.options.getString("locale") ? interaction.options.getString("locale").replace("(", "").split(")")[0] : null

          var promise = Process.get(guild?.id);
          if(promise && !promise.stop) {
              interaction.reply({ embeds: [embed.setDescription("\`❌\` There is already a join process running in this server")]})
              return false;
          } else if (promise && promise.stop) {
            Process.delete(guild.id);
          }
          let filter = locale !== null ? { bot: client.user.id, locale: `:flag_${locale}:` } : { bot: client.user.id }
          let oAuths = await Auths.find(filter).select("id access_token expires_date")
          
          var alreadyOnServer = [],
              success = [],
              error = [],
              expired = [],
              limitServer = [];

          //! Cooldown for command
          if(!global.developers.includes(interaction.user.id)) {
            if((Bot.type == 0) || (Bot.type == 1)){
              let lastUsage = moment(Bot.lastUsage)
              if(lastUsage >= moment(Date.now())) {
                return interaction.editReply({ components: [row], embeds: [embed.setTitle(`${client.user.username} - Cooldown`).setDescription(`\`❌\` You can use the **OAuth Join** command <t:${Math.floor(lastUsage / 1000)}:R>`)]})
              }
            }
          }

          //! Remove expired oAuths
          for(var oAuth of oAuths) {
            if(moment(oAuth.expires_date).isBefore(moment())) {
              expired.push(oAuth.id)
              oAuths = oAuths.filter(x => x.id != oAuth.id)
            }
          }

          await guild.members.fetch()

          //! Remove oAuths already on server
          for(var oAuth of oAuths) {
            var onServer = guild.members.cache.get(oAuth.id)
            if(onServer) {
              alreadyOnServer.push(oAuth.id)
              oAuths = oAuths.filter(x => x.id != oAuth.id)
            }
          }
          
          let total = quality === null || quality > oAuths.length ? oAuths.length : quality 
          
          var OwnerBuildEmbed = () => {
            var e = new Discord.EmbedBuilder()
            .setColor('#2c2c34')
            .setTitle(`${client.user.username} - Join Session`)
            .setDescription(`
            \`🆔\` Server ID: \`${guild.id}\`
            \`🏠\` Server Name: \`${guild.name}\`
            
            \`🎀\` Server Member Count: \`${guild.memberCount}\`
            \`✨\` Invites: \`${success.length} / ${total}\`
            
            \`🟢\` Success: \`${success.length}\`
            \`🔴\` Error: \`${error.length}\`
            \`🔵\` Already in Server: \`${alreadyOnServer.length}\`
            \`🟣\` Server Limit: \`${limitServer.length}\``)

            return e;

          }

          let startEmbed = OwnerBuildEmbed()
          let message = await interaction.editReply({ components: [row], embeds: [startEmbed]})
          if(Bot.type < 2) await Bots.findOneAndUpdate({ id: client.user.id }, { $set: { lastUsage: Bot.type == 0 ? startedAt.add(12, "hours") : startedAt.add(15, "minutes")}}, { upsert: true })


          Process.set(guild.id, {
            promise: new Promise(async (resolve, reject) => {
              for(var oAuth of oAuths) {
                var promise = Process.get(guild.id)
                if(promise?.stop) return resolve("stopped")
                if(quality && success.length >= quality) {
                  resolve("success")
                }

                var onServer = guild.members.cache.get(oAuth.id)
                if(onServer) {
                  alreadyOnServer.push(oAuth.id)
                  continue;
                }
                await delay(1000)
                var join = await request.joinServer(oAuth.access_token, guild.id, oAuth.id, client.token)
                if(join === false) {
                  alreadyOnServer.push(oAuth.id)
                } else if(typeof join == "object") {
                  if('code' in join) {
                    if(join.code == 50025) {
                      error.push(oAuth.id)
                    } else if(join.code == 30001) {
                      limitServer.push(oAuth.id)
                    } else {
                      error.push(oAuth.id)
                    }
                  } else if('id' in join) {
                    if(!join?.id) {
                      error.push(oAuth.id)
                    } else {
                      success.push(oAuth.id)
                    }
                  } else if ('retry_after' in join) {
                    await delay(join.retry_after + 1000);
                  }
                }
                continue;
              }
              return resolve("success")
            }),
            interaction: interaction,
            stop: false
          });

          var replyInterval = setInterval(() => {
            promise = Process.get(guild.id)
            if(promise?.stop) return clearInterval(replyInterval)
            var refreshEmbed = OwnerBuildEmbed()
            if(message) message.edit({ embeds: [refreshEmbed]}).catch(() => { })
          }, 1000 * 5)

          await Process.get(guild.id).promise.then(async (data) => {
            promise = Process.get(guild.id);

            var endEmbed = OwnerBuildEmbed()
            clearInterval(replyInterval)
            if(data === "stopped") {
              endEmbed.setTitle(`${client.user.username} - Cancelled`)
            } else {
              endEmbed.setTitle(`${client.user.username} - Finished`)
            }
            if(message) await message.edit({ embeds: [endEmbed]}).catch((err) => { console.log(err) })
            promise.stop = true;
          }).catch((err) => {

            console.log(err)
            var endEmbed = OwnerBuildEmbed()
            clearInterval(replyInterval)

            endEmbed.setTitle(`${client.user.username} - Error`)
            
            message.edit({ embeds: [endEmbed]}).catch(() => { })
            promise.stop = true;

          })
          if(Bot?.Log_Command) {
          let webhook = new Discord.WebhookClient({ url: Bot?.Log_Command })
          if(webhook && !global.developers.includes(interaction.user.id)) return webhook.send({
              username: client.user.username,
              avatarURL: client.user.avatarURL(),
              embeds: [embed.setTitle(`${client.user.username} - Join Session`).setDescription(`
              \`🆔\` Server ID: \`${guild.id}\`
              \`🏠\` Server Name: \`${guild.name}\`
              
              \`🎀\` Server Member Count: \`${guild.memberCount}\`
              \`✨\` Invites: \`${success.length} / ${total}\`
              
              \`🟢\` Success: \`${success.length}\`
              \`🔴\` Error: \`${error.length}\`
              \`🔵\` Already in Server: \`${alreadyOnServer.length}\`
              \`🟣\` Server Limit: \`${limitServer.length}\`
              
              \`🔱\` Author: \`${interaction.user.username}\` (\`${global.owners.includes(interaction.user.id) ? `Bot Owner` : Bot?.Whitelist_Owners.includes(interaction.user.id) ? `Bot Owner (Whitelist)` : `Whitelist Access`}\`)`)]
          })
          }
        break;

        case "stop":

          var guild = interaction.options.getString("guild") ? interaction.options.getString("guild") : interaction.guild
          guild = client.guilds.cache.get(guild.id) ?? interaction.guild
          const sPromise = Process.get(guild.id)

          if(!sPromise || sPromise.stop) {
            interaction.reply({ embeds: [embed.setTitle(`\`❌\` Error`).setDescription("\`❌\` There is no join process running in this server")]})
          }
          sPromise.stop = true;
          interaction.reply({ embeds: [embed.setTitle(`\`✅\` Success`).setDescription(`Join session has been stopped. (${guild.id === interaction.guild.id ? "Current Server" : guild.name})`)]})
        break;

        case "list":

          await interaction.deferReply()

          let pAuth = await Auths.find(),
           pAuthBot = await Auths.find({ bot: client.user.id }),
           pControl = await (global.developers.includes(interaction.user.id) ? pAuth : pAuthBot)
          let uniqueLocales = [...new Set(pControl.map(x => x.locale))]
          let filteredFields = uniqueLocales.map(locale => {
            let count = pControl.filter(x => x.locale === locale).length
            let countBot = pAuthBot.filter(x => x.locale === locale).length
            let localeName = pControl.find(x => x.locale === locale).localename


            return {
              name: `${locale} ${localeName}`,
              value: `**__${count} Users${global.developers.includes(interaction.user.id) ? ` (+${countBot})` : ""}__**`,
              count: count,
              inline: true
            }
          })

          filteredFields.sort((a, b) => b.count - a.count);

          let top24Fields = filteredFields.slice(0, 24);
          let otherFields = filteredFields.slice(24);
          let otherTotalUsers = otherFields.reduce((total, field) => {
              return total + parseInt(field.value.match(/\d+/)[0]);
          }, 0);

          if(global.developers.includes(interaction.user.id)) {

            embed.setTitle(`\`👤\` OwnerCord - Admin Auth Control`).setDescription(`${Discord.codeBlock("fix", `${pAuth.length} (${pAuthBot.length} in bot)`)}`)
            embed.addFields(...top24Fields)
            if(otherTotalUsers) embed.addFields({ name: "Other Country", value: `**__${otherTotalUsers} Users__**`, inline: true})
            interaction.editReply({ embeds: [embed]})

          } else {

            try {

              embed.setTitle(`\`👤\` Total OAuth2 Members`).setDescription(`${Discord.codeBlock("fix", `${pAuthBot.length}`)}`)
              embed.addFields(...top24Fields)
              if(otherTotalUsers) embed.addFields({ name: "Other Country", value: `**__${otherTotalUsers} Users__**`, inline: true})
              interaction.editReply({ components: [row], embeds: [embed]})  

            } catch(err) {
              console.log(err)
            }

          }

        break;
      }

    }
}