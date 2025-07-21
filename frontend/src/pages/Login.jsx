import React, { useContext, useEffect, useState, useRef } from 'react';
import '../styles/Register.scss';
import '../styles/Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../context/Context';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import axiosInstance from '../utils/axiosInstance';

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setModalMessage, setPopupModal } = useContext(Context);
  const { fetchCurrentUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // ✅ Autofocus on first input for better UX
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showError = (msg) => {
    setModalMessage(msg);
    setPopupModal(true);
  };

  // ✅ Extracted payload preparation logic to improve readability & early validation
  const prepareLoginPayload = () => {
    const trimmedUser = userIdentifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUser || !trimmedPassword) {
      showError('Please fill all fields');
      return null;
    }

    const isEmail = trimmedUser.includes('@');
    return {
      [isEmail ? 'email' : 'username']: trimmedUser,
      password: trimmedPassword,
    };
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    const data = prepareLoginPayload();
    if (!data) return;

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, data);
      const { message, token } = response?.data || {};

      if (message && token) {
        // ✅ Token handling moved to a single block for clarity
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchCurrentUserData();
        showError(message);
        navigate('/');
        setUserIdentifier('');
        setPassword('');
      }
    } catch (e) {
      // ✅ Improved error fallback
      const errMsg = e?.response?.data?.message || 'An unexpected error occurred';
      showError(errMsg);
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reusable input renderer function to reduce repetition
  const renderInput = (type, value, onChange, label, autoComplete, ref) => (
    <div className="mt-6 relative">
      <input
        ref={ref}
        disabled={loading}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder=" "
        type={type}
        required
        className={`w-full border-b-2 border-cyan-300 bg-transparent text-gray-800 placeholder-transparent focus:outline-none focus:border-cyan-600 peer py-2 ${
          loading ? 'cursor-not-allowed opacity-60' : ''
        }`} // ✅ Slight visual cue when disabled
      />
      <label className="text-gray-500 text-sm absolute left-0 top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 transition-all">
        {label}
      </label>
    </div>
  );

  return (
    <div
      id="login-page"
      className="relative py-10 min-w-full flex flex-col items-center min-h-screen box-border bg-gradient-to-br from-white via-blue-50 to-cyan-50"
    >
      <div className="max-w-md w-full">
        <form
          onSubmit={handleLogIn}
          className="md:p-10 md:pt-10 pt-16 p-6 pb-5 bg-transparent md:bg-white md:shadow-md rounded-xl"
        >
          <h2 className="text-3xl font-extrabold text-cyan-700 text-center mb-6">GramHub</h2>

          {renderInput(
            'text',
            userIdentifier,
            (e) => setUserIdentifier(e.target.value),
            'Username/Email',
            'email',
            inputRef
          )}

          {renderInput(
            'password',
            password,
            (e) => setPassword(e.target.value),
            'Password',
            'current-password'
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-cyan-600 text-white rounded-md mt-6 py-2 text-sm font-semibold hover:bg-cyan-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Log in'}
          </button>

          <Link
            to="/forgot-password"
            className="block text-center text-xs text-cyan-600 hover:underline mt-3"
          >
            Forgot password?
          </Link>

          <section className="my-5 py-4 text-center">
            <p className="text-xs font-medium text-gray-600">Don't have an account?</p>
            <Link to="/register" className="text-xs font-bold text-cyan-600 hover:underline">
              Sign up
            </Link>
          </section>
        </form>
      </div>

      <p className="text-xs md:mt-10 text-gray-400">© 2025 GramHub from Meta</p>

      {loading && <Loader size="lg" />}
    </div>
  );
};

export default Login;
