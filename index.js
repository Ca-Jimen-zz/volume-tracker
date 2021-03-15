const express = require('express')
const ejsMate = require('ejs-mate')
const app = express()
const path = require('path')


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('/views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})