import { useEffect, useState } from 'react'

import { Socket, io } from 'socket.io-client'

export function useSocket(server_url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(server_url)

    setSocket(newSocket)

    return () => {
      if (socket) {
        socket.removeAllListeners()
      }
    }
  }, [])


  return socket
}
