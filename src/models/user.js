import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  authentication: {
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
  },
  activation: {
    ref: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  profile: {
    fullname: {
      type: String,
      required: true,
    },
    school: {
      generation: {
        type: Number,
        required: true,
        default: 0,
      },
      room: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
})

UserSchema.statics.addUser = async data => {
  data.authentication.pass = await bcrypt.hash(data.authentication.pass, 10)
  return data.save()
}

UserSchema.statics.activateUser = async ref => {
  return User.updateOne(
    {$and: [{'activation.ref': {$eq: ref}}, {'activation.isActivated': {$eq: false}}]},
    {$set: {'activation.isActivated': true}},
  )
}

UserSchema.statics.updateUserProfile = async (id, payload) => {
  return User.findByIdAndUpdate(id, {$set: {profile: payload}})
}

UserSchema.statics.getUserById = async id => {
  return User.findById(id)
}

UserSchema.statics.getNameById = async id => {
  return User.findById(id).select('profile.fullname')
}

UserSchema.statics.getUserByUsername = async user => {
  return User.findOne({'authentication.user': {$eq: user}})
}

UserSchema.statics.comparePassword = async (candidatePassword, hash) => {
  let res = await bcrypt.compare(candidatePassword, hash)
  if (res === true) return true
  else return false
}

UserSchema.static.changePassword = async (id, oldPassword, newPassword) => {
  let user = await User.getUserById(id)

  if ((await User.comparePassword(oldPassword, user.pass)) === true) {
    let newHashedPassword = await bcrypt.hash(newPassword, 10)
    return User.findByIdAndUpdate(id, {$set: {pass: newHashedPassword}})
  } else {
    return false
  }
}

const User = mongoose.model('User', UserSchema)

export default User
