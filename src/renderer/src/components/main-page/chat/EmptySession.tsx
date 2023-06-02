import React from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'

interface EmptySessionProps {
  createSession: () => void
}

function EmptySession({ createSession }: EmptySessionProps): JSX.Element {
  return (
    <Box height="92vh" width="100%" display="flex" justifyContent="center" alignItems="center">
      <VStack>
        <Button colorScheme="gray" onClick={createSession}>
          Create Session Key
        </Button>
      </VStack>
    </Box>
  )
}

export default EmptySession
