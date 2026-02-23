const Core = require('./Utils/Core')
const client = new Core({

    CoreToken: process.argv[2],
    CoreID: process.argv[1],
    CorePort: 8080,
    CoreRedirect: "http://45.141.150.60:8080/callback",
    CoreDevelopers: ["1258834402293841940"],
    CoreOwners: [`${process.argv[3]}`],
    CoreMongoose: "mongodb+srv://rowyauth:eferowy1900@new-db.8hxxf.mongodb.net/?retryWrites=true&w=majority",

    CoreSwitchWebhook: "https://discord.com/api/webhooks/1277342805181599775/n2sQbFBHfk6AAKcsweZGH_6zr1y96QkJ8x7-mZ1XBR74Y9mwt1vA0BkZI09tGr7F_HHA",
    CoreTitle: "OwnerCord" //? Embed title

})

let manager = process.argv[4]

// pm2 start ../OwnerManager.js -- id token ownerid
client.fetchDatabase()
client.fetchCommands(manager ?? true)
client.fetchEvents(manager ?? true)
client.connect()