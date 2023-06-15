import { Center, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useSocket } from './hooks/useSocket'

import Login from './components/login/Login'
import MainPage from './components/main-page/MainPage'

function App(): JSX.Element {
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const socket = useSocket('http://localhost:3000')

  if (!socket) {
    return (
      <Center height="100vh">
        <Text>Loading...</Text>
      </Center>
    )
  }

  if (!userName) {
    return (
      <Login
        socket={socket}
        setUserName={setUserName}
        password={password}
        setPassword={setPassword}
      />
    )
  }

  return <MainPage socket={socket} userName={userName} password={password} />
}

export default App
