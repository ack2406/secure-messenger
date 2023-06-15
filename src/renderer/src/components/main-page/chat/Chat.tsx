import { IConversations } from '@renderer/types/BasicTypes'
import {
  generateKeys,
  loadPrivateKey,
  loadPublicKey,
  saveKeysToFile,
  generateSessionKey,
  encryptAES,
  decryptAES
} from '@renderer/utils/RSAKeys'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import InviteDialog from '../dialogs/InviteDialog'
import EmptySession from './EmptySession'
import NoConversationsSelected from './NoConversationsSelected'
import OpenedConversation from './OpenedConversation'
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

interface ChatProps {
  socket: Socket
  userName: string
  conversations: IConversations
  setConversations: React.Dispatch<React.SetStateAction<IConversations>>
  currentConversation: string
  password: string
}

function Chat({
  socket,
  userName,
  conversations,
  setConversations,
  currentConversation,
  password
}: ChatProps) {
  const [message, setMessage] = useState<string>('')
  const [openAcceptDialog, setOpenAcceptDialog] = useState<boolean>(false)
  const [inviter, setInviter] = useState<string>('')

  function getCurrentConversation() {
    return conversations[currentConversation]
  }

  async function acceptInvite() {
    const keys = generateKeys()

    console.log(keys.publicKey)
    console.log(keys.privateKey)

    const localkey = CryptoJS.SHA1(password).toString()

    saveKeysToFile(
      encryptAES(keys.publicKey, localkey).toString(),
      encryptAES(keys.privateKey, localkey).toString(),
      inviter
    )

    socket.emit('accept', inviter, userName, keys.publicKey)

    createConversation(inviter)

    setOpenAcceptDialog(false)
    setInviter('')
  }

  useEffect(() => {
    socket.on('invite', (inviter: string) => {
      setOpenAcceptDialog(true)
      setInviter(inviter)
    })

    socket.on('accept', async (invitee: string, pubkey: string) => {
      console.log(invitee)
      createConversation(invitee)

      console.log('got key from invitee')

      console.log('PASSWORD: ' + password)

      const localkey = CryptoJS.SHA1(password).toString()

      pubkey = encryptAES(pubkey, localkey)

      window.electron.ipcRenderer.send('save-pubkey', pubkey, 'friend_' + invitee)

      const keys = generateKeys()

      saveKeysToFile(
        encryptAES(keys.publicKey, localkey).toString(),
        encryptAES(keys.privateKey, localkey).toString(),
        invitee
      )

      socket.emit('accept-response', userName, invitee, keys.publicKey)
    })

    socket.on('accept-response', (inviter: string, pubkey: string) => {
      console.log('got key from inviter')

      console.log('PASSWORD: ' + password)

      const localkey = CryptoJS.SHA1(password).toString()

      pubkey = encryptAES(pubkey, localkey)

      window.electron.ipcRenderer.send('save-pubkey', pubkey, 'friend_' + inviter)
    })

    socket.on('message', (message: string, sender: string) => {
      console.log(conversations)
      message = decryptAES(message, conversations[sender].sessionKey)
      console.log(conversations[sender].sessionKey)

      console.log('message: ' + message)
      console.log(message)
      console.log(conversations)

      if (typeof message == 'string') {
        addMessage(message, 'friend', 'text', sender)
      }
    })

    socket.on('file-message', (file: string, fileName: string, sender: string) => {
      console.log('file: ' + fileName)

      const encrypted = CryptoJS.AES.decrypt(file, conversations[sender].sessionKey).toString(
        CryptoJS.enc.Utf8
      )

      const encryptedFileName = decryptAES(fileName, conversations[sender].sessionKey)

      window.electron.ipcRenderer.send('save-file', encrypted, encryptedFileName)

      addMessage(fileName, 'friend', 'file', sender)
    })

    socket.on('session-create', (sessionKey: string, sender: string) => {
      console.log('session-create')

      const encrypt = loadPrivateKey(sender, password)
      console.log('ODBIORCA: ' + sessionKey)

      console.log(encrypt)

      sessionKey = encrypt.decrypt(sessionKey).toString()
      console.log('no to jest to co nie? ODBIORCA: ' + sessionKey)

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

    return () => {
      socket.off('invite')
      socket.off('accept')
      socket.off('accept-response')
      socket.off('message')
      socket.off('file-message')
      socket.off('session-create')
      socket.off('session-destroy')
    }
  }, [socket, userName, conversations])

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
    const file = acceptedFiles[0]

    console.log('file')
    addMessage(fileName, author, 'file')

    const sessionKey = getCurrentConversation().sessionKey

    const encrypted = encryptAES(fileName, sessionKey, 'ECB')

    // change file to base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const file = reader.result

      socket.emit('file-message', file, encrypted, userName, currentConversation)
    }
  }

  function addTextMessage(message: string, author: 'me' | 'friend') {
    if (message == '') return

    addMessage(message, author, 'text')

    console.log(conversations)

    const sessionKey = getCurrentConversation().sessionKey

    const encrypted = encryptAES(message, sessionKey, 'ECB')

    setMessage('')

    socket.emit('message', encrypted, userName, currentConversation)
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
    const sessionKey = generateSessionKey()

    console.log(sessionKey)

    const encrypt = loadPublicKey('friend_' + currentConversation, password)
    console.log('NADAWCA: ' + sessionKey)

    const encryptedSessionKey = encrypt.encrypt(sessionKey)
    console.log('NADAWCA: ' + encryptedSessionKey)

    setConversations((conversations) => ({
      ...conversations,
      [currentConversation]: {
        sessionKey,
        messages: []
      }
    }))

    socket.emit('session-create', encryptedSessionKey, userName, currentConversation)
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
      <InviteDialog
        openAcceptDialog={openAcceptDialog}
        setOpenAcceptDialog={setOpenAcceptDialog}
        acceptInvite={acceptInvite}
        inviter={inviter}
      />
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
