import { Socket } from 'socket.io-client'
import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  HStack,
  VStack,
  Wrap,
  WrapItem,
  Avatar,
  Divider
} from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

interface AsideProps {
  socket: Socket
  name: string
  friends: string[]
  setCurrentFriend: (friend: string) => void
  currentFriend: string
}

function Aside({ socket, name, friends, setCurrentFriend, currentFriend }: AsideProps) {
  const [newFriend, setNewFriend] = useState<string>('')

  return (
    <Box backgroundColor="purple.400" padding={3} minWidth="15em" color="purple.50" height="92vh">
      <HStack>
        <Input
          variant="outline"
          backgroundColor={'purple.50'}
          colorScheme="purple"
          color="purple.600"
          type="text"
          placeholder="Friend"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          focusBorderColor="purple.600"
        />
        <Button
          colorScheme="purple"
          onClick={() => {
            socket.emit('invite', name, newFriend)
          }}
        >
          Add
        </Button>
      </HStack>

      <Divider marginTop={3} marginBottom={3} />

      <Wrap direction="column">
        {friends.map((friend) => (
          <WrapItem
            key={friend}
            onClick={() => setCurrentFriend(friend)}
            alignItems="center"
            cursor="pointer"
            backgroundColor={friend === currentFriend ? 'purple.600' : 'purple.400'}
            // hover
            _hover={{
              backgroundColor: friend === currentFriend ? 'purple.600' : 'purple.500'
            }}
            padding={2}
            borderRadius={6}
          >
            <Avatar name={friend} />
            <Text marginLeft={3}>{friend}</Text>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
}

export default Aside
