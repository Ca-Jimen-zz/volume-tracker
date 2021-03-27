const express = require('express')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const User = require('./models/user')
const app = express()
const path = require('path')
const bcrypt =  require('bcrypt')
// const { findOne } = require('./UnneededFiles/user')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const userRoutes = require('./routes/user')


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log('MONGO CONNECTION OPEN!!!')
})
.catch( err => {
    console.log('MONGO CONNECTION ERROR!!!')
    console.log(err)
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('/views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(session({ secret: 'notagoodsecret'}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//requireLogin is a middleware that checks if user is logged in
const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next()
}

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser){
        req.session.user_id = foundUser._id
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/login')
})

// app.post('/register', async (req, res) => {
//     const {password, username} = req.body
//     const foundUser = await User.notInDb(username)
//     if(!foundUser){
//         const user = new User({ username, password })
//         await user.save()
//         req.session.user_id = user._id
//         res.redirect('/')
//     } else {
//         console.log('Username is taken!')
//         res.redirect('/register')
//     }
// })

app.get('/secret', requireLogin, (req, res) => {
        res.send('This is a secret message! Must be signed in to see!')
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})