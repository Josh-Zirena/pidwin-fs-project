import mongoose, { Schema } from "mongoose";
import { UserDocument } from "../types/index.js";

interface UserModel extends UserDocument {}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  balance: { type: Number, default: 0, required: true },
  winStreak: { type: Number, default: 0, required: true },
});

// Note: I would check if this is the correct way to do this
// we index this field because we will be using it to sort the leaderboard
userSchema.index({ winStreak: -1 });

export default mongoose.model<UserModel>("User", userSchema);
