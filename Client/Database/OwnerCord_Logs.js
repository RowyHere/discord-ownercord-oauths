const mongoose = require('mongoose')

const Admin = mongoose.Schema({

    bot: { type: String, require: true },
    guild: { type: String, require: true },
    user: { type: String, require: true },
    stats: { type: Array, require: true }

})

module.exports = mongoose.model('OwnerCord_Logs', Admin)