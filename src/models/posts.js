import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  message: {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  groupId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
})

const Post = mongoose.model('Post', PostSchema)

export default Post
