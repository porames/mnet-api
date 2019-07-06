import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import Notification from '../models/notification'
import Subscriber from '../models/subscriber'

dotenv.config()

const expo = new Expo()

export default async function notifyService(to, title, body, from) {
  // if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
  const group = await Notification.findOne({ _id: { $eq: to } }) //is group to notify exist?
  if (group === null) {
    console.log('err')
    return false
  } else {
    var messages = []
    const subscribers = await Subscriber.find({ group: { $eq: group._id } }) //get subscribers
    for(var i =0;i<subscribers.length;i++){
      await Subscriber.findOneAndUpdate({ $and: [{ 'user.id': subscribers[i].user.id }, { group: { $eq: group._id } }] }, { $set: { newUpdate: true } })      
      if (Expo.isExpoPushToken(subscribers[i].user.token)) {
        messages.push({
          to: subscribers[i].user.token,
          sound: 'default',
          title: title,
          body: body,
          data: {
            from: from
          }
        })
      }
    }

    let chunks = expo.chunkPushNotifications(messages)

    _.each(chunks, async chunk => {
      console.log('chunk',chunk)
      await expo.sendPushNotificationsAsync(chunk)
    })
  }
}
