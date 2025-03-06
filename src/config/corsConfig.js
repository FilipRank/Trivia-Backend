import cors from 'cors'

const corsConfig = cors({
  origin: "http://localhost:5173",
  credentials: true
})

export default corsConfig