import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { IConversation, IConversations } from '@renderer/types/BasicTypes'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { Socket } from 'socket.io-client'
import NoConversationsSelected from './NoConversationsSelected'
import EmptySession from './EmptySession'
import OpenedConversation from './OpenedConversation'
import InviteDialog from '../dialogs/InviteDialog'

interface ChatProps {
  socket: Socket
  userName: string
  conversations: IConversations
  setConversations: React.Dispatch<React.SetStateAction<IConversations>>
  currentConversation: string
}

function Chat({
  socket,
  userName,
  conversations,
  setConversations,
  currentConversation
}: ChatProps) {
  const [message, setMessage] = useState<string>('')
  const [openAcceptDialog, setOpenAcceptDialog] = useState<boolean>(false)
  const [inviter, setInviter] = useState<string>('')

  function getCurrentConversation() {
    return conversations[currentConversation]
  }

  function acceptInvite() {
    socket.emit('accept', inviter, userName)

    createConversation(inviter)

    setOpenAcceptDialog(false)
    setInviter('')
  }

  useEffect(() => {
    socket.on('invite', (inviter: string) => {
      setOpenAcceptDialog(true)
      setInviter(inviter)
    })

    socket.on('accept', (invitee: string) => {
      console.log(invitee)
      createConversation(invitee)
    })

    socket.on('message', (message: string | ArrayBuffer, sender: string) => {
      const messageType = typeof message == 'string' ? 'text' : 'file'
      console.log(message)
      console.log(conversations)

      if (typeof message == 'string') {
        addMessage(message, 'friend', messageType, sender)
      }
    })

    socket.on('session-create', (sessionKey: string, sender: string) => {
      setConversations((conversations) => ({
        ...conversations,
        [sender]: {
          ...conversations[sender],
          sessionKey
        }
      }))
    })

    socket.on('session-destroy', (sender: string) => {
      setConversations((conversations) => ({
        ...conversations,
        [sender]: {
          ...conversations[sender],
          sessionKey: ''
        }
      }))
    })
  }, [socket, userName])

  function createConversation(newFriend: string) {
    setConversations((conversations) => ({
      ...conversations,
      [newFriend]: {
        sessionKey: '',
        messages: []
      }
    }))
  }

  function addFileMessage(acceptedFiles: File[], author: 'me' | 'friend') {
    const fileName = acceptedFiles[0].name

    addMessage(fileName, author, 'file')
  }

  function addTextMessage(message: string, author: 'me' | 'friend') {
    if (message == '') return

    addMessage(message, author, 'text')
    setMessage('')

    socket.emit('message', message, userName, currentConversation)
  }

  function addMessage(
    message: string,
    author: 'me' | 'friend',
    messageType: 'text' | 'file',
    conversationName: string = currentConversation
  ) {
    setConversations((conversations) => ({
      ...conversations,
      [conversationName]: {
        ...conversations[conversationName],
        messages: [
          ...conversations[conversationName].messages,
          { content: message, author, messageType }
        ]
      }
    }))
  }

  function createSession() {
    const sessionKey = Math.random().toString(36).substring(7)

    setConversations((conversations) => ({
      ...conversations,
      [currentConversation]: {
        sessionKey,
        messages: []
      }
    }))

    socket.emit('session-create', sessionKey, userName, currentConversation)
  }

  function destroySession() {
    setConversations((conversations) => ({
      ...conversations,
      [currentConversation]: {
        sessionKey: '',
        messages: []
      }
    }))

    socket.emit('session-destroy', userName, currentConversation)
  }

  return (
    <>
      <InviteDialog openAcceptDialog={openAcceptDialog} setOpenAcceptDialog={setOpenAcceptDialog} acceptInvite={acceptInvite} inviter={inviter}/>
      {getCurrentConversation() ? (
        getCurrentConversation().sessionKey == '' ? (
          <EmptySession createSession={createSession} />
        ) : (
          <OpenedConversation
            destroySession={destroySession}
            conversations={conversations}
            currentConversation={currentConversation}
            message={message}
            setMessage={setMessage}
            addFileMessage={addFileMessage}
            addTextMessage={addTextMessage}
          />
        )
      ) : (
        <NoConversationsSelected />
      )}
    </>
  )
}

export default Chat
