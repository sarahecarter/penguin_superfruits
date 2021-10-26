//////////////////////////////////
// Import our dependencies
//////////////////////////////////
const mongoose = require("./connection")

//////////////////////////////////
// Create our User Model
//////////////////////////////////
// destructuring Schema and model from mongoose
const {Schema, model} = mongoose 

// Make a user Schema
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// Make the Fruit Model -- always capitalized
const User = model("User", userSchema)

//////////////////////////////////
// Export the fruit model
//////////////////////////////////
module.exports = User