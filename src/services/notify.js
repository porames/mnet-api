import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import Notification from '../models/notification'
import Subscriber from '../models/subscriber'

dotenv.config()

const expo = new Expo()

export default async function notifyService(to, title, body, from) {
  // if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
  const group = await Notification.findOne({_id: {$eq: to}})
  if (group === null) {
    return false
  } else {
    const messages = []
    const subscribers = await Subscriber.find({group: {$eq: group._id}})
    console.log(subscribers)
    subscribers.map(subscriber => {
      if (Expo.isExpoPushToken(subscriber.user.token)) {
        messages.push({
          to: subscriber.user.token,
          sound: 'default',
          title: title,
          body: body,
          data:{
            from: from
          }
        })
      }
    })

    let chunks = expo.chunkPushNotifications(messages)

    _.each(chunks, async chunk => {
      console.log(chunk)
      await expo.sendPushNotificationsAsync(chunk)
    })
  }
}
