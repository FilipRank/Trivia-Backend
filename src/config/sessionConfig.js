import session from 'express-session'

const sessionConfig = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
})

export default sessionConfig