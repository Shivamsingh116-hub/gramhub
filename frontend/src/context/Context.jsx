import React, { useMemo, useState, createContext } from 'react';

// ✅ Improvement: Renamed context for clarity in DevTools or debugging
export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [modalMessage, setModalMessage] = useState('');
  const [popupModal, setPopupModal] = useState(false);
  const [token, setToken] = useState('');
  const [recentPostUploadData, setRecentPostUploadData] = useState(null);

  // ✅ Improvement: Added a centralized modal trigger function
  const showModal = (message = '') => {
    setModalMessage(message);
    setPopupModal(true);
  };

  // ✅ Improvement: useMemo to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    popupModal,
    setPopupModal,
    modalMessage,
    setModalMessage,
    token,
    setToken,
    recentPostUploadData,
    setRecentPostUploadData,
    showModal, // ✅ Included the helper method in context
  }), [
    popupModal,
    modalMessage,
    token,
    recentPostUploadData,
  ]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
