const express = require('express')
const app = express()
const PORT = 4000
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const mealController = require('./controllers/meal')
// const methodOverride = require('method-override')
const expressEJSLayouts = require('express-ejs-layouts')
// app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(expressEJSLayouts)
app.use('/meals', mealController)
app.set('view engine', 'ejs')


app.listen(PORT, ()=> {
    console.log(`Working on port: ${PORT}`)
})

