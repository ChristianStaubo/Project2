const express = require('express')
// const { Collection } = require('mongoose')
const router = express.Router()
const Meal = require('../models/meal')
const Collection = require('../models/collection')

const multer = require('multer')

//define storage for images

const storage = multer.diskStorage({

    //destination for files
    destination:function (req, file, callback) {
        callback(null, __dirname)
        // '../public/photos/images'
    },


    //ad back the extension
    filename:function (req,file,callback) {
        callback(null, file.originalname)
    }
})

//upload parameters for multer

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024* 1024 * 3 
    }
})

const authRequired = (req,res,next) => {
    if (req.session.loggedIn) {
        next()
    }
    else {
        res.redirect('/session/login')
    }
}

//HOME
router.get('/', (req, res, next) => {
    res.render('home', {
        username: req.session.username
    })
})

//ABOUT
router.get('/about', (req, res, next) => {
    res.render('about')
})

//NEW MEAL
router.get('/new', authRequired, (req, res, next) => {
    res.render('new')
})


//DISPLAY ALL MEALS
router.get('/allMeals', (req, res)=> {
    Meal.find({}, (err, meals) => {
        res.render('allMeals',{meals})
    })
})

//SORTING SECTION

router.get('/sortedByMostLikes', (req,res) => {
    Meal.find({}).sort({"likes": -1})
    .then((meals) => {
        let sortedBylikesMeals = meals.sort((first,second) => {
            let firstLength = first.likes.length
            let secondLength = second.likes.length
            return secondLength - firstLength

        })
        res.render('allMeals', {sortedBylikesMeals, meals})
    })
    .catch(err => console.log(err))
    
})

router.get('/sortedByLeastCalories', (req,res) => {
    Meal.find({}).sort({"calories": 1})
    .then((meals) => {
        res.render('allMeals', {meals})
    })
    .catch(err => console.log(err))
    
})

router.get('/sortedByMostProtein', (req,res) => {
    Meal.find({}).sort({"protein": -1})
    .then((meals) => {
        res.render('allMeals', {meals})
    })
    .catch(err => console.log(err))
    
})

//SORTING SECTION


//Display meals user has created, if logged in
router.get('/myMeals', authRequired, (req, res)=> {
    Meal.find({owner: res.locals.username }, (err, meals) => {
        res.render('myMeals',{meals})
    })
})


//SEARCH FOR A MEAL
router.get('/search', (req,res) => {
    Meal.find({} , (err, meals) => {
        res.render('search', {meals})
    })
})


//DISPLAY USERS COLLECTIONS
router.get('/collections', authRequired, (req, res)=> {
    Collection.find({owner: res.locals.username }, (err, collections) => {

        res.render('collections',{collections})
    })
})


router.get('/newCollection', (req,res) => {
    Meal.find({}, (err, meals) => {
        res.render('newCollection', {meals})
    })
})

//Create a new collection
router.post('/newCollection', (req,res,next) => {
    let newCollection = req.body
    newCollection.owner = req.session.username
    Collection.create(newCollection)
    res.redirect('/meals/collections')
})


//SEARCH FOR COLLECTIONS
router.get('/searchForWeekOfMeals',(req,res) => {
    Meal.find({}, (err, meals) => {
        let submitted = false
        res.render('searchForWeekOfMeals', {meals , submitted})
    })
})


//GET RANDOM MEAL
router.get('/randomizedMeal', (req,res) => {
    Meal.find({}, (err,meals) => {
        let randomMealIndex = Math.floor(Math.random() * meals.length)
        let meal = meals[randomMealIndex]
        res.render('randomizedMeal', {meal})
    })
})


//DISPLAY FILTERED MEALS
router.get('/filtered', (req,res) => {
    res.render('filteredMeals')
})


//SEARCH RESULTS LOGIC


