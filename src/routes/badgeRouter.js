import express from 'express'
import Badge from '../models/Badge.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.get('/', async (req, res) => {
  const badges = await Badge.find()
  if (process.env.BACKEND_URL) {
    badges.forEach(badge => {badge.imageUri = process.env.BACKEND_URL + `/badges/${badge.name.toLowerCase().replace(/\s+/g, '')}.png`})
  }
  res.json(badges)
})

router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findOne({_id: req.params.id})
    if (!badge) res.status(404).json({msg: `No badge found with id ${req.params.id}`})
    if (process.env.BACKEND_URL) 
      badge.imageUri = process.env.BACKEND_URL + `/badges/${badge.name.toLowerCase().replace(/\s+/g, '')}.png`
    res.status(200).json(badge)
  }
  catch (err) {
    if (err.name == 'CastError') res.status(400).json({msg: err})
    else res.status(500).json({msg: err})
  }
})

export default router