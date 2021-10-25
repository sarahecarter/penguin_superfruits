//////////////////////////////////
// Import our Dependencies
//////////////////////////////////
// brings in .env vars
require("dotenv").config()
// web framework
const express = require("express") 
// logger
const morgan = require("morgan")
// to swap request methods
const methodOverride = require("method-override")
// helper functions for file paths
const mongoose = require("mongoose")
// helper functions for file paths
const path = require("path") 


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
// Create our Fruits Model
//////////////////////////////////
// destructuring Schema and model from mongoose
const {Schema, model} = mongoose 

// Make a Fruits Schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// Make the Fruit Model -- always capitalized
const Fruit = model("Fruit", fruitSchema)

// Log the fruit model to make sure it exists 
// console.log(Fruit);


//////////////////////////////////
// Create our app with object, configure liquid
//////////////////////////////////
// import liquid
const liquid = require("liquid-express-views")
// construct an absolute path to our views folder 
const viewsFolder = path.resolve(__dirname, "views/")

// log to see the value of viewsFolder
// console.log(viewsFolder)

// create an app object with liquid, passing the path to the views folder
const app = liquid(express(), {root: viewsFolder})

// console.log app to confirm it exists
// console.log(app)


//////////////////////////////////
// Register our middleware
//////////////////////////////////
// logging
app.use(morgan("tiny"))
// ability to override request methods
app.use(methodOverride("_method"))
// ability to parse urlencoded bodies from form submission
app.use(express.urlencoded({extended: true}))
// setup our public folder to serve files statically
app.use(express.static("public"))

//////////////////////////////////
// Routes
//////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running... better catch it")
})

//////////////////
// Fruits Routes
//////////////////
// seed route - seeds our starter data
app.get("/fruits/seed", (req, res) => {
  // array of starter fruits
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ];
  // delete all fruits
  Fruit.deleteMany({})
  .then((data) => {
      // seed the starter fruits
      Fruit.create(startFruits)
      .then((data) => {
          // send created fruits back as json
          res.json(data)
      })
  })
})

// index route - get - "/fruits"
app.get("/fruits", (req, res) => {
    // find all the fruits
    Fruit.find({})
    .then((fruits) => {
        // render the index template with the fruits
        res.render("fruits/index.liquid", {fruits})
    })
    .catch((error) => {
        res.json({error})
    })
})

// new route - get - "/fruits/:id/new" generates form to create new item
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.liquid")
})

// create route - post - "/fruits"
app.post("/fruits", (req, res) => {
    // convert the checkbox property to true or false
    // ternary operator -- expression ? true : false
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    // create the new fruit -- using MongoDB create() method on model 
    Fruit.create(req.body)
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
})

// edit route - get - "/fruits/:id/edit"
app.get("/fruits/:id/edit", (req, res) => {
    //get the id from params
    const id = req.params.id

    //get the fruit with the matching id
    Fruit.findById(id)
    .then((fruit) => {
        //render the edit page template with the fruit data
        res.render("fruits/edit.liquid", {fruit})
    })
    .catch((error) => {
        res.json({error})
    })
})

// update route - put - "/fruits/:id"
app.put("/fruits/:id", (req, res) => {
    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    const id = req.params.id
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
    .catch((error) => {
        res.json({error})
    })
})

// destroy route - delete request - "/fruits/:id"
app.delete("/fruits/:id", (req, res) => {
    // grab id from params 
    const id = req.params.id
    // delete the fruit 
    Fruit.findByIdAndRemove(id)
    .then((fruit) => {
        res.redirect("/fruits")
    })
    .catch((error) => {
        res.json({error})
    })
})

// show route - get - "/fruits/:id"
app.get("/fruits/:id", (req, res) => {
    // get id from params
    const id = req.params.id

    // get that particular fruit from the database
    Fruit.findById(id)
    .then((fruit) => {
        // render show template with the fruit 
        res.render("fruits/show.liquid", {fruit})
    })
    .catch((error) => {
        res.json({error})
    })
})


//////////////////////////////////
// Server Listener
//////////////////////////////////
// Grabbing the port number from environment
const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))