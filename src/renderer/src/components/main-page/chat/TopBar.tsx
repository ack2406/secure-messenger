import { Button, Box, Text, VStack, HStack, Avatar } from '@chakra-ui/react'

import React from 'react'

interface TopBarProps {
  destroySession: () => void
  currentConversation: string
}

function TopBar({ destroySession, currentConversation }: TopBarProps) {
  return (
    <HStack
      padding={3}
      color="purple.50"
      boxShadow="md"
      height="10vh"
      justifyContent="space-between"
    >
      <HStack>
        <Avatar marginRight={3} name={currentConversation} />
        <Text color="black" fontWeight="bold">
          {currentConversation}
        </Text>
      </HStack>
      <Button colorScheme="red" onClick={destroySession}>
        Destroy Session
      </Button>
    </HStack>
  )
}

export default TopBar
