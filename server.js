require('dotenv').config()
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const authController = require("./controllers/auth.controller")
const isSignedIn = require('./middleware/is-signed-in')
// styles?
app.use(express.static(__dirname))
// styles

// DATABASE CONNECTION

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// MIDDLEWARE

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })

}))

app.get("/", async (req, res) => {
  res.render("index.ejs", { title: 'The auth app', user: req.session.user });
})



//ROUTES
app.use('/auth', authController)
app.get('/vip-lounge',isSignedIn,(req,res)=>{
    res.send(`Welcome ${req.session.username}`)
})


const port = process.env.PORT ? process.env.PORT : "3000"
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})

