import React, { useMemo } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const Context = createContext()
const ContextProvider = ({ children }) => {
    const [modalMessage, setModalMessage] = useState('')
    const [popupModal, setPopupModal] = useState(false)
    const [token, setToken] = useState('')
    const [recentPostUploadData, setRecentPostUploadData] = useState(null)
   
    const data = useMemo(() => ({
        popupModal, setPopupModal, modalMessage, setModalMessage,
        token, setToken, recentPostUploadData, setRecentPostUploadData
    }), [popupModal, modalMessage, token, recentPostUploadData])
    console.log(recentPostUploadData)
    return (
        < Context.Provider value={data}>
            {children}
        </Context.Provider >
    )
}

export default ContextProvider