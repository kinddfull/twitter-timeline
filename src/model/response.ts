export interface TweetModel {
  created_at: string
  id: number
  text: string
  source?: string
  user: {
    id: number
    name: string
    screen_name: string
    profile_image_url: string
  }
}
