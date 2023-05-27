import { Center, Flex, InputLeftAddon, VStack } from '@chakra-ui/react'
import { Button, Input, InputGroup } from '@chakra-ui/react'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

interface LoginProps {
  login: () => void
  socket: Socket
}
function Login({ login, socket }: LoginProps) {
  const [name, setName] = useState<string>('')

  function join() {
    socket.emit('join', name)
    login()
  }

  return (
    <VStack marginTop={200}>
      <Box>
        <Text>Enter your name</Text>
        <Input
          variant="outline"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button colorScheme="purple" onClick={join}>
          Login
        </Button>
      </Box>
    </VStack>
  )
}

export default Login
