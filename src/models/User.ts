import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, index: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  bio: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);

export default User;
