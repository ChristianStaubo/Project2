const mongoose = require('../db/connection')

const CollectionSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    breakfast: {
        type:String,
        default:'N/A',
    },
    breakfastCalories:Number,
    breakfastProtein:Number,
    lunch: {
        type:String,
        default:'N/A',
        calories:Number
    },
    lunchCalories:Number,
    lunchProtein:Number,
    dinner: {
        type:String,
        default:'N/A',
        calories:Number
    },
    dinnerCalories:Number,
    dinnerProtein:Number,
    owner: {
        type:String,
    },



})


const Collection = mongoose.model("Collection", CollectionSchema)

module.exports = Collection