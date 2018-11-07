import Slack from './slack'
import Stream from './stream'
import Event from './event'
import { SlackEvetModel } from './model/slack'
import { TweetModel } from './model/response'
require('dotenv').config()
const {
  SLACK_TOKEN,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
} = process.env

const slack = new Slack(SLACK_TOKEN)

const oauth = {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
}

const stream = new Stream(oauth)
const event = new Event()

const start = () => {
  slack.on(async (e: SlackEvetModel) => {
    try {
      const receivedEvent = event.receive(e)
      if (receivedEvent) {
        const { command, options } = receivedEvent
        if (command === '구독') {
          await stream.on(
            options,
            async (tweet: TweetModel, track: string[]) => {
              await slack.sendAttachments(tweet, track, e.channel)
            }
          )
        }
        if (command === '추가') {
          await stream.add(
            options,
            async (tweet: TweetModel, track: string[]) => {
              await slack.sendAttachments(tweet, track, e.channel)
            }
          )
        }

        if (command === '삭제') {
          await stream.remove(
            options,
            async (tweet: TweetModel, track: string[]) => {
              await slack.sendAttachments(tweet, track, e.channel)
            }
          )
        }

        if (command === '종료') {
          await stream.destroy()
          await slack.sendMessage('end', e.channel)
        }

        if (command === '보가') {
          await slack.sendMessage(stream.getTrack(), e.channel)
        }
      }
    } catch {
      start()
    }
  })
}

start()
