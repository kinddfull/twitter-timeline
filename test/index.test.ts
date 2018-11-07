import { TweetModel } from '../src/model/response'
import request from 'request'
require('dotenv').config()

describe('test request', () => {
  test(
    'b',
    () => {
      const {
        CONSUMER_KEY,
        CONSUMER_SECRET,
        ACCESS_TOKEN_KEY,
        ACCESS_TOKEN_SECRET,
      } = process.env
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
      const _request = request.defaults(options)
      const result = _request({
        url: defaultOptions.url,
        qs: { track: 'hi' },
      })
      result.on('data', (tweets: string) => {
        try {
          const tweet: TweetModel = JSON.parse(tweets)
          if ('retweeted_status') {
            const {
              created_at,
              id,
              text,
              source,
              user: { id: userId, name, screen_name, profile_image_url },
            } = tweet
            console.log(
              created_at,
              id,
              text,
              source,
              userId,
              name,
              screen_name,
              profile_image_url
            )
          }
        } catch {}
      })
      result.on('error', (err: any) => {
        console.log(err)
      })
    },
    500000
  )
})
