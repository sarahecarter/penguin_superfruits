//////////////////////////////////
// Import our Dependencies
//////////////////////////////////
// loading .env variables
require("dotenv").config()
// our database library
const mongoose = require("mongoose")

//////////////////////////////////
// Establish Database Connection
//////////////////////////////////
// Setup the inputs for mongoose connect
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// Connect to Mongo
mongoose.connect(DATABASE_URL, CONFIG)

// Our Connection Messages
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected from Mongo"))
.on("error", (error) => console.log(error))

//////////////////////////////////
// Export the connection
//////////////////////////////////
module.exports = mongoose