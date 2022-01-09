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

router.get('/sortedByMostLikes', (req,res) => {
    Meal.find({}).sort({"calories": -1})
    .then((meals) => {
        res.render('allMeals', {meals})
    })
    .catch(err => console.log(err))
    
})

//Display meals user has created, if logged in
router.get('/myMeals', authRequired, (req, res)=> {
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

router.get('/searchForWeekOfMeals',(req,res) => {
    Meal.find({}, (err, meals) => {
        let submitted = false
        let meals2 = null
        let meals3 = null
        res.render('searchForWeekOfMeals', {meals , meals2 , meals3, submitted})
    })
})
//Get a random meal from the database and display it
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

//When search params posted on search page, find meals that match the criteria. If a field is empty, ignore it.
// router.post('/allMeals', (req,res,next) => {
//    //Loop through req.body and if req.body[key] isn't empty, add that to query.
//     //Then pass query to Meal.find
//     let query = {}
//     for (let key in req.body) {
//         if (req.body[key] != ''){
//             query[key] = req.body[key]
//         }
//     }
//     Meal.find(query, (err, meals) => {
//         // console.log('First one')
//         // console.log(req.body)
//         // console.log(query)
       
//         res.render('filteredMeals', {meals})
//     })
// })
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
         // console.log('First one')
         // console.log(req.body)
         // console.log(query)
         console.log('Calorie and protein route activated!')
        
         res.render('filteredMeals', {meals})
     })
    }

    //If just protein submitted, return this
   else if (query.protein && !query.calories){
        Meal.find({ protein: {$gte: query.protein}}, (err, meals) => {
            // console.log('First one')
            // console.log(req.body)
            // console.log(query)
            console.log('protein route activated!')
           
            res.render('filteredMeals', {meals})
        })
       }
    //If just calories submitted, return this
       else if (query.calories && !query.protein){
        Meal.find({ calories: {$lte: query.calories}}, (err, meals) => {
            // console.log('First one')
            // console.log(req.body)
            // console.log(query)
            console.log('Calorie route activated!')
           
            res.render('filteredMeals', {meals})
        })
       }
    //If neither protein or calories fields submitted, return this
    else {
        Meal.find(query, (err, meals) => {
                    // console.log('First one')
                    // console.log(req.body)
                    // console.log(query)
                   
                    res.render('filteredMeals', {meals})
                })
    }
 })

router.post('/searchForWeekOfMeals', async (req,res,next) => {
    //Loop through req.body and if req.body[key] isn't empty, add that to query.
     //Then pass query to Meal.find
     let breakfastMeals = null
     let lunchMeals = null
     let dinnerMeals = null
     let meals = null
     let submitted = true
     let query = {}
     for (let key in req.body) {
         if (req.body[key] != ''){
             query[key] = req.body[key]
         }
     }
     query.type = "Breakfast"
    await Meal.find(query, (err, meals) => {
         // console.log('First one')
         // console.log(req.body)
         // console.log(query)
         breakfastMeals = meals
         console.log(breakfastMeals)
        
     })
     query.type = "Lunch"

     await Meal.find(query, (err, meals) => {
        lunchMeals = meals
     })
     query.type = "Dinner"

     await Meal.find(query, (err,meals) => {
         dinnerMeals = meals
     })
     res.render('searchForWeekOfMeals', {breakfastMeals, lunchMeals, dinnerMeals, submitted})
 })

//  router.post('/searchForWeekOfMeals', (req,res,next) => {
//     //Loop through req.body and if req.body[key] isn't empty, add that to query.
//      //Then pass query to Meal.find
//      let submitted = true
//      let query = {}
//      for (let key in req.body) {
//          if (req.body[key] != ''){
//              query[key] = req.body[key]
//          }
//      }
//      Meal.find(query, (err, meals) => {
//          // console.log('First one')
//          // console.log(req.body)
//          // console.log(query)
        
//          res.render('searchForWeekOfMeals', {meals ,submitted})
//      })
//  })


 router.post('/searchForWeekOfMeals2', (req,res,next) => {
    //Loop through req.body and if req.body[key] isn't empty, add that to query.
     //Then pass query to Meal.find
     let query = {}
    //  let meals = req.body.meals
     let meals3 = null
     for (let key in req.body) {
         if (req.body[key] != ''){
             query[key] = req.body[key]
         }
     }
     Meal.find(query, (err, meals2) => {
         // console.log('First one')
         // console.log(req.body)
         // console.log(query)
         let meals = meals2
        
         res.render('searchForWeekOfMeals', {meals , meals2 , meals3})
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

//Like button logic.
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
            res.redirect('/session/login')
            // req.session.message = "You must be logged in to perform this action"
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
//Create a meal and red direct to home (will change this to redirect to my meals if logged in)
router.post('/', (req,res,next) => {
    let newMeal = req.body
    newMeal.owner = req.session.username
    Meal.create(newMeal)
    res.redirect('/meals/myMeals')
})

// Edit the meal by id
router.put('/:id', (req,res,next)=>{
    Meal.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, newMeal) => {
        res.redirect('/meals/myMeals')
    })
})

//Delte meal by id, will want to add something like an "Are you sure you want to delete this meal? It'll be lost forever." Message.
router.delete('/:id', (req,res,next) => {
    Meal.findByIdAndDelete(req.params.id)
    .then(res.redirect('/meals/myMeals'))
    .then(err => console.log(err))
})



module.exports = router