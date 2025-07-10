import React, { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import '../../styles/EditProfile.scss'
import axiosInstance from '../../utils/axiosInstance'
import { Context } from '../../context/Context'
import Loader from '../../components/Loader'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const [isChecked, setIsChecked] = useState(false)
    const { loading, setLoading, setModalMessage, setPopupModal } = useContext(Context)
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
            setModalMessage('Please confirm that details are correct.');
            setPopupModal(true);
            return;
        }
        setLoading(true)
        try {
            const { data: updateRes } = await axiosInstance.put(`/upload/update-profile-data`, formData)
            setModalMessage(updateRes?.message || 'Profile updated.');
            setPopupModal(true);
            navigate('/profile')
            setCurrentUser((prevData) => ({ ...prevData, ...formData }))
        } catch (error) {
            const errorMsg = error?.response?.data?.message || 'An unexpected error occurred.';
            setModalMessage(errorMsg);
            setPopupModal(true);
            console.error('Update profile error:', error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='edit-profile w-full h-full flex flex-col items-center mt-14 md:mt-20'>
            <button type='button' disabled={loading} onClick={() => navigate('/profile')}
                className={`${loading ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}
 fixed border rounded-full text-black bg-white  hover:bg-black hover:text-white md:top-10 top-8 right-8 md:right-14  hover:scale-115 transition-all transition-normal duration-100`}><CloseOutlinedIcon /></button>

            <div className='relative max-w-md w-full'>
                <form onSubmit={handleSubmit} className='relative flex flex-col gap-6  md:border border-gray-300 md:shadow-md px-5 md:px-12 py-14'>
                    <h2 className='font-semibold text-3xl self-center'>EditProfile</h2>
                    <div className='mt-5'>
                        <input name='name' id='name' value={formData.name} onChange={handleChange} placeholder='Enter name' required />
                        <label htmlFor='name'>Name</label>
                    </div>
                    <div>
                        <input id='username' name='username' value={formData.username} onChange={handleChange} type='text' placeholder='Enter username' />
                        <label htmlFor='username'>Username</label>
                    </div>
                    <div>
                        <textarea
                            id='bio'
                            name='bio'
                            value={formData.bio}
                            maxLength={150}
                            onChange={handleChange}
                            placeholder='Enter bio'
                            rows={4}
                            style={{ width: '100%' }}
                        />
                        <label htmlFor='bio'>Bio</label>
                        <div style={{ fontSize: '0.7rem', color: '#666', marginLeft: "5px", marginTop: '4px' }}>
                            {formData.bio.length} / 150 characters
                        </div>
                    </div>
                    <div>
                        <label htmlFor='gender'>Gender</label>
                        <select id='gender' name='gender' value={formData.gender} onChange={handleChange} required>
                            <option value=''>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <span className='ml-1 flex flex-row gap-1 text-xs font-medium text-gray-500'>
                        <input id='confirmation' checked={isChecked} onChange={(e) => {
                            setIsChecked(e.target.checked)
                        }} type="checkbox" />
                        <label htmlFor='confirmation' className={`${isChecked ? 'text-blue-500' : 'text-red-500'}`}>Ensure above all the details are correct.</label>
                    </span>
                    <button
                        type='submit'
                        disabled={!isChecked}
                        className={`py-1.5 font-semibold mt-4 border transition-all duration-100 ${isChecked
                            ? 'bg-black text-white hover:bg-white hover:text-black'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </form>
                {loading && <Loader />}
            </div>
            <p className='text-xs md:mt-10 text-gray-500'>© 2025 GramHub from Meta</p>
        </div >
    )
}

export default EditProfile