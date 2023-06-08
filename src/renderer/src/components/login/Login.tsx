import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'


interface LoginProps {
  socket: Socket
  setUserName: React.Dispatch<React.SetStateAction<string>>
}

function Login({ socket, setUserName }: LoginProps) {
  const [newUserName, setNewUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [credentialsCorrect, setCredentialsCorrect] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.on('encryption-key', (_event, isCorrect: boolean) => {
      if (isCorrect) {
        setCredentialsCorrect(true)
      }
      else {
        console.log("wrong password")

      }
    })
  }, [])
  
  useEffect(() => {
    if (credentialsCorrect) {
      setUserName(newUserName)
      socket.emit('login', newUserName)
    }

  }, [credentialsCorrect])


  function login() {
    window.electron.ipcRenderer.send('get-encryption-key', password)

  }



  return (
    <VStack marginTop="20vh">
      <Box backgroundColor="purple.400" padding={10} color="white" borderRadius={5} boxShadow="xl">
        <Text margin={2}>Username</Text>
        <Input
          variant="outline"
          type="text"
          placeholder="Name"
          backgroundColor="white"
          color="purple.800"
          focusBorderColor="purple.800"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />

        <Text margin={2}>Password</Text>
        <Input
          variant="outline"
          type="password"
          placeholder="Password"
          backgroundColor="white"
          color="purple.800"
          focusBorderColor="purple.800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button marginTop={5} colorScheme="purple" onClick={login}>
          Login
        </Button>
      </Box>
    </VStack>
  )
}

export default Login
