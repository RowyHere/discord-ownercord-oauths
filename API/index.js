const API = require('./Class/Callback')
let x = global.checkerAPI = "http://45.141.150.60:8080/" //enter a vds ip(DOMAIN) and port example: 5.18.206.113:8080
let xx = global.checkerWebhook = ""
const client = new API({
    mongoose: "",
    port: 8080, // main port
    redirect: "http://45.141.150.60:8080/callback", // It must be the same as the port.
    ownercord_invite: "https://discord.gg/oauths",

    token: "",
 //   webhook: "",
    routineWebhook: ""
});

(async () => {
    await client.fetchDatabase()
    await client.API()
    await client.Routine()
})()