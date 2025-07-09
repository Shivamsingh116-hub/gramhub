import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Context } from '../context/Context'
import Loader from '../components/Loader'
import { Link, useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const ForgotPassword = () => {
  const { setPopupModal, setModalMessage } = useContext(Context)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isVerifyEmailBtn, setIsVerifyEmailBtn] = useState(true)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpStatusShow, setOtpStatusShow] = useState('')
  const [showOtpStatement, setShowOtpStatement] = useState('')
  const navigate = useNavigate()
  // ✅ Step 1: Send OTP
  const handleVerifyEmailBtn = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/auth/sendOtp`, {
        email: email.trim(),
        isSignup: false
      })
      if (response.status === 200) {
        setIsVerifyEmailBtn(false)
        setShowOtpStatement('OTP sent. Please check your email.')
      }
    } catch (err) {
      if (err.response) {
        setModalMessage(err.response.data.message)
        setPopupModal(true)
      } else {
        console.error("Unexpected error:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setModalMessage('OTP must be 6 digits.')
      setPopupModal(true)
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/auth/verifyOtp`, {
        email: email.trim(),
        otp: otp.trim()
      })
      if (response.status === 200) {
        setOtpVerified(true)
        setOtpStatusShow(response.data.message)
        setShowOtpStatement('')

      }
    } catch (err) {
      if (err.response) {
        setModalMessage(err.response.data.message)
        setPopupModal(true)
      } else {
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Step 3: Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!otpVerified) {
      setModalMessage("Please verify OTP first.")
      setPopupModal(true)
      return
    }
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match.")
      setPopupModal(true)
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, {
        email: email.trim(),
        password: password.trim()
      })
      console.log(response)
      if (response.status === 200) {
        setModalMessage("Password changed successfully.")
        setPopupModal(true)
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setOtpVerified(false)
        setOtpStatusShow('')
        setIsVerifyEmailBtn(true)
        setOtp('')
        navigate('/login')
      }
    } catch (err) {
      setModalMessage("Failed to change password.")
      setPopupModal(true)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center min-w-full min-h-[100vh]'>
      <div className='relative max-w-md w-full'>
        <form onSubmit={handleChangePassword} className='flex flex-col space-y-6 justify-center border-0 md:mt-15 mt-5 md:border-[1px] border-gray-300  w-full p-10 '>
          <h2 className='font-semibold mt-8 text-[2rem] self-center'>ForgotPassword</h2>

          <div className='flex flex-col'>
            <label className='text-sm font-medium mb-0.5'>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='text-sm bg-gray-100 border px-1.5 py-2 outline-0'
              placeholder='Enter email'
              disabled={otpVerified}
            />
            {isVerifyEmailBtn && (
              <button type="button" onClick={handleVerifyEmailBtn} className='text-blue-500 font-medium mt-1 text-sm self-end'>
                Send OTP
              </button>
            )}
            {otpStatusShow && <span className='text-green-600 mt-1 text-sm'>{otpStatusShow}</span>}
          </div>

          {!isVerifyEmailBtn && !otpVerified && (
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-0.5'>OTP</label>
              <input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='text-sm bg-gray-100 border px-1.5 py-2 outline-0'
                placeholder='Enter 6-digit OTP'
                maxLength="6"
                pattern="\d{6}"
                inputMode="numeric"
              />
              <button type="button" onClick={handleVerifyOtp} className='text-blue-500 font-medium mt-1 text-sm self-end'>
                Verify OTP
              </button>
            </div>
          )}
          {showOtpStatement && <span className='text-blue-600 text-sm'>{showOtpStatement}</span>}

          <div className='flex flex-col'>
            <label className='text-sm font-medium mb-0.5'>New Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='text-sm bg-gray-100 border px-1.5 py-2 outline-0'
              placeholder='Enter new password'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm font-medium mb-0.5'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='text-sm bg-gray-100 border px-1.5 py-2 outline-0'
              placeholder='Re-enter password'
            />
          </div>

          <button type='submit' disabled={loading} className='px-3 mt-5 py-3 hover:cursor-pointer hover:text-black hover:bg-white border-2 font-semibold transition-all duration-100 bg-black text-white  '>
            {loading ? 'Processing...' : 'Change Password'}
          </button>
          <section className='my-5 py-5 border border-gray-300 flex flex-col items-center justify-center'>
            <p className='text-xs font-medium text-gray-500'>Do you know password ?</p>
            <Link to='/login' className='text-xs text-blue-500 font-bold'>Log in</Link>
          </section>
        </form>
        {loading && <Loader />}
      </div>
      <p className='text-xs md:mt-10 text-gray-500'>© 2025 GramHub from Meta</p>
    </div>
  )
}

export default ForgotPassword
