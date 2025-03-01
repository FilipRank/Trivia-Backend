import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: String,
  value: String,
  price: Number,
  description: String,
  imageUri: String
})

const Badge = mongoose.model('Badge', badgeSchema)

export default Badge