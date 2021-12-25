const mongoose = require('./connection')
const Meal = require('../models/meal')
const mealSeeds = require('./seeds.json')

Meal.deleteMany({})
.then(() => {
   return Meal.insertMany(mealSeeds)
})
.then(data => {
    console.log(data)
})
.catch(err => console.log(err))
.finally(() => {
    process.exit()
})