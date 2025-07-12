import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ message, onClose, duration }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration || 3000)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return createPortal(
    <div className="fixed z-50 bottom-5 right-5 px-4 py-2 rounded-lg shadow-md bg-cyan-100 text-cyan-800 text-sm md:text-base font-medium animate-bounce border border-cyan-300">
      {message}
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal
