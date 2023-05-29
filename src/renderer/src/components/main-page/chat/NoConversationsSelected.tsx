import { Box, Text } from '@chakra-ui/react'

function NoConversationsSelected() {
  return (
    <Box height="92vh" width="100%" display="flex" justifyContent="center" alignItems="center">
      <Text color={'gray'}>No conversations selected</Text>
    </Box>
  )
}

export default NoConversationsSelected
