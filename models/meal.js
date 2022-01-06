const mongoose = require('../db/connection')
const User = require('../models/user')
const Session = require('../controllers/session')


const MealSchema = new mongoose.Schema({
    name:{type:String, required:true},
    type:String,
    type:{type:String, default:"N/A"},
    calories:{type:Number, required:true},
    protein:Number,
    ingredients:[String],
    optional:[String],
    owner:{type:String,},
    likes:[String],

})


const Meal = mongoose.model("Meal", MealSchema)

module.exports = Meal