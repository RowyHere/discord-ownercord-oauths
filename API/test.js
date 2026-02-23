const Bots = require('./Database/OwnerCord_Bots')

const mongoose = require('mongoose')
mongoose.connect(this.mongoose).then(async () => {
    console.log("Callback API Bağlantısı Kuruldu.")
}).catch((err) => {
    console.error(err)
})

async function main() {
    let Bot = await Bots.find()
    console.log(Bot)
}
main()