import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MessageBtn = ({ recipient }) => {
    const navigate = useNavigate()
   
    return (
        <div className='flex items-center justify-center rounded-md p-1 px-3 hover:bg-cyan-400 hover:text-white border-[1px]'>
            <button className='text-xs' disabled={true} onClick={() => 
                { navigate(`/chat/${recipient?._id}`, { state: { recipient } }) }}>
                Message
            </button>
        </div>
    )
}

export default MessageBtn