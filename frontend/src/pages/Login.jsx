import React, { useContext, useEffect, useState } from 'react'
import '../styles/Register.scss'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.scss'
import axios from 'axios'
import { Context } from '../context/Context'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/Loader'
const apiUrl = import.meta.env.VITE_API_URL
const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const { setModalMessage, setPopupModal, loading, setLoading } = useContext(Context)
  const { fetchCurrentUserData } = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, []);

  const handleLogIn = async (e) => {
    e.preventDefault()
    const trimmedUser = userIdentifier.trim()
    const trimmedPassword = password.trim()
    if (!trimmedUser || !trimmedPassword) {
      setModalMessage('Please fill all fields');
      setPopupModal(true);
      return;
    }
    const data = trimmedUser.includes('@')
      ? { email: trimmedUser, password: trimmedPassword }
      : { username: trimmedUser, password: trimmedPassword };
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, data)
      const { message, token } = response?.data || {}
      if (message && token) {
        localStorage.setItem('token', response.data.token)
        await fetchCurrentUserData()
        setModalMessage(response.data.message)
        setPopupModal(true)
        navigate('/')
        setUserIdentifier('')
        setPassword('')
      }
    } catch (e) {
      const errMessage = e?.response?.data?.message || 'An unexpected error occurred'
      setModalMessage(errMessage)
      setPopupModal(true)
      console.error('Login error:', e);
    } finally {
      setLoading(false)
    }
  }
  return (
    <div id='login-page' className=' py-10 min-w-full flex flex-col items-center min-h-[100vh] box-border'>
      <div className='relative max-w-md w-full'>
        <form onSubmit={handleLogIn} className='md:p-10 md:pt-10 pt-8 p-6 pb-5 '>
          <h2>GramHub</h2>
          <div className='mt-8'>
            <input autoComplete="email" value={userIdentifier} onChange={(e) => setUserIdentifier(e.target.value)} placeholder=' ' type='text' required />
            <label >Username/Email</label>
          </div>
          <div className='mt-3'>
            <input autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' type='password' required />
            <label>Password</label>
          </div>
          <button disabled={loading} type='submit' className='login-btn shadow-md box-content p-2 mt-4'>
            {loading ? 'Processing...' : 'Log in'}</button>
          <Link to='/forgot-password' className='self-center text-xs hover:underline hover:cursor-pointer mt-2'>Forgot password?</Link>
          <section className='my-5 py-5'>
            <p className='text-xs font-medium'>Don't have an account ?</p>
            <Link to='/register' className='text-xs text-blue-500 font-bold'>Sign up</Link>
          </section>
        </form>
        {loading && <Loader />}
      </div>
      <p className='text-xs mt-8'>© 2025 Instagram from Meta</p>
    </div >
  )
}

export default Login