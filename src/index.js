import 'dotenv/config'
import express from 'express'
import Badge from './models/Badge.js'
// import passport from 'passport'
import passport from './config/passport.js'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import sessionConfig from './config/sessionConfig.js'
import corsConfig from './config/corsConfig.js'

const app = express()
const port = 4000

dotenv.config()

// Connect to database
connectDB()

// Middleware
// Serves the images
app.use(express.static('public'))
// For sessions
app.use(sessionConfig)
// Passport
app.use(passport.initialize())
app.use(passport.session())
// Cors
app.use(corsConfig)


app.get('/auth/github', passport.authenticate('github', { scope: ['user.email'] }))

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile')
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