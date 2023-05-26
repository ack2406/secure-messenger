import { useSocket } from './hooks/useSocket'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const { socket, connected, conversations, users } = useSocket()
  const [message, setMessage] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<string>('')

  // when users changes, set selectedUser to the first user in the list which is not the current user
  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0] === name ? users[1] : users[0])
    }
  }, [users])

  if (!socket) return <div className="container">Loading...</div>

  socket.connect()

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(selectedUser)
    setMessage(event.target.value)
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function handleSelectChange(event) {
    console.log(event.target.value)
    setSelectedUser(event.target.value)
  }

  return (
    <div className="container">
      <p>
        Connected: {connected ? 'true' : 'false'} as {name}
      </p>

      <select value={selectedUser} onChange={handleSelectChange}>
        {users.map((user, index) => user !== name && <option key={index}>{user}</option>)}
      </select>

      <p>Messages:</p>
      <ul style={{ width: '30%', backgroundColor: 'lightgray' }}>
        {conversations
          .filter((conversation) => conversation.user === selectedUser)[0]
          ?.messages.map((message, index) => (
            <li key={index}>
              {message.author}: {message.content}
            </li>
          ))}
      </ul>

      <input type="text" value={name} onChange={handleNameChange} placeholder="Enter a name" />

      <button onClick={() => socket.emit('join', name)}>Send Name</button>

      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter a message"
      />

      <button onClick={() => socket.emit('message', message, selectedUser)}>Send Message</button>
    </div>
  )
}

export default App
