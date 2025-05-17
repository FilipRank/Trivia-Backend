import passport from "passport"
import dotenv from 'dotenv'
import {Strategy as GithubStrategy} from 'passport-github2'
import User from "../models/User.js"

dotenv.config()

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`
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

export default passport