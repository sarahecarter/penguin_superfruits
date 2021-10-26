//////////////////////////////////
// Import our dependencies
//////////////////////////////////
const mongoose = require("./connection")

//////////////////////////////////
// Create our Fruits Model
//////////////////////////////////
// destructuring Schema and model from mongoose
const {Schema, model} = mongoose 

// Make a Fruits Schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean,
    username: String
})

// Make the Fruit Model -- always capitalized
const Fruit = model("Fruit", fruitSchema)

// Log the fruit model to make sure it exists 
// console.log(Fruit);

//////////////////////////////////
// Export the fruit model
//////////////////////////////////
module.exports = Fruit