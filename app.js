const express = require('express')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const User = require('./models/user')
const app = express()
const path = require('path')
const bcrypt =  require('bcrypt')

mongoose.connect('mongodb://localhost:27017/authorization', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log('MONGO CONNECTION OPEN!!!')
})
.catch( err => {
    console.log('OH NO MONGO CONNECTION ERROR!!!')
    console.log(err)
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('/views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const {password, username} = req.body
    const hash = await bcrypt.hash(password, 12)
    const user = new User({
        username, 
        password: hash
    })
    await user.save()
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})