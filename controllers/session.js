const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require('bcrypt')
let userToMealModel = ''
router.get('/', (req,res) => {
    res.send('Session controller works')
})

router.get('/register', (req,res) => {
    res.render('session/register')
})

router.get('/login', (req,res) => {
    res.render('session/login')
})

router.post('/login', async (req,res,next) => {
    try {
        const userToLogin = await User.findOne({username: req.body.username})
        if (userToLogin) {
            const validPassword = bcrypt.compareSync(req.body.password, userToLogin.password)
            if (validPassword) {
                req.session.username = userToLogin.username
                userToMealModel = userToLogin.username
                console.log(userToMealModel)
                req.session.loggedIn = true
                res.redirect('/meals')
            }
            else {
                req.session.message = "Invalid username or password"
                res.redirect('/session/login')
            }
        }
        else {
            req.session.message = "Invalid username or password"
        }
    } catch (err) {
        next(err)
    }
})
router.post('/register', async (req,res,next) => {
    try {
        if (req.body.password === req.body.verifyPassword){
            const desiredUsername = req.body.username
            const userExists = await User.findOne({ username: desiredUsername})
            if (userExists){
                res.send('Username already taken')
            }
            else {
                const salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt)
                req.body.password = hashedPassword
                const createdUser = await User.create(req.body)
                req.session.username = createdUser.username
                req.session.loggedIn = true
                res.redirect('/meals')
            }
        }
        else {
            req.session.message = "Passwords must match"
        }
    } catch (err) {
        next(err)
    }
})

router.get('/logout', (req,res) => {
    req.session.destroy()
    res.redirect('/session/login')
})


module.exports = router