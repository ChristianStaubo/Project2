const mongoose = require('../db/connection')

const MealSchema = new mongoose.Schema({
    name:{type:String, required:true},
    type:String,
    calories:{type:Number, required:true},
    protein:String,
    ingredients:[String],
    Optional:[String]

})


const Meal = mongoose.model("Meal", MealSchema)

module.exports = Meal