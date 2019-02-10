import moment from 'moment'
import mongoose from 'mongoose'

const AnnounceSchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
    default: moment().toISOString(),
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
  from: {
    type: Array,
    required: true,
  },
  to: {
    type: Array,
    required: true,
    default: [],
  },
})

AnnounceSchema.statics.addAnnounce = (data, callback) => {
  data.save(callback)
}

AnnounceSchema.statics.getAnnounceById = (id, callback) => {
  Announce.findById(id, callback)
}

const Announce = mongoose.model('Announce', AnnounceSchema)

export default Announce
