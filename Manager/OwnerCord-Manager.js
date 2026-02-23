const Core = require('./Utils/Core')
const client = new Core({

    CoreToken: "MTI2MDcyNjIyMTQxNTY0OTMyMg.Gnht4O.5C4tTIOnYkaZXNLrUgBd__KUKbz_YNsEKUo6Io",
    CoreID: "1260726221415649322",
    CorePort: 8080,
    CoreRedirect: "http://5.180.106.213:8080/callback",
    CoreDevelopers: ["1258799116897615885"],
    CoreMongoose: "mongodb+srv://rowyauth:eferowy1900@new-db.8hxxf.mongodb.net/?retryWrites=true&w=majority",
    CoreWebhooks: "https://discord.com/api/webhooks/1277342805181599775/n2sQbFBHfk6AAKcsweZGH_6zr1y96QkJ8x7-mZ1XBR74Y9mwt1vA0BkZI09tGr7F_HHA",
    // Bot Create webhook
    
    CoreTitle: "OwnerCord" //? Embed title

})

client.fetchDatabase()
client.fetchCommands()
client.fetchEvents()
client.connect()