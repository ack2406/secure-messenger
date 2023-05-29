export interface IMessage {
  content: string
  author: string
  messageType: string
}

export interface IConversation {
  sessionKey: string
  messages: IMessage[]
}

export interface IConversations {
  [friend: string]: IConversation
}
