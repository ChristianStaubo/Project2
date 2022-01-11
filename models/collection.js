const mongoose = require('../db/connection')

const CollectionSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    breakfast: {
        type:String,
        default:'N/A'
    },
    lunch: {
        type:String,
        default:'N/A'
    },
    dinner: {
        type:String,
        default:'N/A'
    },
    owner: {
        type:String,
    },



})


const Collection = mongoose.model("Collection", CollectionSchema)

module.exports = Collection