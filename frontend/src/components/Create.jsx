import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../context/Context';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Create = () => {
  const [post, setPost] = useState(null);
  const [postURL, setPostURL] = useState(null);
  const [caption, setCaption] = useState('');
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { setModalMessage, setPopupModal, setRecentPostUploadData } = useContext(Context);
  const { fetchRandomPost } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      if (postURL?.startsWith('blob:')) URL.revokeObjectURL(postURL);
    };
  }, [postURL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      resetUpload();
      setImageError('No image selected');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      resetUpload();
      setImageError('Video upload not supported currently.');
      return;
    }

    if (!isImage) {
      resetUpload();
      setImageError('Only image files are allowed.');
      return;
    }

    if (postURL?.startsWith('blob:')) URL.revokeObjectURL(postURL);
    setPost(file);
    setPostURL(URL.createObjectURL(file));
    setImageError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const resetUpload = () => {
    setPost(null);
    setPostURL(null);
    setCaption('');
    setUploadProgress(0);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadPost = async (e) => {
    e.preventDefault();
    if (!post) {
      setImageError('No file selected');
      return;
    }

    setIsUploading(true);
    try {
      const { data: sigData } = await axiosInstance.post('/upload/get-post-upload-signature', {
        folder: 'image',
        contentType: post.type,
      });

      const formData = new FormData();
      Object.entries(sigData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', post);

      const { data: uploadUrlRes } = await axios.post(sigData.uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      const { data: uploadPostRes } = await axiosInstance.post('/upload/post', {
        fileUrl: uploadUrlRes?.secure_url,
        public_id: uploadUrlRes?.public_id,
        caption,
      });

      setRecentPostUploadData(uploadPostRes?.postData);
      setModalMessage(uploadPostRes?.message || 'Upload successful');
      setPopupModal(true);
      fetchRandomPost(null, true);
      navigate('/');
    } catch (err) {
      console.error(err);
      setModalMessage('Upload failed. Try again.');
      setPopupModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-r from-white via-blue-50 to-cyan-100 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleUploadPost}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-md sm:bg-white mt-[-150px] shadow-lg rounded-2xl p-6 md:p-8 border border-cyan-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1
          className="text-2xl font-bold text-center text-cyan-700 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Share a Moment 🌿
        </motion.h1>

        {imageError && (
          <p className="text-sm text-rose-500 text-center mb-2">{imageError}</p>
        )}

        <div className="mb-4 flex justify-center">
          <label
            htmlFor="postUpload"
            className="bg-cyan-600 text-white hover:bg-cyan-700 px-5 py-2 rounded-full text-sm font-medium cursor-pointer"
          >
            {post ? 'Change Image' : 'Upload Image'}
            <input
              id="postUpload"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {postURL && (
          <motion.img
            src={postURL}
            alt="Preview"
            className="rounded-lg mb-4 w-full h-auto max-h-64 object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}

        <input
          type="text"
          placeholder="Write a caption... (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={150}
          className="w-full border border-cyan-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 mb-4"
        />

        {isUploading && (
          <motion.div
            className="w-full bg-cyan-100 rounded-full h-2 overflow-hidden mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-cyan-600 h-2"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </motion.div>
        )}

        <div className="flex justify-between items-center">
          {post && !isUploading && (
            <button
              type="button"
              className="text-sm text-rose-500 underline"
              onClick={resetUpload}
            >
              Cancel
            </button>
          )}
          {post && (
            <button
              type="submit"
              disabled={isUploading}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isUploading
                  ? 'bg-cyan-100 text-cyan-400 cursor-not-allowed'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Post'}
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Create;
