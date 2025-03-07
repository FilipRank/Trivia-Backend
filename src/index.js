import 'dotenv/config'
import express, { json } from 'express'
import passport from './config/passport.js'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import sessionConfig from './config/sessionConfig.js'
import corsConfig from './config/corsConfig.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import badgeRouter from './routes/badgeRouter.js'

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
// Body parsing
app.use(json())
// Routes
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/badges', badgeRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})