const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//mongoose user model

// const User=require('./../models/User');

const UserSchema = new Schema({
    name:String,
    email:String,
    password:String,
    dateOfBirth:Date
});

const User=mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);

module.exports=User