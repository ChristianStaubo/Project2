const mongoose = require('../db/connection')
const User = require('../models/user')
const Session = require('../controllers/session')

const MealSchema = new mongoose.Schema({
    name:{type:String, required:true},
    type:String,
    type:{type:String, default:"N/A"},
    calories:{type:Number, required:true},
    protein:String,
    ingredients:[String],
    optional:[String],
    owner:{type:String, default:Session.userToMealModel}

})


const Meal = mongoose.model("Meal", MealSchema)

module.exports = Meal