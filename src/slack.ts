import { RTMClient, WebClient } from '@slack/client'
import { SlackEvetModel } from './model/slack'
import { TweetModel } from './model/response'

export default class {
  web: WebClient
  rtm: RTMClient

  constructor(token?: string) {
    this.web = new WebClient(token)
    this.rtm = new RTMClient(token as string)
  }

  on = async (subscribe: (event: SlackEvetModel) => void) => {
    this.rtm.start()
    await this.rtm.on('message', (event: SlackEvetModel) => {
      if (!('message' in event)) {
        subscribe(event)
      }
    })
  }

  sendAttachments = async (
    tweet: TweetModel,
    track: string[],
    channelId: string
  ) => {
    const {
      created_at,
      id,
      text,
      source,
      user: { id: userId, name, screen_name, profile_image_url },
    } = tweet
    const textmatch = track.filter(t => text.match(t))
    if (textmatch.length) {
      await this.web.chat.postMessage({
        channel: channelId,
        text: '',
        attachments: [
          {
            color: 'good',
            author_name: `${name}@${screen_name}`,
            author_link: `https://twitter.com/${screen_name}`,
            author_icon: profile_image_url,
            title: text,
            title_link: `https://twitter.com/statuses/${id}`,
            fields: [
              {
                title: '키워드',
                value: textmatch.join(','),
                short: false,
              },
            ],
            mrkdwn_in: ['text', 'pretext'],
            footer: created_at,
          },
        ],
      })
    }
  }

  sendMessage = async (text: string, channelId: string) => {
    await this.rtm.sendMessage(text, channelId)
  }
}
