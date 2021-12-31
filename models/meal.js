const mongoose = require('../db/connection')

const MealSchema = new mongoose.Schema({
    name:{type:String, required:true},
    type:String,
    type:{type:String, default:"N/A"},
    calories:{type:Number, required:true},
    protein:String,
    ingredients:[String],
    optional:[String],
    owner:{type:String, default:'Userx'}

})


const Meal = mongoose.model("Meal", MealSchema)

module.exports = Meal