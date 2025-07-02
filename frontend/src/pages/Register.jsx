import React, { useState } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import '../styles/Register.scss'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react';
import { Context } from '../context/Context';
import Loader from '../components/Loader';
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
  const [showSignUpVerifyBtn, setShowSignUpVerifyBtn] = useState(true)
  const [otpStatusShow, setOtpStatusShow] = useState('')
  const { setModalMessage, setPopupModal, loading, setLoading } = useContext(Context)
  const validateUsername = (userName) => {
    for (const char of userName) {
      if(char === ' '){
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

    setUsername(userName)
    setUsernameError('')

  }
  const validateEmail = (userEmail) => {
    if (userEmail && (!userEmail.includes('@') || userEmail.length < 5)) {
      setEmailError("Invalid email!");
    } else {
      setEmail(userEmail);
      setEmailError('');
    }
  }


  const handleVerify = async () => {
    setLoading(true)
    if (!emailError && email) {
      try {
        const response = await axios.post(`${apiUrl}/api/auth/sendOtp`, { email: email, username: username })
        if (response) {

          setShowOtpStatement(response.data.message)
          const emailInput = document.getElementById("email")
          emailInput.disabled = true
          const container = document.getElementById('signup-email-container')
          const signUpVerifyBtn = document.getElementById('signup-verify-btn')
          const createEditBtn = document.createElement('span')
          createEditBtn.textContent = "✎"
          createEditBtn.className = 'edit-email-btn'
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
              const response = await axios.post(`${apiUrl}/api/auth/verifyOtp`, { email: email, otp: otp })
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
          setEmailError(err.response.data.message)
        } else if (err.response && err.response.status === 409) {
          setEmailError(err.response.data.message)
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
    const data = { username: username, email: email, password: password }
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
      const response = await axios.post(`${apiUrl}/api/auth/register`, data)
      if (response) {
        setPopupModal(true)
        setModalMessage(response.data.message)
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
    <div id='register-page' className=' py-10 min-w-full px-3 flex flex-col items-center min-h-[100vh] box-border'>
      <div className='relative w-full max-w-md '>
        {loading && <Loader />}
        <form onSubmit={handleSignUp} className='relative md:p-10 md:pt-10 pt-8 p-6 pb-5 '>
          <h2>Instagram</h2>
          <h4 className='text-center'>Sign up to see photos and messages
            <br></br> from your friends.</h4>
          <div>
            <input onChange={(e) => validateUsername(e.target.value)} placeholder=' ' type='text' required />
            <label>Username</label>
            {usernameError && <span className='text-[10px] ml-0.5 text-red-500 font-medium'>{usernameError}</span>}
          </div>
          <div id='signup-email-container'>
            <input id='email' onChange={(e) => validateEmail(e.target.value)} placeholder=' ' type='text' required />
            <label>Email</label>
            {emailError && <span className='text-[10px] ml-0.5 text-red-500 font-medium'>{emailError}</span>}
            {showSignUpVerifyBtn && <button type="button" id='signup-verify-btn' className=' text-blue-500 self-start ml-1 mt-0.5' onClick={handleVerify}>Verify</button>}
            {showOtpStatement && <span className='text-[10px] ml-1 text-blue-500 font-medium'>{showOtpStatement}</span>}
            {otpStatusShow && <span className='text-[10px] ml-0.5 font-medium text-green-600'>{otpStatusShow}</span>}
          </div>
          <div>
            <input onChange={(e) => setPassword(e.target.value)} placeholder=' ' type='password' required />
            <label>Password</label>
          </div>
          <div>
            <input onChange={(e) => setConfirmPassword(e.target.value)} placeholder=' ' type='password' required />
            <label>Confirm Password</label>
          </div>
          <span className='text-center text-xs'>People who use our service may have
            <br></br>
            uploaded your contact information to Instagram.
            <br></br>
            <Link to='/siginInlearnMore' className='text-blue-400 underline'>Learn More</Link>
          </span>
          <button type='submit' className='signup-btn shadow-md box-content p-2'>Sign Up</button>
          <section className='my-5 py-5'>
            <p className='text-xs font-medium'>Have an account ?</p>
            <Link to='/login' className='text-xs text-blue-500 font-bold'>Log in</Link>
          </section>
        </form>
      </div>
      <p className='text-xs mt-8'>© 2025 Instagram from Meta</p>
    </div >
  )
}

export default Register