const mongoose = require('mongoose')

const Admin = mongoose.Schema({

    id: { type: String, required: true },

    Blacklist_User: { type: Array, default: []}, //! Kullanıcıyı blacklist ekler ve botun komutlarını kullanımına engeller.
    Blacklist_Server: { type: Array, default: []}, //! Sunucuyu blacklist ekler ve botun o sunucuya eklenmesini engeller.

    Whitelist_Server: { type: Array, default: [] }, //! Manager botundan girilcek (Logs sunucusu için & tek server id whitelist olucak sonradan guild verilerinde gözükmicek)

})

module.exports = mongoose.model('OwnerCord_Manager', Admin)