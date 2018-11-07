import { OauthModel } from './model/oauth'
import { TweetModel } from './model/response'
import request, { RequestAPI } from 'request'
import Event from './event'
import { ClientRequest } from 'http'
export default class {
  track: string[] = []
  _request: any
  stream: any
  constructor(oauth: OauthModel) {
    const {
      CONSUMER_KEY,
      CONSUMER_SECRET,
      ACCESS_TOKEN_KEY,
      ACCESS_TOKEN_SECRET,
    } = oauth
    const oauthOptions = {
      oauth: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        token: ACCESS_TOKEN_KEY,
        token_secret: ACCESS_TOKEN_SECRET,
      },
    }
    const defaultOptions = {
      url: 'https://stream.twitter.com/1.1/statuses/filter.json',
      headers: {
        Accept: '*/*',
        Connection: 'close',
        'User-Agent': 'hio',
      },
      json: true,
    }
    const options = Object.assign(defaultOptions, oauthOptions)
    this._request = request.defaults(options)
  }

  on = async (
    track: string,
    subscribe: (tweet: TweetModel, track: string[]) => void
  ) => {
    this.track = track.split(',')
    this.stream = await this._request({
      qs: { track },
    })
    const { stream } = this
    await stream.on('data', (tweets: string) => {
      try {
        const tweet: TweetModel = JSON.parse(tweets)
        if (!('retweeted_status' in tweet)) {
          subscribe(this.getTweet(tweet), this.track)
        }
      } catch {}
    })
    await stream.on('error', (err: any) => {
      console.log(err)
    })
  }

  add = async (
    track: string,
    subscribe: (tweet: TweetModel, track: string[]) => void
  ) => {
    this.track = this.track.concat(track.split(','))
    if (this.stream) await this.stream.abort()
    await this.on(this.track.join(','), async tweet => {
      subscribe(this.getTweet(tweet), this.track)
    })
  }

  remove = async (
    track: string,
    subscribe: (tweet: TweetModel, track: string[]) => void
  ) => {
    this.track = this.track.filter(t => t !== track)
    if (this.stream) await this.stream.abort()
    await this.on(this.track.join(','), async tweet => {
      await subscribe(tweet, this.track)
    })
  }

  destroy = async () => {
    console.log('end')
    if (this.stream) await this.stream.abort()
  }

  getTrack() {
    return this.track.join(',')
  }

  getTweet(tweet: any): TweetModel {
    const {
      created_at,
      id_str: id,
      text,
      source,
      user: { id: userId, name, screen_name, profile_image_url },
    } = tweet

    return {
      created_at,
      id,
      text,
      source,
      user: { id: userId, name, screen_name, profile_image_url },
    }
  }
}
