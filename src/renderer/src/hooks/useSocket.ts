import { useEffect, useState } from 'react'

import { Socket, io } from 'socket.io-client'

export function useSocket(server_url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(server_url)

    setSocket(newSocket)

    // socket.on('invite', (inviter: string, invitee: string) => {
    //   console.log(`${inviter} wants to chat with you, mr ${invitee}`)
    //   console.log('opening dialog')
    //   // socket.emit('accept', inviter, invitee)
    // })

    // socket.on('accept', (inviter: string, invitee: string) => {
    //   console.log(`${invitee} accepted your invitation`)

    //   createConversation(invitee)

    //   socket.emit('sendDetails', inviter, invitee)
    // })

    // socket.on('decline', (invitee: string) => {
    //   console.log(`${invitee} declined your invitation`)
    // })

    // socket.on('sendDetails', (inviter: string) => {
    //   console.log(`${inviter} sent you his details`)

    //   createConversation(inviter)
    // })

    // socket.on('getMessage', (message: string, sender: string) => {
    //   console.log(`message from ${sender}: ${message}`)

    //   setConversations((conversations) => ({
    //     ...conversations,
    //     [sender]: {
    //       ...conversations[sender],
    //       messages: [
    //         ...conversations[sender].messages,
    //         { content: message, author: sender, messageType: 'text' }
    //       ]
    //     }
    //   }))
    // })

    // socket.on('getFile', (file: File, sender: string, fileName: string) => {
    //   console.log(`file from ${sender}: ${file}`)

    //   window.electron.ipcRenderer.send('save-file', file, fileName)

    //   setConversations((conversations) => ({
    //     ...conversations,
    //     [sender]: {
    //       ...conversations[sender],
    //       messages: [
    //         ...conversations[sender].messages,
    //         { content: fileName, author: sender, messageType: 'media' }
    //       ]
    //     }
    //   }))
    // })

    // socket.on('createSession', (sessionKey: string, friend: string) => {
    //   console.log('created session for ' + friend + ' with key ' + sessionKey)
    //   setConversations((conversations) => ({
    //     ...conversations,
    //     [friend]: {
    //       sessionKey,
    //       messages: []
    //     }
    //   }))
    // })

    // // set session key to empty string
    // socket.on('deleteSession', (friend: string) => {
    //   setConversations((conversations) => ({
    //     ...conversations,
    //     [friend]: {
    //       sessionKey: '',
    //       messages: []
    //     }
    //   }))
    // })

    return () => {
      if (socket) {
        socket.removeAllListeners()
      }
    }
  }, [])

  // function createConversation(friend: string) {
  //   setConversations((conversations) => ({
  //     ...conversations,
  //     [friend]: {
  //       sessionKey: '',
  //       messages: []
  //     }
  //   }))
  // }

  return socket
}
