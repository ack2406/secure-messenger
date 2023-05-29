import { Avatar, Box, Button, Divider, HStack, Input, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { IConversations } from '@renderer/types/BasicTypes'
import { useState } from 'react'
import { Socket } from 'socket.io-client'

interface AsideProps {
  socket: Socket
  userName: string
  conversations: IConversations
  currentConversation: string
  setCurrentConversation: React.Dispatch<React.SetStateAction<string>>
}

function Aside({
  socket,
  userName,
  conversations,
  currentConversation,
  setCurrentConversation
}: AsideProps) {
  const [newFriendName, setNewFriendName] = useState<string>('')

  function getFriendsNames() {
    return Object.keys(conversations)
  }

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
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          focusBorderColor="purple.600"
        />
        <Button
          colorScheme="purple"
          onClick={() => {
            socket.emit('invite', userName, newFriendName)
          }}
        >
          Add
        </Button>
      </HStack>

      <Divider marginTop={3} marginBottom={3} />

      <Wrap direction="column">
        {getFriendsNames().map((friend) => (
          <WrapItem
            key={friend}
            onClick={() => setCurrentConversation(friend)}
            alignItems="center"
            cursor="pointer"
            backgroundColor={friend === currentConversation ? 'purple.600' : 'purple.400'}
            _hover={{
              backgroundColor: friend === currentConversation ? 'purple.600' : 'purple.500'
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
