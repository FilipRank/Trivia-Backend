import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import Badge from './models/Badge.js'

const app = express()
const port = 4000
const dbURI = 'mongodb://localhost:27017/trivia-app'

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to database')
  })
  .catch((err) => {
    console.log(err)
  })

app.use(express.static('public'))

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