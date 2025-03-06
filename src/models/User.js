import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  imageUrl: String,
  balance: Number
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User