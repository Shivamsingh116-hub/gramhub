import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    navigate('/login')
  }
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    )
  }
  const handleProfileImageUpload = (e) => {
   const file=e.target.file[0]
   console.log(file)
  }
  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600 overflow-hidden">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            currentUser?.username?.[0]?.toUpperCase() || 'U'
          )}
          <input type='file' accept="image/*" id='avtarUpload' onChange={handleProfileImageUpload} className='hidden' />
          <label htmlFor='avtarUpload' className='flex item-center justify-center absolute bottom-0 w-full hover:cursor-pointer
           hover:text-blue-500 text-sm bg-opacity-30 bg-gray-300 transition-all duration-100 transition-normal hover:bg-gray-400'>
            <EditOutlinedIcon fontSize="inherit" style={{ fontSize: "25px" }} className='py-1 font-bold' />
          </label>
        </div>


        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{currentUser.username}</p>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
