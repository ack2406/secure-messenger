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
  const [AESMode, setAESMode] = useState<string>('ECB')
  const [progress, setProgress] = useState<string>('')

  function getCurrentConversation() {
    return conversations[currentConversation]
  }

  async function acceptInvite() {
    const keys = generateKeys()

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
      createConversation(invitee)

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
      const localkey = CryptoJS.SHA1(password).toString()

      pubkey = encryptAES(pubkey, localkey)

      window.electron.ipcRenderer.send('save-pubkey', pubkey, 'friend_' + inviter)
    })

    socket.on('message', (message: string, sender: string) => {
      message = decryptAES(message, conversations[sender].sessionKey)

      if (typeof message == 'string') {
        addMessage(message, 'friend', 'text', sender)
      }
    })

    socket.on('progress-bar', () => {
      setProgress('')
    })

    socket.on('file-message', (file: string, fileName: string, sender: string) => {
      const enc = new TextEncoder()

      const encrypted = decryptAES(file, conversations[sender].sessionKey)

      const encoded = enc.encode(encrypted)

      const encryptedFileName = decryptAES(fileName, conversations[sender].sessionKey)

      window.electron.ipcRenderer.send('save-file', encoded, encryptedFileName)

      addMessage(encryptedFileName, 'friend', 'file', sender)
    })

    socket.on('session-create', (sessionKey: string, sender: string) => {
      const encrypt = loadPrivateKey(sender, password)

      sessionKey = encrypt.decrypt(sessionKey).toString()

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
      socket.off('progress-bar')
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
    setProgress('Sending file...')

    const fileName = acceptedFiles[0].name
    const file = acceptedFiles[0]

    addMessage(fileName, author, 'file')

    const sessionKey = getCurrentConversation().sessionKey

    const encrypted = encryptAES(fileName, sessionKey, AESMode)

    file.arrayBuffer().then((buffer) => {
      const dec = new TextDecoder('utf-8')

      const encryptedFile = encryptAES(dec.decode(buffer), sessionKey, AESMode)
      socket.emit('file-message', encryptedFile, encrypted, userName, currentConversation)
    })
  }

  function addTextMessage(message: string, author: 'me' | 'friend') {
    if (message == '') return

    addMessage(message, author, 'text')

    const sessionKey = getCurrentConversation().sessionKey

    const encrypted = encryptAES(message, sessionKey, AESMode)

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

    const encrypt = loadPublicKey('friend_' + currentConversation, password)

    const encryptedSessionKey = encrypt.encrypt(sessionKey)

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
            AESMode={AESMode}
            setAESMode={setAESMode}
            progress={progress}
          />
        )
      ) : (
        <NoConversationsSelected />
      )}
    </>
  )
}

export default Chat