router.post('/allMeals', (req,res,next) => {
    //Loop through req.body and if req.body[key] isn't empty, add that to query.
     //Then pass query to Meal.find
     let query = {}
     for (let key in req.body) {
         if (req.body[key] != ''){
             query[key] = req.body[key]
         }
     }

     //If protein and calories fields have been submitted, return meals that meet those criteria
     if (query.protein && query.calories){
     Meal.find({ $and: [{ calories: {$lte: query.calories}}, { protein: {$gte: query.protein}}]}, (err, meals) => {
         res.render('filteredMeals', {meals})
     })
    }

    //If just protein submitted, return this
   else if (query.protein && !query.calories){
        Meal.find({ protein: {$gte: query.protein}}, (err, meals) => {
            res.render('filteredMeals', {meals})
        })
       }
    //If just calories submitted, return this
       else if (query.calories && !query.protein){
        Meal.find({ calories: {$lte: query.calories}}, (err, meals) => {
            res.render('filteredMeals', {meals})
        })
       }
    //If neither protein or calories fields submitted, return this
    else {
        Meal.find(query, (err, meals) => {
                   
                    res.render('filteredMeals', {meals})
                })
    }
 })


 //SEARCH LOGIC FOR COLLECTIONS


 router.post('/searchForWeekOfMeals', (req,res,next) => {
    //Loop through req.body and if req.body[key] isn't empty, add that to query.
     //Then pass query to Meal.find
     let submitted = true
     let query = {}
     for (let key in req.body) {
         if (req.body[key] != ''){
             query[key] = req.body[key]
         }
     }
     Meal.find(query, (err, meals) => {
        
         res.render('searchForWeekOfMeals', {meals ,submitted})
     })
 })

 //INDIVIDUAL MEAL FROM CLICK

//When meal is clicked, display meal clicked with all its info
router.get('/:id', (req,res,next) => {
    Meal.findById((req.params.id), (err, meal) => {
        let username = req.session.username
        res.render('specificMeal', {meal, username})
    })
})

//LIKE BUTTON LOGIC


router.put('/:id/like', async (req,res,next)=>{
    //Add a like to a specific meal if you haven't liked already and are logged in
    try{
        let meal = await Meal.findById(req.params.id)
        if (!meal.likes.includes(req.session.username) && req.session.loggedIn){
        meal.likes.push(req.session.username)
        await meal.save()
    res.redirect('/meals/allMeals')
        }
        else {
            if(req.session.loggedIn){
                res.redirect('/meals/allMeals')
            }
            else{
            res.redirect('/session/login')
            // req.session.message = "You must be logged in to perform this action"
            }
        }
    }
    catch(err){
        console.log(err)
        next(err)
    }

})


//Display edit page for individual meal
router.get('/:id/edit', (req,res) => {
    Meal.findById(req.params.id, (err, meal) =>{
        res.render('edit', {meal})
    })
})


//CREATE A MEAL LOGIC


router.post('/', upload.single('image'), (req,res,next) => {
    let newMeal = req.body
    // console.log(typeof newMeal.calories)
    // console.log(typeof newMeal.protein)
    // if (typeof newMeal.calories != Number|| typeof newMeal.protein != Number){
    //     req.session.message = "Invalid input, please input numbers for calories and protein"
    //     res.redirect('/meals/new')
    // }
    // else{
    // console.log(req.file)
    // req.file.path = '../public/photos/images'
    // console.log(req.file)
    newMeal.owner = req.session.username
    // newMeal.img = req.file.filename
    Meal.create(newMeal)
    res.redirect('/meals/myMeals')
})
// Edit the meal by id
router.put('/:id', (req,res,next)=>{
    Meal.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, newMeal) => {
        res.redirect('/meals/myMeals')
    })
})


//DELETE


//Delete collection item
router.delete('/collections/:id', (req,res,next) => {
    Collection.findByIdAndDelete(req.params.id)
    .then(res.redirect('/meals/collections'))
    .then(err => console.log(err))
})

//Delete meal user has created
router.delete('/:id', (req,res,next) => {
    Meal.findByIdAndDelete(req.params.id)
    .then(res.redirect('/meals/myMeals'))
    .then(err => console.log(err))
})



module.exports = router