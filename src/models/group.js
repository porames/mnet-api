import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  member: {
    type: Array,
    required: true,
    default: [],
  },
})

GroupSchema.statics.addGroup = async data => {
  return data.save()
}

GroupSchema.statics.getGroupById = id => {
  return Group.findById(id)
}

GroupSchema.statics.addUserToGroup = data => {
  return Group.findByIdAndUpdate(data.group.id, {$push: {member: data.user.id}})
}

const Group = mongoose.model('Group', GroupSchema)

export default Group
