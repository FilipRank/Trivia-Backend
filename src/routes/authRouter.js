import express from 'express'
import passport from 'passport'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.get('/github', passport.authenticate('github', { scope: ['user.email'] }))

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}`)
  }
)

router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err)

      req.session.destroy((err) => {
        if (err) return next(err)

        res.clearCookie('connect.sid')
        res.status(200).json({
          message: "Logged out",
        });
      })
  })
})

export default router