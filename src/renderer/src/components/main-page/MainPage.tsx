import { Box, HStack } from '@chakra-ui/react'
import { IConversations } from '@renderer/types/BasicTypes'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import Aside from './aside/Aside'
import Chat from './chat/Chat'
import Header from './header/Header'

interface MainPageProps {
  socket: Socket
  userName: string
  password: string
}

function MainPage({ socket, userName, password }: MainPageProps): JSX.Element {
  const [conversations, setConversations] = useState<IConversations>({})
  const [currentConversation, setCurrentConversation] = useState<string>('')

  return (
    <Box>
      <Header userName={userName} />
      <HStack>
        <Aside
          socket={socket}
          userName={userName}
          conversations={conversations}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
        />
        <Chat
          socket={socket}
          userName={userName}
          password={password}
          conversations={conversations}
          setConversations={setConversations}
          currentConversation={currentConversation}
        />
      </HStack>
    </Box>
  )
}

export default MainPage
