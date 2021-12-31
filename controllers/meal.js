const express = require('express')
const router = express.Router()
const Meal = require('../models/meal')
//Home route
router.get('/', (req, res, next) => {
    // Meal.find({name:"Orange"}, (err, orange)=>{
    //     console.log(orange)
    // })
    res.render('home')
})
//About route
router.get('/about', (req, res, next) => {
    res.render('about')
})
//Create new meal route
router.get('/new', (req, res, next) => {
    res.render('new')
})

router.get('/allMeals', (req, res)=> {
    Meal.find({}, (err, meals) => {
        res.render('allMeals',{meals})
    })
})
//Get route for the search page
router.get('/search', (req,res) => {
    res.render('search')
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
        console.log('First one')
        console.log(req.body)
        console.log(query)
       
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
        res.render('specificMeal', {meal})
    })
})
//Show route for edit page on meal id.

router.get('/:id/edit', (req,res) => {
    Meal.findById(req.params.id, (err, meal) =>{
        res.render('edit', {meal})
    })
})
//Create a meal and red direct to home (will change this to redirect to my meals if logged in)
router.post('/', (req,res,next) => {
    Meal.create(req.body)
    // .then(meal => res.json(meal))
    res.redirect('/meals')
    // .catch(next)
})
// Edit the meal by id
router.put('/:id', (req,res,next)=>{
    Meal.findByIdAndUpdate(req.params.id, req.body, {new:true})
    console.log(req.body)
    console.log(req.params.id)
    res.redirect('/meals')

})

//Delte meal by id, will want to add something like an "Are you sure you want to delete this meal? It'll be lost forever." Message.
router.delete('/:id', (req,res,next) => {
    Meal.findByIdAndDelete(req.body)
    .then (meal => res.json(meal))
    .catch(next)
})



module.exports = router