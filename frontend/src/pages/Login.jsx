import React, { useState } from 'react'
import '../styles/Register.scss'
import { Link } from 'react-router-dom'
import '../styles/Login.scss'
const Login = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogIn = () => {
    console.log('uhd')
  }
  return (
    <div id='login-page' className=' py-10 min-w-full flex flex-col items-center min-h-[100vh] box-border'>
      <form onSubmit={handleLogIn} className='md:p-10 md:pt-10 pt-8 p-6 pb-5 '>
        <h2>Instagram</h2>
        <div className='mt-8'>
          <input onChange={(e) => setUsername(e.target.value)} placeholder=' ' type='text' required />
          <label >Username</label>
        </div>
        <div className=' mt-3'>
          <input onChange={(e) => setPassword(e.target.value)} placeholder=' ' type='password' required />
          <label>Password</label>
        </div>
        <button type='submit' className='login-btn shadow-md box-content p-2'>Log in</button>
        <Link to='/forgotPassword' className='self-center text-xs hover:underline hover:cursor-pointer mt-2'>Forgot password?</Link>
        <section className='my-5 py-5'>
          <p className='text-xs font-medium'>Don't have an account ?</p>
          <Link to='/register' className='text-xs text-blue-500 font-bold'>Sign up</Link>
        </section>
      </form>
      <p className='text-xs mt-8'>© 2025 Instagram from Meta</p>
    </div >
  )
}

export default Login