//DEPENDENCIES

const express = require('express')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const session = require('express-session')
const mealController = require('./controllers/meal')
const sessionController = require('./controllers/session')
const expressEJSLayouts = require('express-ejs-layouts')

//MIDDLEWARE

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(express.static('public'))
app.use(expressEJSLayouts)

//Make username available on all pages
app.use((req,res,next) => {
    res.locals.username = req.session.username
    res.locals.loggedIn = req.session.loggedIn
    next()
})
//flash messaging
app.use((req,res,next) => {
    res.locals.message = req.session.message
    
    //Reset message to blank string
    req.session.message = ""

    next()
})

const authRequired = (req,res,next) => {
    if (req.session.loggedIn) {
        next()
    }
    else {
        res.redirect('/session/login')
    }
}
app.set('view engine', 'ejs')

app.use('/meals', mealController)
app.use('/session', sessionController)

app.get('/')
app.listen(PORT, ()=> {
    console.log(`Working on port: ${PORT}`)
})

