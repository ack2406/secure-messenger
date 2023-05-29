import { HStack, Input, Button } from '@chakra-ui/react'
import React from 'react'
import Dropzone from 'react-dropzone'

interface BottomBarProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  addFileMessage: (acceptedFiles: File[]) => void
  addTextMessage: () => void
  currentConversation: string
}

function BottomBar({
  message,
  setMessage,
  addFileMessage,
  addTextMessage,
  currentConversation
}: BottomBarProps) {
  return (
    <HStack height="12vh" padding="3">
      <Input
        type="text"
        placeholder={`Message ${currentConversation}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Dropzone onDrop={(acceptedFiles) => addFileMessage(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button colorScheme="purple">+</Button>
            </div>
          </section>
        )}
      </Dropzone>

      <Button colorScheme="purple" onClick={addTextMessage}>
        Send
      </Button>
    </HStack>
  )
}

export default BottomBar
