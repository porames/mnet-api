import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  pass: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'normal',
  },
  activation: {
    ref: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
  },
})

UserSchema.statics.addUser = (data, callback) => {
  bcrypt.hash(data.pass, 10, (err, res) => {
    if (err) {
      callback(err)
    }
    data.pass = res
    data.save(callback)
  })
}

UserSchema.statics.activateUser = (ref, callback) => {
  User.update({activation: {ref: ref}}, {$set: {activation: {isActivated: true}}}, callback)
}

UserSchema.statics.getUserById = (id, callback) => {
  User.findById(id, callback)
}

UserSchema.statics.getUserByUsername = (user, callback) => {
  User.findOne({user: user}, callback)
}

UserSchema.statics.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, res) => {
    if (res === true) {
      callback(null, res)
    } else {
      callback(err)
    }
  })
}

const User = mongoose.model('User', UserSchema)

export default User
