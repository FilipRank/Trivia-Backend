import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.use((req, res, next) => {
  if (!req.user) return res.status(401).send('Not authenticated')
  next()
})

router.get('/', (req, res) => {
  res.json({user: req.user})
})

router.patch('/increase-balance', async (req, res) => {
  try {
    const amount = req.query.amount

    if (!amount) return res.status(400).json({error: '"amount" parameter required'})
    if (amount < 1) return res.status(400).json({error: 'amount cannot be less than 1'})
    
    await User.findByIdAndUpdate(req.user._id, {$inc: {balance: amount}})
    const updatedUser = await User.findById(req.user._id)
    res.status(200).json({user: updatedUser})
  }
  catch (err) {
    res.status(500).json({error: err})
    console.error(err)
  }
})

export default router