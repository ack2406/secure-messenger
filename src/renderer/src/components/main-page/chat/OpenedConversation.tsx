import React from 'react'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import { IConversations } from '@renderer/types/BasicTypes'
import BottomBar from './BottomBar'
import TopBar from './TopBar'

interface OpenedConversationProps {
  destroySession: () => void
  conversations: IConversations
  currentConversation: string
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  addFileMessage: (acceptedFiles: File[], author: 'me' | 'friend') => void
  addTextMessage: (message: string, author: 'me' | 'friend') => void
}

function OpenedConversation({
  destroySession,
  conversations,
  currentConversation,
  message,
  setMessage,
  addFileMessage,
  addTextMessage
}: OpenedConversationProps) {
  function getCurrentConversation() {
    return conversations[currentConversation]
  }
  return (
    <Box height="92vh" width="100%">
      <TopBar destroySession={destroySession} currentConversation={currentConversation} />
      <VStack height="70vh" padding="3">
        {getCurrentConversation().messages.map((message, index) => (
          <Box
            key={index}
            alignSelf={message.author === 'me' ? 'flex-end' : 'flex-start'}
            backgroundColor={message.messageType === 'text' ? 'purple.500' : 'green.500'}
            padding={2}
            borderRadius={5}
            color="white"
            {...(message.messageType === 'file'
              ? {
                  cursor: 'pointer',
                  onClick: () => {
                    window.electron.ipcRenderer.send('open-file', message.content)
                  }
                }
              : null)}
          >
            <Text>{message.content}</Text>
          </Box>
        ))}
      </VStack>

      <BottomBar
        message={message}
        setMessage={setMessage}
        addFileMessage={addFileMessage}
        addTextMessage={addTextMessage}
        currentConversation={currentConversation}
      />
    </Box>
  )
}

export default OpenedConversation
