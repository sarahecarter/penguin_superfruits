//////////////////////////////
// Import Dependencies
//////////////////////////////
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//////////////////////////////////
// Create router
//////////////////////////////////
// router is where we regitser our routes
const router = express.Router();

//////////////////////////////////
// Routes
//////////////////////////////////

// Signup Routers (Get => Form, Post => form submit)
// "/user/signup"
router.get("/signup", (req, res) => {
    res.render("user/signup.liquid")
})

router.post("/signup", async (req, res) => {
    // encrypt the password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))

    // save the user to our database
    User.create(req.body)
    .then((user) => {
        // log the user as a test 
        console.log(user)
        // redirect user to login
        res.redirect("/user/login")
    })
    .catch((error) => {
        res.json({error})
    })
})

// Login Routers (Get => Form, Post => form submit)
// "/user/signup"
router.get("/login", (req, res) => {
    res.render("user/login.liquid")
})

router.post("/login", async (req, res) => {
    // destructure username and password from req.body
    const {username, password} = req.body

    // search for the user - use findOne because we only want one user, using find returns array 
    User.findOne({username})
    .then(async (user) => {
        // check if user exists 
        if (user) {
            // compare passwords
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                // store some data in session
                req.session.username = username
                req.session.loggedIn = true
                // redirect to fruit index page
                res.redirect("/fruits")
            }
            else {
                res.json({error: "password doesn't match"})
            }
        
        }
        else {
            // send errro that user does not exist 
            res.json({error: "User doesn't exist"})
        }
    })
    .catch((error) => {
        res.json({error})
    })
})

// logout route, get request to /user/logout
router.get("/logout", (req, res) => {
    // destroy the session
    req.session.destroy((err) => {
        // send user back to main page
        res.redirect("/")
    })
})

//////////////////////////////////
// Export router
//////////////////////////////////
module.exports = router