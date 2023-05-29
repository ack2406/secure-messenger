import React from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'

interface EmptySessionProps {
  createSession: () => void
}

function EmptySession({ createSession }: EmptySessionProps): JSX.Element {
  return (
    <Box height="92vh" width="100%" display="flex" justifyContent="center" alignItems="center">
      <VStack>
        <Text color={'gray'}>Create Session Key</Text>
        <Button colorScheme="purple" onClick={createSession}>
          Create
        </Button>
      </VStack>
    </Box>
  )
}

export default EmptySession
