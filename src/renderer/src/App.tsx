import { Center, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useSocket } from './hooks/useSocket'

import Login from './components/login/Login'
import MainPage from './components/main-page/MainPage'

function App(): JSX.Element {
  const [userName, setUserName] = useState<string>('')
  const socket = useSocket('http://localhost:3000')

  if (!socket) {
    return (
      <Center height="100vh">
        <Text>Loading...</Text>
      </Center>
    )
  }

  if (!userName) {
    return <Login socket={socket} setUserName={setUserName} />
  }

  return <MainPage socket={socket} userName={userName} />
}

export default App
