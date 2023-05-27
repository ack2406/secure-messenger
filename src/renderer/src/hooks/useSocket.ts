import { Socket, io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { socket } from '../socket'
import { writeFile } from 'fs'

interface Message {
  content: string
  author: string
  messageType: string
}

export function useSocket() {
  const [connected, setConnected] = useState<boolean>(false)
  const [conversations, setConversations] = useState<{ [friend: string]: Message[] }>({})
  const [name, setName] = useState<string>('')

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('join', (newName: string) => {
      setName(newName)
    })

    socket.on('unavailable', () => {
      console.log(`user is unavailable`)
    })

    socket.on('invite', (inviter: string, invitee: string) => {
      console.log(`${inviter} wants to chat with you, mr ${invitee}`)
      socket.emit('accept', inviter, invitee)
    })

    socket.on('accept', (inviter: string, invitee: string) => {
      console.log(`${invitee} accepted your invitation`)

      createConversation(invitee)

      socket.emit('sendDetails', inviter, invitee)
    })

    socket.on('decline', (invitee: string) => {
      console.log(`${invitee} declined your invitation`)
    })

    socket.on('sendDetails', (inviter: string) => {
      console.log(`${inviter} sent you his details`)

      createConversation(inviter)
    })

    socket.on('getMessage', (message: string, sender: string) => {
      console.log(`message from ${sender}: ${message}`)

      setConversations((conversations) => ({
        ...conversations,
        [sender]: [
          ...conversations[sender],
          { content: message, author: 'friend', messageType: 'text' }
        ]
      }))
    })

    socket.on('getFile', (file: File, sender: string, fileName: string) => {
      console.log(`file from ${sender}: ${file}`)

      window.electron.ipcRenderer.send('save-file', file, fileName)

      setConversations((conversations) => ({
        ...conversations,
        [sender]: [
          ...conversations[sender],
          { content: fileName, author: 'friend', messageType: 'media' }
        ]
      }))
    })

    return () => {
      socket.off('connect')
      socket.off('join')
      socket.off('unavailable')
      socket.off('invite')
      socket.off('accept')
      socket.off('decline')
      socket.off('sendDetails')
      socket.off('getMessage')
      socket.off('getFile')
    }
  }, [])

  useEffect(() => {
    console.log(conversations)
  }, [conversations])

  function createConversation(friend: string) {
    setConversations((conversations) => ({
      ...conversations,
      [friend]: []
    }))
  }

  return { socket, connected, conversations, setConversations, name }
}
