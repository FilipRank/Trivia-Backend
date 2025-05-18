import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const corsConfig = cors({
  origin: process.env.BACKEND_URL,
  credentials: true,
});

export default corsConfig