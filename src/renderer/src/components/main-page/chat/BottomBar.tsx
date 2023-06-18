import { HStack, Input, Button } from '@chakra-ui/react'
import React from 'react'
import Dropzone from 'react-dropzone'

interface BottomBarProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  addFileMessage: (acceptedFiles: File[], author: 'me' | 'friend') => void
  addTextMessage: (message: string, author: 'me' | 'friend') => void
  currentConversation: string
  AESMode: string
  setAESMode: React.Dispatch<React.SetStateAction<string>>
}

function BottomBar({
  message,
  setMessage,
  addFileMessage,
  addTextMessage,
  currentConversation,
  AESMode,
  setAESMode
}: BottomBarProps) {
  function changeAESMode() {
    if (AESMode === 'CBC') {
      setAESMode('ECB')
    } else {
      setAESMode('CBC')
    }
  }

  return (
    <HStack height="12vh" padding="3">
      <Button colorScheme="purple" onClick={() => changeAESMode()}>
        {AESMode}
      </Button>
      <Input
        type="text"
        placeholder={`Message ${currentConversation}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Dropzone onDrop={(acceptedFiles) => addFileMessage(acceptedFiles, 'me')}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button colorScheme="purple">+</Button>
            </div>
          </section>
        )}
      </Dropzone>

      <Button colorScheme="purple" onClick={() => addTextMessage(message, 'me')}>
        Send
      </Button>
    </HStack>
  )
}

export default BottomBar
