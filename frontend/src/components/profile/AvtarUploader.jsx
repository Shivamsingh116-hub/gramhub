import React, { useState, useRef, useEffect, useContext } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { AVATAR_SIZE_LIMIT } from '../../utils/constants/ImageSizes';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutsideMulti from '../../utils/reuseHooks/UseClickOutside';

const AvatarUploader = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { setPopupModal, setModalMessage } = useContext(Context);
  const [avatar, setAvatar] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarURL);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false); // Fullscreen preview state
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const currentRef = useRef()
  const handleSelectavatar = (e) => {
    const file = e.target.files[0];
    if (!(file?.type?.startsWith('image/'))) {
      setModalMessage("Select an image file");
      setPopupModal(true);
      return;
    }

    if (avatarUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setAvatar(file);
    setAvatarUrl(localUrl);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadavatar = async () => {
    if (!avatar) {
      setModalMessage("No image selected");
      setPopupModal(true);
      return;
    }

    if (avatar.size > AVATAR_SIZE_LIMIT.inBytes) {
      setModalMessage(`Image too large. Max ${AVATAR_SIZE_LIMIT.label} allowed.`);
      setPopupModal(true);
      return;
    }

    setLoading(true);
    try {
      const { data: sigData } = await axiosInstance.post('/upload/get-upload-signature');
      const formData = new FormData();
      formData.append('file', avatar);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('upload_preset', sigData.uploadPreset);
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);
      formData.append('public_id', sigData.public_id);
      formData.append('overwrite', sigData.overwrite);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        formData
      );

      const secureUrl = uploadRes.data.secure_url;
      await axiosInstance.put('/upload/update-profile-photo', {
        imageUrl: secureUrl
      });

      setAvatarUrl(secureUrl);
      setCurrentUser({ ...currentUser, avatarURL: secureUrl });
      setModalMessage("Uploaded successfully");
      setPopupModal(true);
      resetFileInput();
      setAvatar(null);
      navigate('/profile');
    } catch (e) {
      console.error(e);
      setModalMessage(e?.message === "Network Error" ? "Network Error" : "Upload failed. Please try again.");
      setPopupModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  useClickOutsideMulti([currentRef], () => window.history.back())
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-white via-blue-50 to-cyan-100">
      <button
        type='button'
        disabled={loading}
        onClick={() => navigate('/profile')}
        className={`${loading ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}
        fixed top-8 right-8 md:top-10 md:right-14 text-cyan-800 border border-cyan-300 bg-white rounded-full p-2 hover:bg-cyan-600 hover:text-white transition duration-150`}
      >
        <CloseOutlinedIcon fontSize="small" />
      </button>

      {/* Avatar Image with Motion */}
      <motion.div
        layout
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-cyan-300 shadow-sm overflow-hidden group transition-all duration-200 bg-white cursor-pointer"
        whileHover={{ scale: 1.03 }}
        ref={currentRef}
        onClick={() => avatarUrl && setPreview(true)}
      >
        {avatarUrl ? (
          <motion.img
            key={avatarUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={() => setAvatarUrl(null)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cyan-50 text-cyan-600 text-4xl font-semibold">
            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        {loading && <Loader size="md" />}
      </motion.div>

      <div className="flex justify-center mt-5 gap-8 md:gap-16">
        <label
          htmlFor="avatarUpload"
          tabIndex={0}
          role="button"
          aria-label="Upload Avatar"
          className={`w-24 h-10 flex items-center justify-center gap-1 text-sm font-medium border rounded-md transition duration-150 ${loading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white text-cyan-800 border-cyan-500 hover:bg-cyan-600 hover:text-white'
            }`}
        >
          <EditOutlinedIcon fontSize="small" />
          Edit
          <input
            ref={fileInputRef}
            type="file"
            id="avatarUpload"
            disabled={loading}
            onChange={handleSelectavatar}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={handleUploadavatar}
          disabled={loading}
          className={`w-24 h-10 text-sm font-medium border rounded-md transition duration-150 ${loading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-cyan-800 text-white hover:bg-white hover:text-cyan-800 hover:border-cyan-700'
            }`}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* 🔍 Fullscreen Image Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(false)}
          >
            <motion.img
              src={avatarUrl}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarUploader;
