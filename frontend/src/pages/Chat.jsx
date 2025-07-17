import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'
const apiUrl = import.meta.env.VITE_API_URL
const socket = io(apiUrl)
const Chat = () => {
    const location = useLocation()
    const recipient = location.state?.recipient || {}
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    useEffect(() => {
        if (currentUser?._id) {
            setUser(currentUser)
            socket.emit('register', currentUser._id)
        }
        return () => { socket.disconnect() }
    }, [])
    console.log(recipient)
    useEffect(() => {
        socket.on('receive_message', (data) => {
            if (data.from === recipient._id) {
                setChat((prev) => [...prev, { ...data, sender: 'other' }])
            }
        })

        return () => {
            socket.off('receive_message')
        }
    }, [recipient])
    const handleSend = () => {
        if (message.trim() === '' || !user) {
            return
        }
        const data = {
            from: user._id,
            to: recipient._id,
            text: message
        };
        socket.emit('privateMessage', data)
        setChat((prev) => [...prev, { ...data, sender: 'me' }]);
        setMessage('');
    }
    return (
        <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>Chat with {recipient.username}</h2>
            <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                {chat.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                        <p><strong>{msg.sender === 'me' ? 'You' : recipient.username}:</strong> {msg.text}</p>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    placeholder="Type your message..."
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '80%' }}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Chat