import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ReplyIcon from '@mui/icons-material/Reply';
import { AuthContext } from '../context/AuthContext'
const apiUrl = import.meta.env.VITE_API_URL
const Chat = () => {
    const socket = io(apiUrl)
    const location = useLocation()
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    const recipient = location.state?.recipient || {}
    const [recipientUser, setRecipientUser] = useState(() => {
        const saved = localStorage.getItem('recipientUser')
        return saved ? JSON.parse(saved) : null
    })
    useEffect(() => {
        if (currentUser?._id) {
            socket.emit('register', currentUser._id)
        } 
    }, [])
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        if (recipient) {
            localStorage.setItem('recipientUser', JSON.stringify(recipient))
            setRecipientUser(recipient)
        }
        return () => {
            document.body.style.overflow = ''
            localStorage.removeItem('recipientUser')
        }
    }, [])

    const handleSend = () => {
        if (message.trim() === '' || !currentUser) return;
        const data = {
            from: currentUser._id,
            to: recipientUser._id,
            text: message
        }
        socket.emit("message", data)
        setChat(prev => ([...prev, { ...data, sender: 'me' }]))
    }
    useEffect(() => {
        socket.on('recieve_message', (data) => {
            console.log(`from ${data.from} text ${data.text}`)
            if (data.from === recipientUser._id) {
                setChat(prev => ([...prev, { ...data, sender: 'other' }]))
            }
        })
        return () => socket.off("receive_message");
    }, [])
    console.log(chat)
    return (
        <main className='fixed text-cyan-500 inset-0 z-50 bg-gradient-to-br max-w-full w-full from-white via-blue-50 to-cyan-100'>
            <div className='flex flex-col'>
                <section className='flex p-3 flex-row gap-2 items-center border-b-[1px] border-cyan-200 shadow-md'>
                    <div className='w-12 h-12 overflow-hidden rounded-full'>{recipientUser?.avatarURL ?
                        <img className='w-full h-full box-border rounded-full' src={recipientUser.avatarURL} />
                        : <span className='w-full h-full box-border rounded-full'>{recipientUser?.username?.[0].toUpperCase() || 'U'}</span>}
                    </div>
                    {recipientUser?.username ? <h2>{recipientUser.username}</h2> : <h2>Unknown</h2>}
                </section>
                <section className='p-4'>
                    {chat.length > 0 ?

                        chat.map((data, i) => (
                            <div key={i} className={`p-2 ${data.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                <p className='text-sm'>{data.text}</p>
                            </div>
                        ))

                        : <p>
                            No Chats
                        </p>
                    }
                </section>
                <section className='fixed bottom-0 border-t-[1px] border-cyan-200 shadow-md w-full z-50'>
                    <div className='relative '>
                        <input
                            className='p-4 outline-0 border-0 w-full overflow-y-scroll'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder='Enter text...' />
                        <button type='button' onClick={handleSend} className='absolute top-3 right-4'><ReplyIcon /></button>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Chat