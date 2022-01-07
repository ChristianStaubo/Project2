const express = require('express')
const router = express.Router()
const Meal = require('../models/meal')

const authRequired = (req,res,next) => {
    if (req.session.loggedIn) {
        next()
    }
    else {
        res.redirect('/session/login')
    }
}
//Home route
router.get('/', (req, res, next) => {
    // Meal.find({name:"Orange"}, (err, orange)=>{
    //     console.log(orange)
    // })
    // console.log(res.locals.username)
    res.render('home', {
        username: req.session.username
    })
})
//About route
router.get('/about', (req, res, next) => {
    res.render('about')
})
//Create new meal route
router.get('/new', authRequired, (req, res, next) => {
    res.render('new')
})
//Display all meals route
router.get('/allMeals', (req, res)=> {
    Meal.find({}, (err, meals) => {
        res.render('allMeals',{meals})
    })
})

router.get('/myMeals', (req, res)=> {
    Meal.find({owner: res.locals.username }, (err, meals) => {
        res.render('myMeals',{meals})
    })
})


//Get route for the search page
router.get('/search', (req,res) => {
    Meal.find({} , (err, meals) => {
        res.render('search', {meals})
    })
})

router.get('/randomizedMeal', (req,res) => {
    Meal.find({}, (err,meals) => {
        let randomMealIndex = Math.floor(Math.random() * meals.length)
        let meal = meals[randomMealIndex]
        res.render('randomizedMeal', {meal})
    })
})
//Get route for the filtered meals page
router.get('/filtered', (req,res) => {
    res.render('filteredMeals')
})

router.post('/allMeals', (req,res,next) => {
   //Loop through req.body and if req.body[key] isn't empty, add that to query.
    //Then pass query to Meal.find
    let query = {}
    for (let key in req.body) {
        if (req.body[key] != ''){
            query[key] = req.body[key]
        }
    }
    Meal.find(query, (err, meals) => {
        // console.log('First one')
        // console.log(req.body)
        // console.log(query)
       
        res.render('filteredMeals', {meals})
    })
})

//CONCEPT FOR GREATER THAN QUERY OF CALORIES AND PROTEIN


// router.post('/allMeals', (req,res,next) => {
//     //Loop through req.body and if req.body[key] isn't empty, add that to query.
//      //Then pass query to Meal.find
//      let query = {}
//      for (let key in req.body) {
//          if (req.body[key] != ''){
//              query[key] = req.body[key]
//          }
//      }
//      if (query['calories'] == ''){
//      Meal.find(query, (err, meals) => {
//          console.log('First one')
//          console.log(req.body)
//          console.log(query)
        
//          res.render('filteredMeals', {meals})
//      })
//  }
//  else if (query['calories'] != ''){
//      Meal.find(query, { $gt:query.calories}, (err, meals) => {
//          console.log('Second one')
//          console.log(req.body)
//          console.log(query)
        
//          res.render('filteredMeals', {meals})
//      })
//  }
//  })


//When meal is clicked, display meal clicked with all its info
router.get('/:id', (req,res,next) => {
    Meal.findById((req.params.id), (err, meal) => {
        let username = req.session.username
        res.render('specificMeal', {meal, username})
    })
})
// Show route for edit page on meal id.
// router.post('/:id/like', (req,res) => {
//     let meal = Meal.findById(req.params.id)
//     console.log(meal.calories)
//     let updatedLikedMeal = req.body
//     // console.log(req.session.username)
//     // updatedLikedMeal.likes.push(req.session.username)
//     // console.log(updatedLikedMeal)
//     Meal.findByIdAndUpdate(req.params.id, updatedLikedMeal, {new:true})

//     res.redirect('/meals')
// })

router.put('/:id/like', async (req,res,next)=>{
    //Add a like to a specific meal if you haven't liked already and are logged in
    try{
        let meal = await Meal.findById(req.params.id)
        if (!meal.likes.includes(req.session.username) && req.session.loggedIn){
        meal.likes.push(req.session.username)
        await meal.save()
    res.redirect('/meals')
        }
        else {
            res.redirect('/meals')
            console.log('Not logged in or have liked, can not like')
        }
    }
    catch(err){
        console.log(err)
        next(err)
    }

})

router.get('/:id/edit', (req,res) => {
    Meal.findById(req.params.id, (err, meal) =>{
        res.render('edit', {meal})
    })
})
//Create a meal and red direct to home (will change this to redirect to my meals if logged in)
router.post('/', (req,res,next) => {
    let newMeal = req.body
    newMeal.owner = req.session.username
    Meal.create(newMeal)
    console.log(req.body)
    console.log(newMeal)
    // console.log(req.body)
    res.redirect('/meals')
    // .catch(next)
    //YOU FUCKING GENIUS!!!!!!!!!!!!!!!!
})
// Edit the meal by id
router.put('/:id', (req,res,next)=>{
    Meal.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, newMeal) => {
        res.redirect('/meals/allMeals')
    })
    // console.log(req.body)
    // console.log(req.params.id)

})

//Delte meal by id, will want to add something like an "Are you sure you want to delete this meal? It'll be lost forever." Message.
router.delete('/:id', (req,res,next) => {
    // Meal.findByIdAndDelete(req.params.id)
    // res.redirect('/meals/allMeals')
    console.log(req.params)
    Meal.findByIdAndDelete(req.params.id)
    .then(res.redirect('/meals/allMeals'))
    .then(err => console.log(err))
})



module.exports = router