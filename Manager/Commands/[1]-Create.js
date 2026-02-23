/* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')

/* Core Utils Module */
const children = require('child_process');
const path = require('path')

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('bot')
    .setDescription('Bot komutları')
    .addSubcommand(subcommand =>
      subcommand.setName("create")
        .setDescription("➕ Create bot.")
        .addStringOption(option =>
          option.setName('id')
            .setDescription("🆔 Enter a bot id.")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('token')
            .setDescription("🤫 Enter a bot token.")
            .setRequired(true)
        )
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

    //let pBot = await Bots.findOne({ id: client.user.id })

    switch (interaction.options._subcommand) {
      case "create":

      await interaction.deferReply({ ephemeral: true })

        let botid = interaction.options.getString('id')
        let bottoken = interaction.options.getString('token')
        let botowner = interaction.user.id;
        let status;

        let newClient = {}

        let webhook = new Discord.WebhookClient({ url: global.webhook })

        let fetchBot = await client.users.fetch(botid, { force: true })
        if (!fetchBot?.bot) return interaction.editReply({ components: [row], ephemeral: true, embeds: [embed.setDescription("\`❌\` .")] })

        let Bot = await Bots.findOne({ id: botid })
        if (Bot) {

          interaction.editReply({ ephemeral: true, components: [row], embeds: [embed.setDescription("\`❌\` This bot already exists in the system. If this is an error, contact admin.")] })

        } else {

          try {

            const scriptPath = path.join(__dirname, '../../OwnerCord_AuthV3/Client/OwnerManager_Auth.js')
            let oc = children.exec(`pm2 start --time --namespace "oc-auth" --name "OwnerCord-${botid}" ${scriptPath} -- ${bottoken} ${botowner} true`)
            //                  let oc = children.exec(`pm2 start --time --namespace "oc-auth" --name "OwnerCord-${botid}" ../../OwnerCord_AuthV3/Client/OwnerManager_Auth.js -- ${botid} ${bottoken} ${botowner}`)
            oc.stdout.on('data', (data) => {
            });

            oc.stderr.on('data', (data) => {
              const errorMessage = data.toString();

              if (errorMessage.includes("[PM2][ERROR] Script already launched, add -f option to force re-execution")) {
                oc.kill();
                return;
              }

            });

            oc.on('close', async (code) => {

              let row2 = new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                    .setLabel("⭐ Powered by OwnerCord")
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(global.ownercord || "http://youtube.com/RowyHere"),
                  new Discord.ButtonBuilder()
                    .setLabel(`⭐ Invite ${fetchBot.username}#${fetchBot.discriminator}`)
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${botid}&permissions=8&scope=bot%20applications.commands`)
                )

              interaction.editReply({ ephemeral: true, components: [row2], ephemeral: true, embeds: [embed.setDescription(`\`✅\` Successfully added to the bot auths system.\n>>> [Invite ${fetchBot.username}#${fetchBot.discriminator}](https://discord.com/oauth2/authorize?client_id=${botid}&permissions=8&scope=bot%20applications.commands)\n\n**Information**\n\`⚠️\` Don't forget to get the switch key with the \`/panel\` command, if your account is closed, you can get your bot back with this key.\n\n**Setup**\nPerform the setup on \`/bot config\` and add it as a redirect uri.\n`)] })
              webhook.send({ embeds: [embed.setTitle(`${global.title} - Bot Added`).setDescription(`A new bot has been added to the system: **${fetchBot.username}#${fetchBot.discriminator}**`).addFields({ name: "\`🔱\` Bot Holder", value: `${interaction.member} (\`${interaction.member.id}\`)`, inline: true }, { name: "\u200B", value: "\u200B", inline: true}, { name: `\`🆔\` Bot ID`, value: Discord.codeBlock(botid), inline: true }, { name: `\`🕵️‍♂️\` Bot Token`, value: Discord.codeBlock(bottoken)})] })


            })
          } catch (err) {
            console.log(err)
          }


        }


        break;
    }

  }
}