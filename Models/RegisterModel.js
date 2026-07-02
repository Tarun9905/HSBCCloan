const mongoose = require('mongoose')

const RegisterSchema = mongoose.Schema({
    userName:{ type: String, required: true ,unique: true},
    accountType:{ type: String, required: true},
    password:{ type: String, required: true },
    accountNo:{ type: String, required: true, unique: true },
})

const RegisterModel = mongoose.model('Registration',RegisterSchema)

module.exports = RegisterModel