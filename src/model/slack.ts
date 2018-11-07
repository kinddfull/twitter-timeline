export interface SlackEvetModel {
  type: string
  user: string
  text: string
  client_msg_id: string
  team: string
  channel: string
  event_ts: string
  ts: string
  message?: MessageModel
}

interface MessageModel {
  type: string
  user: string
  text: string
  bot_id?: string
  attachments?: []
  ts: string
}
