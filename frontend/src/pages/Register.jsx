import React, { useState, useContext } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import '../styles/Register.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../context/Context';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const [isVerifyClick, setIsVerifyClick] = useState(false);
  const [showOtpStatement, setShowOtpStatement] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showSignUpVerifyBtn, setShowSignUpVerifyBtn] = useState(false);
  const [otpStatusShow, setOtpStatusShow] = useState('');
  const { setModalMessage, setPopupModal } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const { fetchCurrentUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation and AJAX logic unchanged
  const validateUsername = (userName) => {
    setUsername(userName);
    for (const char of userName) {
      if (char !== char.toLowerCase()) {
        setUsernameError('Uppercase letter not allowed');
        return;
      }
      if (char === ' ') {
        setUsernameError('Space is not allowed in usernames.');
        return;
      }
      if (char === '@') {
        setUsernameError('Invalid username: "@" is not allowed.');
        return;
      }
    }
    if (userName && userName.length < 3) {
      setUsernameError('Username must contain at least 3 characters.');
      return;
    } else if (userName && userName.length > 20) {
      setUsernameError('Username must be under 20 characters.');
      return;
    } else if (userName && userName.endsWith('.')) {
      setUsernameError("Username must not end with a '.' period.");
      return;
    }
    setUsernameError('');
  };

  const validateEmail = (userEmail) => {
    setEmail(userEmail);
    if (userEmail && (!userEmail.includes('@') || userEmail.length < 5)) {
      setShowSignUpVerifyBtn(false);
      setEmailError('Invalid email!');
    } else {
      setShowSignUpVerifyBtn(true);
      setEmailError('');
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setEmailError('Enter email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/sendOtp`,
        { email: email.trim(), isSignup: true }
      );
      setShowOtpStatement(response.data.message);

      document.getElementById('email').disabled = true;
      setShowSignUpVerifyBtn(false);

      const verifyDiv = document.createElement('div');
      verifyDiv.className = 'signup-verify-div';

      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 6;
      input.pattern = '\\d{6}';
      input.inputMode = 'numeric';
      input.placeholder = 'Enter otp received in email...';
      input.className = 'signup-verify-input';

      const verifyBtn = document.createElement('button');
      verifyBtn.textContent = 'Verify OTP';
      verifyBtn.type = 'button';
      verifyBtn.className = 'signup-otp-verify-btn';

      verifyDiv.append(input, verifyBtn);
      document.getElementById('signup-email-container').append(
        createEditBtn(),
        verifyDiv
      );
      input.focus();

      verifyBtn.addEventListener('click', async () => {
        const otp = input.value.trim();
        if (otp.length !== 6) {
          setOtpError('OTP must be 6 digits.');
          return;
        }
        setLoading(true);
        try {
          const res = await axios.post(`${apiUrl}/api/auth/verifyOtp`, {
            email: email.trim(),
            otp: otp.trim(),
          });
          setOtpStatusShow(res.data.message);
          verifyDiv.remove();
          setShowOtpStatement('');
          setShowSignUpVerifyBtn(false);
          setIsVerifyClick(true);
        } catch (err) {
          if (err.response?.status === 406) {
            setModalMessage(err.response.data.message);
            setPopupModal(true);
          }
        } finally {
          setLoading(false);
        }
      });

    } catch (err) {
      setPopupModal(true);
      setModalMessage(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const createEditBtn = () => {
    const btn = document.createElement('span');
    btn.textContent = '✎';
    btn.id = 'signup-email-edit-btn';
    btn.className = 'edit-email-btn';
    btn.addEventListener('click', () => {
      document.getElementById('email').disabled = false;
      document.querySelector('.signup-verify-div').remove();
      setShowOtpStatement('');
      btn.remove();
      setShowSignUpVerifyBtn(true);
      setIsVerifyClick(false);
      setOtpStatusShow('');
    });
    return btn;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isVerifyClick) {
      setLoading(false);
      setPopupModal(true);
      setModalMessage('Email not verified');
      return;
    }
    if (confirmPassword !== password) {
      setLoading(false);
      setPopupModal(true);
      setModalMessage('Passwords do not match');
      return;
    }
    if (emailError || usernameError) {
      setLoading(false);
      setPopupModal(true);
      setModalMessage('Please fill correct details!');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      setPopupModal(true);
      setModalMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      await fetchCurrentUserData();
      navigate('/');
    } catch (err) {
      setPopupModal(true);
      setModalMessage(err.response?.data?.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="register-page"
      className="relative py-10 min-w-full flex flex-col items-center min-h-[100vh] bg-white box-border"
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        <form
          onSubmit={handleSignUp}
          className="relative md:p-10 md:pt-10 pt-12 p-6 pb-6 bg-transparent md:bg-blue-50 rounded-lg md:shadow-md"
        >
          <h2 className="text-center text-cyan-700 font-bold text-2xl mb-2">
            GramHub
          </h2>
          <h4 className="text-center text-gray-600 text-sm mb-6">
            Sign up to see photos and messages <br />
            from your friends.
          </h4>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <input
              value={username}
              onChange={(e) => validateUsername(e.target.value)}
              placeholder=" "
              type="text"
              required
              className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
            <label className="text-sm text-gray-600 ml-1">Username</label>
            {usernameError && (
              <span className="text-[10px] ml-0.5 text-red-500 font-medium">
                {usernameError}
              </span>
            )}
          </motion.div>

          <motion.div
            id="signup-email-container"
            className="mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <input
              value={email}
              id="email"
              onChange={(e) => validateEmail(e.target.value)}
              placeholder=" "
              type="text"
              required
              className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
            <label className="text-sm text-gray-600 ml-1">Email</label>
            {emailError && (
              <span className="text-[10px] ml-0.5 text-red-500 font-medium">
                {emailError}
              </span>
            )}
            {showSignUpVerifyBtn && (
              <motion.button
                type="button"
                id="signup-verify-btn"
                onClick={handleVerify}
                whileTap={{ scale: 0.95 }}
                className="text-cyan-700 underline text-sm ml-1 mt-0.5 hover:text-cyan-800 transition"
              >
                Verify
              </motion.button>
            )}
            {showOtpStatement && (
              <span className="text-[10px] ml-1 text-cyan-700 font-medium">
                {showOtpStatement}
              </span>
            )}
            {otpStatusShow && (
              <span className="text-[10px] ml-0.5 font-medium text-green-600">
                {otpStatusShow}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              type="password"
              required
              className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
            <label className="text-sm text-gray-600 ml-1">Password</label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              type="password"
              required
              className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
            <label className="text-sm text-gray-600 ml-1">
              Confirm Password
            </label>
          </motion.div>

          <span className="text-center text-xs text-gray-600 block mt-1">
            People who use our service may have <br />
            uploaded your contact information to Instagram. <br />
            <Link
              to="/siginInlearnMore"
              className="text-cyan-700 underline hover:text-cyan-800"
            >
              Learn More
            </Link>
          </span>

          <motion.button
            type="submit"
            whileTap={!loading ? { scale: 0.97 } : undefined}
            whileHover={!loading ? { scale: 1.03 } : undefined}
            className="signup-btn w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold mt-5 py-2 rounded-md transition shadow"
          >
            {loading ? 'Processing...' : 'Sign up'}
          </motion.button>

          <section className="my-5 py-5 text-center">
            <p className="text-xs font-medium text-gray-600">Have an account?</p>
            <Link
              to="/login"
              className="text-xs text-cyan-700 font-bold hover:text-cyan-800 transition"
            >
              Log in
            </Link>
          </section>
        </form>
      </motion.div>

      <p className="text-xs md:mt-10 text-gray-500">© 2025 GramHub from Meta</p>
      {loading && <Loader size="lg" />}
    </div>
  );
};

export default Register;
