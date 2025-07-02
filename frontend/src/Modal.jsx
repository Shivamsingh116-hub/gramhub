import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
const Modal = ({ message, onClose, duration }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration || 3000);
        return () => clearTimeout(timer)
    }, [onClose, duration])

    return createPortal(<div className='fixed font-medium text-white px-5 py-1.5 right-5 bottom-5 bg-[linear-gradient(45deg,_#feda75,_#fa7e1e,_#d62976,_#962fbf,_#4f5bd5)] animate-bounce'>
        {message}
    </div>, document.getElementById('modal-root'))
}

export default Modal