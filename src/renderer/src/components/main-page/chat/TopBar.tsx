import { Button, Box, Text } from '@chakra-ui/react'

import React from 'react'

interface TopBarProps {
  destroySession: () => void
  currentConversation: string
}

function TopBar({ destroySession, currentConversation }: TopBarProps) {
  return (
    <Box padding={3} color="purple.50" boxShadow="lg" height="8vh">
      <Button colorScheme="purple" onClick={destroySession}>
        Delete Sesjaoux
      </Button>
      <Text>{currentConversation}</Text>
    </Box>
  )
}

export default TopBar
