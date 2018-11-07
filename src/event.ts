import { EventEmitter } from 'events'
import { TweetModel } from './model/response'
import { SlackEvetModel } from './model/slack'
import { ReceivedEventModel } from './model/event'

export default class {
  tweet: TweetModel
  constructor() {}

  receive = (event: SlackEvetModel): ReceivedEventModel | undefined => {
    const { text } = event
    const [target, command, ...options] = text.split(' ')
    if (target === 'aaa') {
      return {
        command,
        options: options.join(''),
      }
    }
  }
}
