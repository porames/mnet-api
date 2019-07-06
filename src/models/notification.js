import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  groupRef: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    trime: true
  },
  avatar: {
    type: String,
    required: true,
    trim: true,
    default: '001'
  }
})

NotificationSchema.statics.addGroup = function(data) {
  data.groupRef = Math.random()
    .toString(36)
    .substr(2, 8)
  const payload = new Notification(data)
  return payload.save()
}

NotificationSchema.statics.getNotificationGroupById = async id => {
  return Notification.findById(id)
}

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
