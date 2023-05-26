import { Socket, io } from 'socket.io-client'
import { useEffect, useState } from 'react'

interface Message {
  content: string
  author: string
}

interface Conversation {
  user: string
  messages: Message[]
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [users, setUsers] = useState<string[]>([])

  useEffect(() => {
    const socket = io('http://localhost:3000')
    setSocket(socket)

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('status', (data: string) => {
      console.log(data)
      setConnected(true)
    })

    socket.on('message', (data: string, user: string, isOwnMessage: boolean) => {
      console.log(data)
      if (isOwnMessage) {
        setConversations((conversations) => {
          const newConversations = [...conversations]
          const conversation = newConversations.filter(
            (conversation) => conversation.user === user
          )[0]
          conversation.messages.push({ content: data, author: 'me' })
          return newConversations
        })
      } else {
        setConversations((conversations) => {
          const newConversations = [...conversations]
          const conversation = newConversations.filter(
            (conversation) => conversation.user === user
          )[0]

          conversation.messages.push({ content: data, author: user })
          return newConversations
        })
      }
    })

    socket.on('users', (data: string[]) => {
      console.log(data)
      setUsers(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { socket, connected, conversations, users }
}
