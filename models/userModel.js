const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps :true // to add created_at and updated_at fields in the schema automatically
})

const userModel = mongoose.model('users', userSchema)
module.exports = userModel;