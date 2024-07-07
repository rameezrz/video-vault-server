import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
