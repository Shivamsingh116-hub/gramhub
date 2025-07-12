import React, { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import '../../styles/EditProfile.scss'
import axiosInstance from '../../utils/axiosInstance'
import { Context } from '../../context/Context'
import Loader from '../../components/Loader'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [isChecked, setIsChecked] = useState(false)
  const {  setModalMessage, setPopupModal } = useContext(Context)
  const [loading, setLoading]=useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    gender: currentUser?.gender || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isChecked) {
      setModalMessage('Please confirm that details are correct.')
      setPopupModal(true)
      return
    }

    setLoading(true)
    try {
      const { data: updateRes } = await axiosInstance.put(`/upload/update-profile-data`, formData)
      setModalMessage(updateRes?.message || 'Profile updated.')
      setPopupModal(true)
      navigate('/profile')
      setCurrentUser((prevData) => ({ ...prevData, ...formData }))
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'An unexpected error occurred.'
      setModalMessage(errorMsg)
      setPopupModal(true)
      console.error('Update profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative edit-profile w-full min-h-screen flex flex-col pt-16 items-center  bg-gradient-to-br from-white via-blue-50 to-cyan-100">

      {/* Close Button */}
      <button
        type="button"
        disabled={loading}
        onClick={() => navigate('/profile')}
        className={`${loading ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'} fixed border border-cyan-500 rounded-full text-cyan-700 bg-white hover:bg-cyan-600 hover:text-white top-8 md:top-10 right-8 md:right-14 hover:scale-110 transition-all duration-150`}
      >
        <CloseOutlinedIcon fontSize="small" />
      </button>

      {/* Edit Profile Form */}
      <div className="max-w-md w-full">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-6 md:border border-cyan-200 md:shadow-sm bg-transparent md:bg-white px-5 md:px-12 py-14 rounded-md"
        >
          <h2 className="font-bold text-3xl text-cyan-700 self-center">Edit Profile</h2>

          {/* Name */}
          <div className="mt-5">
            <input
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="w-full px-3 py-2 border border-cyan-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <label htmlFor="name" className="text-xs text-gray-600 ml-1 mt-1 block">Name</label>
          </div>

          {/* Username */}
          <div>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-cyan-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <label htmlFor="username" className="text-xs text-gray-600 ml-1 mt-1 block">Username</label>
          </div>

          {/* Bio */}
          <div>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              maxLength={150}
              onChange={handleChange}
              placeholder="Enter bio"
              rows={4}
              className="w-full px-3 py-2 border border-cyan-300 rounded text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <label htmlFor="bio" className="text-xs text-gray-600 ml-1 mt-1 block">Bio</label>
            <div className="text-[0.7rem] text-gray-500 ml-1 mt-1">{formData.bio.length} / 150 characters</div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="text-sm text-gray-600 mb-1 block">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-cyan-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Confirmation Checkbox */}
          <span className="ml-1 flex items-center gap-2 text-xs font-medium">
            <input
              id="confirmation"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              type="checkbox"
              className="accent-cyan-600"
            />
            <label
              htmlFor="confirmation"
              className={`${isChecked ? 'text-cyan-600' : 'text-red-500'}`}
            >
              Ensure above all the details are correct.
            </label>
          </span>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isChecked}
            className={`py-2 font-semibold mt-4 rounded border transition-all duration-200 ${
              isChecked
                ? 'bg-cyan-700 text-white hover:bg-white hover:text-cyan-700 border-cyan-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-xs mt-10 text-gray-500">© 2025 GramHub from Meta</p>

      {/* Loader */}
      {loading && <Loader size="lg" />}
    </div>
  )
}

export default EditProfile
