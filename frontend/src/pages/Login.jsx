import React, { useContext, useEffect, useState } from 'react'
import '../styles/Register.scss'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.scss'
import axios from 'axios'
import { Context } from '../context/Context'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/Loader'
import axiosInstance from '../utils/axiosInstance'

const apiUrl = import.meta.env.VITE_API_URL

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setModalMessage, setPopupModal } = useContext(Context)
  const { fetchCurrentUserData } = useContext(AuthContext)
  const navigate = useNavigate()

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
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
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
    <div id='login-page' className='relative py-10 min-w-full flex flex-col items-center min-h-[100vh] box-border bg-gradient-to-br from-white via-blue-50 to-cyan-50'>
      <div className='max-w-md w-full'>
        <form onSubmit={handleLogIn} className='md:p-10 md:pt-10 pt-16 p-6 pb-5 bg-transparent md:bg-white md:shadow-md rounded-xl'>
          <h2 className="text-3xl font-extrabold text-cyan-700 text-center mb-6">GramHub</h2>

          <div className='mt-4'>
            <input
              disabled={loading}
              autoComplete="email"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder=' '
              type='text'
              required
              className='w-full border-b-2 border-cyan-300 bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:border-cyan-600 peer py-2'
            />
            <label className='text-gray-500 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 transition-all'>Username/Email</label>
          </div>

          <div className='mt-6'>
            <input
              disabled={loading}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=' '
              type='password'
              required
              className='w-full border-b-2 border-cyan-300 bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:border-cyan-600 peer py-2'
            />
            <label className='text-gray-500 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 transition-all'>Password</label>
          </div>

          <button
            disabled={loading}
            type='submit'
            className='w-full bg-cyan-600 text-white rounded-md mt-6 py-2 text-sm font-semibold hover:bg-cyan-700 transition duration-300 disabled:opacity-50'
          >
            {loading ? 'Processing...' : 'Log in'}
          </button>

          <Link to='/forgot-password' className='block text-center text-xs text-cyan-600 hover:underline mt-3'>
            Forgot password?
          </Link>

          <section className='my-5 py-4 text-center'>
            <p className='text-xs font-medium text-gray-600'>Don't have an account?</p>
            <Link to='/register' className='text-xs font-bold text-cyan-600 hover:underline'>
              Sign up
            </Link>
          </section>
        </form>
      </div>

      <p className='text-xs md:mt-10 text-gray-400'>© 2025 GramHub from Meta</p>

      {loading && <Loader size='lg' />}
    </div>
  )
}

export default Login
