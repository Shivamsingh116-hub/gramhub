import React, { useState } from 'react'
import '../styles/Register.scss'
import { Link } from 'react-router-dom'
const Register = () => {
  const [isVerifyClick, setIsVerifyClick] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const validateUsername = (userName) => {
    for (const char of userName) {
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


  const handleVerify = () => {
    const container = document.getElementById('signup-email-container')
    const signUpVerifyBtn = document.getElementById('signup-verify-btn')
    const createVerifyDiv = document.createElement('div')
    createVerifyDiv.classList.add('signup-verify-div')
    const createInput = document.createElement('input')
    createInput.classList.add('signup-verify-input')
    createInput.type = 'number'
    createInput.placeholder = 'Enter otp recieved in email...'
    const createBtn = document.createElement('button')
    createBtn.textContent = 'Verify OTP'
    createBtn.type = 'button'
    createBtn.classList.add('signup-otp-verify-btn')
    createVerifyDiv.appendChild(createInput)
    createVerifyDiv.appendChild(createBtn)
    container.appendChild(createVerifyDiv)
    signUpVerifyBtn.remove()
  }
  const handleSignUp = () => {
    console.log('uhd')
  }
  return (
    <div id='register-page' className=' py-10 min-w-full flex flex-col items-center min-h-[100vh] box-border'>
      <form onSubmit={handleSignUp} className='p-10 pb-5 '>
        <h2>Instagram</h2>
        <h4 className='text-center'>Sign up to see photos and messages
          <br></br> from your friends.</h4>
        <div>
          <input onChange={(e) => validateUsername(e.target.value)} placeholder=' ' type='text' required />
          <label>Username</label>
          {usernameError && <span className='text-[10px] text-red-500 font-medium'>{usernameError}</span>}
        </div>
        <div id='signup-email-container'>
          <input id='email' onChange={(e) => validateEmail(e.target.value)} placeholder=' ' type='text' required />
          <label>Email</label>
          {emailError && <span className='text-[10px] text-red-500 font-medium'>{emailError}</span>}
          <button type="button" id='signup-verify-btn' className=' text-blue-500 self-start ml-1 mt-1' onClick={handleVerify}>Verify</button>
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
      <p className='text-xs mt-8'>© 2025 Instagram from Meta</p>
    </div >
  )
}

export default Register