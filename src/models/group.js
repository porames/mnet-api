import mongoose from 'mongoose'
import _ from 'lodash'

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
  groupRef: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
})

GroupSchema.statics.addGroup = async data => {
  const refCode = Math.random()
    .toString(36)
    .substr(2, 8)
  data.groupRef = refCode
  const payload = new Group(data)
  return payload.save()
}

GroupSchema.statics.listUserGroups = async id => {
  const results = await Group.find({
    member: {
      $eq: id,
    },
  }).select('name owner groupRef')
  return results
}

GroupSchema.statics.getGroupByRef = async groupRef => {
  const group = await Group.findOne({groupRef: {$eq: groupRef}}).select('_id')
  return group._id
}

GroupSchema.statics.addUserToGroup = async (groupRef, userId) => {
  const groupId = await Group.getGroupByRef(groupRef)

  const dups = await Group.find({
    _id: groupId,
    member: {
      $eq: userId,
    },
  })

  if (!_.isEmpty(dups)) {
    throw TypeError('already in the group')
  } else {
    return Group.findByIdAndUpdate(groupId, {$push: {member: userId}})
  }
}

const Group = mongoose.model('Group', GroupSchema)

export default Group
