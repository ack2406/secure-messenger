import { Avatar, HStack, Text } from '@chakra-ui/react'

interface HeaderProps {
  userName: string
}

function Header({ userName }: HeaderProps) {
  return (
    <HStack padding="2" backgroundColor="purple.500" color="purple.50" boxShadow="md" height="8vh">
      <Avatar size="sm" name={userName} />
      <Text>{userName}</Text>
    </HStack>
  )
}

export default Header
