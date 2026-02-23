const API = require('./Class/Callback')
let x = global.checkerAPI = "http://45.141.150.60:8080/" //enter a vds ip(DOMAIN) and port example: 5.18.206.113:8080
let xx = global.checkerWebhook = "https://discord.com/api/webhooks/1272806554261000246/rVEPsOODSEKq58Hw2pwM0rODx6KLkLE_O8OBvp8mUO4aeJpurIv6dzam1dAz0PSBhyB9"
const client = new API({
    mongoose: "mongodb+srv://rowyauth:eferowy1900@new-db.8hxxf.mongodb.net/?retryWrites=true&w=majority",
    port: 8080, // main port
    redirect: "http://45.141.150.60:8080/callback", // It must be the same as the port.
    ownercord_invite: "https://discord.gg/oauths",

    token: "MTI2MDcyNTUyMjU2OTIzMjM4NA.GCEDo6.dLTL0VzPUILR2oLUEct9iFQpVDdA-pU_yLOT4k",
 //   webhook: "https://discord.com/api/webhooks/1228107437039550584/lpQgGNSmP-137IVPrlQdHM0KFsXiQsjulywnOqv0pDUAYncHBuqjupJdash4dPEUROA9",
    routineWebhook: "https://discord.com/api/webhooks/1260727203709325382/3LAfQS6judsjrPR8UKXr3rtP2A2GMqNhDQerbjbobtK8Da-eg01NPoyt031bJU-baGL7"
});

(async () => {
    await client.fetchDatabase()
    await client.API()
    await client.Routine()
})()