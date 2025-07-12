import React, { useState } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import '../styles/Register.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react';
import { Context } from '../context/Context';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
const apiUrl = import.meta.env.VITE_API_URL
const Register = () => {
  const [isVerifyClick, setIsVerifyClick] = useState(false)
  const [showOtpStatement, setShowOtpStatement] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpError, setOtpError] = useState('')
  const [showSignUpVerifyBtn, setShowSignUpVerifyBtn] = useState(false)
  const [otpStatusShow, setOtpStatusShow] = useState('')
  const { setModalMessage, setPopupModal } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const { fetchCurrentUserData } = useContext(AuthContext)
  const navigate = useNavigate()
  const validateUsername = (userName) => {
    setUsername(userName)
    for (const char of userName) {
      if (char !== char.toLowerCase()) {
        setUsernameError('Uppercase letter not allowed')
        return
      }
      if (char === ' ') {
        setUsernameError("Space is not allowed in usernames.")
        return
      }
      if (userName && char === '@') {
        setUsernameError("Invalid username: \"@\" is not allowed in usernames.")
        return
      }
    }
    if (userName && userName.length < 3) {
      setUsernameError('Username must contain at least 3  characters.')
      return
    } else if (userName && userName.length > 20) {
      setUsernameError("Username must be under 20 characters or fewer.")
      return
    } else if (userName && userName[userName.length - 1] === '.') {
      setUsernameError("Username must not end with a '.' period.")
      return
    }

    setUsernameError('')

  }
  const validateEmail = (userEmail) => {

    setEmail(userEmail)

    if (userEmail && (!userEmail.includes('@') || userEmail.length < 5)) {
      setShowSignUpVerifyBtn(false)
      setEmailError("Invalid email!");
    } else {
      setEmail(userEmail);
      setShowSignUpVerifyBtn(true)
      setEmailError('');
    }
  }


  const handleVerify = async () => {
    if (!email) {
      setEmailError("Enter email ")
    }
    if (!emailError && email) {
      setLoading(true)
      try {
        const response = await axios.post(`${apiUrl}/api/auth/sendOtp`, { email: email.trim(), isSignup: true })
        if (response) {

          setShowOtpStatement(response.data.message)
          const emailInput = document.getElementById("email")
          emailInput.disabled = true
          const container = document.getElementById('signup-email-container')
          const signUpVerifyBtn = document.getElementById('signup-verify-btn')
          const createEditBtn = document.createElement('span')
          createEditBtn.textContent = "✎"
          createEditBtn.className = 'edit-email-btn'
          createEditBtn.id = 'signup-email-edit-btn'
          const createVerifyDiv = document.createElement('div')
          createVerifyDiv.classList.add('signup-verify-div')
          const createInput = document.createElement('input')
          createInput.classList.add('signup-verify-input')
          createInput.type = 'text'
          createInput.maxLength = '6'
          createInput.pattern = '\\d{6}'
          createInput.inputMode = 'numeric'
          createInput.placeholder = 'Enter otp recieved in email...'
          const verifyOtpBtn = document.createElement('button')
          verifyOtpBtn.textContent = 'Verify OTP'
          verifyOtpBtn.type = 'button'
          verifyOtpBtn.classList.add('signup-otp-verify-btn')
          container.appendChild(createEditBtn)
          createVerifyDiv.appendChild(createInput)
          createVerifyDiv.appendChild(verifyOtpBtn)
          container.appendChild(createVerifyDiv)
          createInput.focus()
          setShowSignUpVerifyBtn(false)
          createEditBtn.addEventListener('click', () => {
            emailInput.disabled = false
            createVerifyDiv.remove()
            setShowOtpStatement('')
            createEditBtn.remove()
            setShowSignUpVerifyBtn(true)
            setIsVerifyClick(false)
            setOtpStatusShow('')
          })
          verifyOtpBtn.addEventListener("click", async () => {
            const otp = createInput.value.trim()
            setLoading(true)
            if (!otp || otp.length !== 6) {
              setOtpError('OTP cannot be empty.')
              setLoading(false)
              return
            }
            try {
              const response = await axios.post(`${apiUrl}/api/auth/verifyOtp`, { email: email.trim(), otp: otp.trim() })
              if (response) {
                setOtpStatusShow(response.data.message)
                createVerifyDiv.remove()
                setShowOtpStatement('')
                setShowSignUpVerifyBtn(false)
                setIsVerifyClick(true)
              }
            } catch (err) {
              if (err.response && err.response.status === 406) {
                setModalMessage(err.response.data.message)
                setPopupModal(true)
                setShowOtpStatement('')
              }
              console.log(err)
            } finally {
              setLoading(false)
            }
          })
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setPopupModal(true)
          setModalMessage(err.response.data.message)
        } else if (err.response && err.response.status === 409) {
          setPopupModal(true)
          setModalMessage(err.response.data.message)
        } else {
          console.log("Internal server error")
        }
      } finally {
        setLoading(false)
      }
    }

    return

  }
  const handleSignUp = async (e) => {
    setLoading(true)
    e.preventDefault()
    const data = { username: username.trim(), email: email.trim(), password: password.trim() }
    if (!isVerifyClick) {
      setLoading(false)
      setPopupModal(true)
      setModalMessage('Email not verified')
      return
    }
    if (confirmPassword.trim() !== password.trim()) {
      setLoading(false)
      setPopupModal(true)
      setModalMessage("Fill same password in both")
      return
    }
    if (emailError && usernameError) {
      setLoading(false)
      setPopupModal(true)
      setModalMessage("Please fill correct details!")
      return
    }
    try {
      const createEditBtn = document.getElementById('signup-email-edit-btn')
      const emailInput = document.getElementById("email")
      const response = await axios.post(`${apiUrl}/api/auth/register`, data)
      if (response) {
        setPopupModal(true)
        setModalMessage(response.data.message)
        setEmail('')
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setIsVerifyClick(false)
        setShowSignUpVerifyBtn(true)
        setOtpStatusShow('')
        emailInput.disabled = false
        createEditBtn.remove()
        localStorage.setItem("token", response.data.token)
        const user = await fetchCurrentUserData()
        navigate('/')
      }
    } catch (err) {
      if (err.response && err.response.status === 402) {
        setPopupModal(true)
        setModalMessage(err.response.data.message)
      }

    } finally {
      setLoading(false)
    }

  }
  return (
    <div id='register-page' className='relative py-10 min-w-full flex flex-col items-center min-h-[100vh] bg-white box-border'>
      <div className='w-full max-w-md'>
        <form onSubmit={handleSignUp} className='relative md:p-10 md:pt-10 pt-12 p-6 pb-6 bg-transparent md:bg-blue-50 rounded-lg md:shadow-md'>
          <h2 className='text-center text-cyan-700 font-bold text-2xl mb-2'>GramHub</h2>
          <h4 className='text-center text-gray-600 text-sm mb-6'>
            Sign up to see photos and messages <br /> from your friends.
          </h4>

          <div>
            <input value={username} onChange={(e) => validateUsername(e.target.value)} placeholder=' ' type='text' required className='w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white' />
            <label className='text-sm text-gray-600 ml-1'>Username</label>
            {usernameError && <span className='text-[10px] ml-0.5 text-red-500 font-medium'>{usernameError}</span>}
          </div>

          <div id='signup-email-container' className='mt-1'>
            <input value={email} id='email' onChange={(e) => validateEmail(e.target.value)} placeholder=' ' type='text' required className='w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white' />
            <label className='text-sm text-gray-600 ml-1'>Email</label>

            {emailError && <span className='text-[10px] ml-0.5 text-red-500 font-medium'>{emailError}</span>}

            {showSignUpVerifyBtn && (
              <button
                type="button"
                id='signup-verify-btn'
                className='text-cyan-700 underline text-sm ml-1 mt-0.5 hover:text-cyan-800 transition'
                onClick={handleVerify}>
                Verify
              </button>
            )}

            {showOtpStatement && <span className='text-[10px] ml-1 text-cyan-700 font-medium'>{showOtpStatement}</span>}
            {otpStatusShow && <span className='text-[10px] ml-0.5 font-medium text-green-600'>{otpStatusShow}</span>}
          </div>

          <div className='mt-1'>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' type='password' required className='w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white' />
            <label className='text-sm text-gray-600 ml-1'>Password</label>
          </div>

          <div className='mt-1'>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder=' ' type='password' required className='w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white' />
            <label className='text-sm text-gray-600 ml-1'>Confirm Password</label>
          </div>

          <span className='text-center text-xs text-gray-600 block mt-1'>
            People who use our service may have <br />
            uploaded your contact information to Instagram. <br />
            <Link to='/siginInlearnMore' className='text-cyan-700 underline hover:text-cyan-800'>Learn More</Link>
          </span>

          <button type='submit' className='signup-btn w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold mt-5 py-2 rounded-md transition shadow'>
            {loading ? 'Processing...' : 'Sign up'}
          </button>

          <section className='my-5 py-5 text-center'>
            <p className='text-xs font-medium text-gray-600'>Have an account?</p>
            <Link to='/login' className='text-xs text-cyan-700 font-bold hover:text-cyan-800 transition'>Log in</Link>
          </section>
        </form>
      </div>
      <p className='text-xs md:mt-10 text-gray-500'>© 2025 GramHub from Meta</p>
      {loading && <Loader size='lg' />}
    </div>
  )
}

export default Register