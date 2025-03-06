import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  if (req.user) {
    res.json({user: req.user})
  }
  else {
    res.status(401).send('Not authenticated')
  }
})

export default router