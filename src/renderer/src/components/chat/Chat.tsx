import { Box, VStack, Text, Input, Button, HStack } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import Dropzone from 'react-dropzone'

interface Message {
  content: string
  author: string
  messageType: string
}
interface ChatProps {
  conversation: Message[]
  addMessage: (message: string) => void
  addFile: (file: File) => void
  socket: Socket
  name: string
  friend: string
}

function Chat({ conversation, addMessage, addFile, socket, name, friend }: ChatProps) {
  const [message, setMessage] = useState<string>('')

  function sendMessage() {
    socket.emit('message', message, name, friend)

    addMessage(message)
    setMessage('')
  }

  function sendFile(acceptedFiles: File[]) {
    console.log(acceptedFiles[0])

    const fileName = acceptedFiles[0].name

    socket.emit('file', acceptedFiles[0], name, friend, fileName)

    addFile(acceptedFiles[0])

    // remove any files from the dropzone
    acceptedFiles = []
  }

  return (
    <Box height="92vh" width="100%">
      <VStack height="80vh" padding="3">
        {conversation
          ? conversation.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.author === 'me' ? 'flex-end' : 'flex-start'}
                backgroundColor={message.messageType === 'text' ? 'purple.500' : 'green.500'}
                padding={2}
                borderRadius={5}
                color="white"
                {...(message.messageType === 'media'
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
            ))
          : null}
      </VStack>

      <HStack height="12vh" padding="3">
        <Input
          type="text"
          placeholder={`Message ${friend}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Dropzone onDrop={(acceptedFiles) => sendFile(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button colorScheme="purple">+</Button>
              </div>
            </section>
          )}
        </Dropzone>

        <Button colorScheme="purple" onClick={sendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  )
}

export default Chat
