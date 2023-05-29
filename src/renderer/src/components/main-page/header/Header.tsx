import { Socket } from 'socket.io-client'
import { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'

interface HeaderProps {
  userName: string
}

function Header({ userName }: HeaderProps) {
  return (
    <Box padding={3} backgroundColor="purple.600" color="purple.50" boxShadow="lg" height="8vh">
      <Text>Hello {userName}!</Text>
    </Box>
  )
}

export default Header
