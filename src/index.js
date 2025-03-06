import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import Badge from './models/Badge.js'
import passport from 'passport'
import cors from 'cors'
import {Strategy as GithubStrategy} from 'passport-github2'
import dotenv from 'dotenv'
import session from 'express-session'
import User from './models/User.js'

const app = express()
const port = 4000
const dbURI = 'mongodb://localhost:27017/trivia-app'

dotenv.config()

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to database')
  })
  .catch((err) => {
    console.log(err)
  })

// Middleware
app.use(express.static('public'))
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);


passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback"
}, 
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ githubId: profile.id })
    if (!user) {
      user = await User.create({ 
        githubId: profile.id, 
        username: profile.username,
        imageUrl: profile._json.avatar_url,
        balance: 0
      })
    }
    return done(null, user)
  }
  catch (err) {
    return done(err, null)
  }
}))

passport.serializeUser(async (user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  }
  catch (err) {
    done(err, null)
  }
})

app.get('/auth/github', passport.authenticate('github', { scope: ['user.email'] }))

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect('http://localhost:5173/')
  }
)

app.get('/profile', (req, res) => {
  if (req.user) {
    res.json({user: req.user})
  }
  else {
    res.status(401).send('Not authenticated')
  }
})

app.get('/', (req, res) => {
  res.json({msg: "Hello, world!"})
})

app.get('/badges/', async (req, res) => {
  const badges = await Badge.find()
  res.json(badges)
})

app.get('/badges/:id', async (req, res) => {
  try {
    const badge = await Badge.findOne({_id: req.params.id})
    if (!badge) res.status(404).json({msg: `No badge found with id ${req.params.id}`})
    res.status(200).json(badge)
  }
  catch (err) {
    if (err.name == 'CastError') res.status(400).json({msg: err})
    else res.status(500).json({msg: err})
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})