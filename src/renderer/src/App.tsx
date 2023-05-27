import Aside from './components/aside/Aside'
import { useSocket } from './hooks/useSocket'
import { useEffect, useState } from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'
import Header from './components/header/Header'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import { Socket } from 'socket.io-client'

function App(): JSX.Element {
  const { socket, connected, conversations, setConversations, name } = useSocket()
  const [selectedFriend, setSelectedFriend] = useState<string>('')
  const [isLogged, setIsLogged] = useState<boolean>(false)

  function getFriends() {
    return Object.keys(conversations)
  }

  function setCurrentFriend(friend: string) {
    console.log('set current friend to ' + friend)
    setSelectedFriend(friend)
  }

  function getSelectedConversation() {
    return conversations[selectedFriend]
  }

  function addMessageToConversation(message: string) {
    setConversations((conversations) => ({
      ...conversations,
      [selectedFriend]: [
        ...conversations[selectedFriend],
        { content: message, author: 'me', messageType: 'text' }
      ]
    }))
  }

  function addFileToConversation(file: File) {
    setConversations((conversations) => ({
      ...conversations,
      [selectedFriend]: [
        ...conversations[selectedFriend],
        { content: file.name, author: 'me', messageType: 'media' }
      ]
    }))
  }

  function login() {
    setIsLogged(true)
  }

  if (!socket) return <div className="container">Loading...</div>

  socket.connect()

  return (
    <Box>
      {isLogged ? (
        <>
          <Header name={name} />

          <HStack>
            <Aside
              socket={socket}
              name={name}
              friends={getFriends()}
              setCurrentFriend={setCurrentFriend}
              currentFriend={selectedFriend}
            />
            <Chat
              conversation={getSelectedConversation()}
              addMessage={addMessageToConversation}
              addFile={addFileToConversation}
              socket={socket}
              name={name}
              friend={selectedFriend}
            />
          </HStack>
        </>
      ) : (
        <Login login={login} socket={socket} />
      )}
    </Box>
  )
}

export default App
