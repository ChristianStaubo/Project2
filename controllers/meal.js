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

router.get('/myMeals', (req, res)=> {
    Meal.find({}, (err, meals) => {
        res.render('myMeals',{meals})
    })
})


//Show route for each meal
// router.get('/:id', (req,res,next) => {
//     Meal.findById(req.params.id)
//     .then(meal => res.json(meal))
//     .catch(next)
// })


//When meal is clicked, display meal clicked with all its info
router.get('/:id', (req,res,next) => {
    Meal.findById((req.params.id), (err, meal) => {
        res.render('specificMeal', {meal})
    })
})
//Show route for edit page on meal id.
router.get('/:id/edit', (req,res,next) => {
    Meal.findById(req.params.id)
    .then(meal => res.json(meal))
    .catch(next)
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
    .then(meal => res.json(meal))
    .catch(next)

})

//Delte meal by id, will want to add something like an "Are you sure you want to delete this meal? It'll be lost forever." Message.
router.delete('/:id', (req,res,next) => {
    Meal.findByIdAndDelete(req.body)
    .then (meal => res.json(meal))
    .catch(next)
})



module.exports = router