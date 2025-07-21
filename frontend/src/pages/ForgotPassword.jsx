import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Context } from '../context/Context'
import Loader from '../components/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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
    <motion.div
      className='flex flex-col items-center min-w-full min-h-[100vh]'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
    >
      <motion.div
        className='relative max-w-md w-full'
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        <motion.form
          onSubmit={handleChangePassword}
          className='flex flex-col space-y-6 justify-center border-0 md:mt-15 mt-5 md:border-[1px] border-cyan-100 w-full p-10 bg-transparent md:bg-white md:shadow-md'
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <h2 className='font-semibold mt-8 text-[2rem] self-center text-cyan-700'>
            Forgot Password
          </h2>

          <motion.div className='flex flex-col' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <label className='text-sm font-medium mb-0.5 text-cyan-700'>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='text-sm bg-blue-50 border border-cyan-200 px-1.5 py-2 outline-0 rounded'
              placeholder='Enter email'
              disabled={otpVerified}
            />
            {isVerifyEmailBtn && (
              <motion.button
                type="button"
                onClick={handleVerifyEmailBtn}
                className='text-cyan-500 font-medium mt-1 text-sm self-end'
                whileTap={{ scale: 0.95 }}
              >
                Send OTP
              </motion.button>
            )}
            {otpStatusShow && <span className='text-cyan-600 mt-1 text-sm'>{otpStatusShow}</span>}
          </motion.div>

          {!isVerifyEmailBtn && !otpVerified && (
            <motion.div className='flex flex-col' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
              <label className='text-sm font-medium mb-0.5 text-cyan-700'>OTP</label>
              <input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='text-sm bg-blue-50 border border-cyan-200 px-1.5 py-2 outline-0 rounded'
                placeholder='Enter 6-digit OTP'
                maxLength="6"
                pattern="\d{6}"
                inputMode="numeric"
              />
              <motion.button
                type="button"
                onClick={handleVerifyOtp}
                className='text-cyan-500 font-medium mt-1 text-sm self-end'
                whileTap={{ scale: 0.95 }}
              >
                Verify OTP
              </motion.button>
            </motion.div>
          )}

          {showOtpStatement && (
            <motion.span
              className='text-cyan-600 text-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {showOtpStatement}
            </motion.span>
          )}

          <motion.div className='flex flex-col' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <label className='text-sm font-medium mb-0.5 text-cyan-700'>New Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='text-sm bg-blue-50 border border-cyan-200 px-1.5 py-2 outline-0 rounded'
              placeholder='Enter new password'
            />
          </motion.div>

          <motion.div className='flex flex-col' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <label className='text-sm font-medium mb-0.5 text-cyan-700'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='text-sm bg-blue-50 border border-cyan-200 px-1.5 py-2 outline-0 rounded'
              placeholder='Re-enter password'
            />
          </motion.div>

          <motion.button
            type='submit'
            disabled={loading}
            className='px-3 mt-5 py-3 hover:cursor-pointer hover:text-cyan-700 hover:bg-white border-2 font-semibold transition-all duration-150 bg-cyan-700 text-white rounded'
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
          >
            {loading ? 'Processing...' : 'Change Password'}
          </motion.button>

          <motion.section
            className='my-5 py-5 border border-cyan-100 flex flex-col items-center justify-center bg-blue-50 rounded'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className='text-xs font-medium text-gray-600'>Do you know password?</p>
            <Link to='/login' className='text-xs text-cyan-500 font-bold'>
              Log in
            </Link>
          </motion.section>
        </motion.form>
      </motion.div>
      <p className='text-xs md:mt-10 text-gray-500'>© 2025 GramHub from Meta</p>
      {loading && <Loader size='lg' />}
    </motion.div>
  )
}

export default ForgotPassword
