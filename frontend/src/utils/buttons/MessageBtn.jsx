import React from 'react'
import { useNavigate } from 'react-router-dom'

const MessageBtn = ({ recipient }) => {
    const navigate = useNavigate()
    console.log(recipient)
    return (
        <div>
            <button onClick={() => { navigate(`/chat/${recipient?._id}`, { state: { recipient } }) }}>
                Message
            </button>
        </div>
    )
}

export default MessageBtn