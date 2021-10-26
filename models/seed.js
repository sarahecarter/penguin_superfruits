//////////////////////
// Import Dependencies
//////////////////////
const mongoose = require("./connection")
const Fruit = require("./fruit")

//////////////////////
// Seed Code
//////////////////////

// save connection in a variable 
const db = mongoose.connection

// make sure code doesn't run until connection is open
// wrap seed code in callback
db.on("open", () => {
    // array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ];

    // delete all fruits
    Fruit.deleteMany({}).then((data) => {
        // seed the starter fruits
        Fruit.create(startFruits).then((data) => {
            console.log(data)
            db.close()
        })
    })
})