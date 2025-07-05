import React, { useMemo } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const Context = createContext()
const ContextProvider = ({ children }) => {
    const [modalMessage, setModalMessage] = useState('')
    const [popupModal, setPopupModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const data = useMemo(() => ({
        popupModal, setPopupModal, modalMessage, setModalMessage, loading, setLoading,
        token, setToken
    }),[popupModal,modalMessage,loading,token])
    
    return (
        < Context.Provider value={data}>
            {children}
        </Context.Provider >
    )
}

export default ContextProvider