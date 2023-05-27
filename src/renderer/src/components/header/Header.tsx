import { Socket } from 'socket.io-client'
import { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'

interface HeaderProps {
  name: string
}

function Header({ name }: HeaderProps) {
  return (
    <Box padding={3} backgroundColor="purple.600" color="purple.50" boxShadow="lg" height="8vh">
      <Text>Hello {name}!</Text>
    </Box>
  )
}

export default Header
