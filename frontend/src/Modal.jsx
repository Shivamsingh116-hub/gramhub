import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
const Modal = ({ message, onClose, duration }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration || 3000);
        return () => clearTimeout(timer)
    }, [onClose, duration])

    return createPortal(<div className='fixed font-medium md:text-[16px] z-50 text-sm text-white px-4 py-1 right-5 bottom-5 bg-black animate-bounce'>
        {message}
    </div>, document.getElementById('modal-root'))
}




export default Modal