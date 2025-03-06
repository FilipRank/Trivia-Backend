import express from 'express'
import passport from 'passport'
import dotenv from 'dotenv'

dotenv.config

const router = express.Router()

router.get('/github', passport.authenticate('github', { scope: ['user.email'] }))

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}`)
  }
)

export default router