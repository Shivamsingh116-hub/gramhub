import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../context/Context'
import axiosInstance from '../utils/axiosInstance'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Create = () => {
  const [post, setPost] = useState(null)
  const [postURL, setPostURL] = useState(null)
  const [caption, setCaption] = useState('')
  const [imageError, setImageError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { setModalMessage, setPopupModal, setRecentPostUploadData } = useContext(Context)
  const { fetchRandomPost } = useContext(AuthContext)

  useEffect(() => {
    return () => {
      if (postURL?.startsWith('blob:')) {
        URL.revokeObjectURL(postURL)
      }
    }
  }, [postURL])
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to trigger the alert
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUploading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      resetUpload()
      setImageError('No image/video selected')
      return
    }

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (isVideo) {
      resetUpload()
      setImageError('Currently video uploading feature not available')
      return
    }
    if (!isImage) {
      resetUpload()
      setImageError('Please select an image or video file')
      return
    }

    if (postURL?.startsWith('blob:')) {
      URL.revokeObjectURL(postURL)
    }

    setPost(file)
    setPostURL(URL.createObjectURL(file))
    setImageError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange({ target: { files: [file] } })
  }

  const resetUpload = () => {
    setPost(null)
    setPostURL(null)
    setCaption('')
    setUploadProgress(0)
    setImageError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadPost = async (e) => {
    e.preventDefault()

    if (!post) {
      setImageError('No file selected')
      return
    }

    const isImage = post.type.startsWith('image/')
    const isVideo = post.type.startsWith('video/')
    const folder = isImage ? 'image' : isVideo ? 'video' : 'other'

    setIsUploading(true)
    try {

      const { data: sigData } = await axiosInstance.post('/upload/get-post-upload-signature', {
        folder,
        contentType: post.type,
      })

      const formData = new FormData()
      Object.entries(sigData.fields).forEach(([key, value]) => {
        formData.append(key, value)
      })
      formData.append('file', post)

      const { data: uploadUrlRes } = await axios.post(sigData.uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total)
          setUploadProgress(percent)
        },
      })

      const { data: uploadPostRes } = await axiosInstance.post('/upload/post', {
        fileUrl: uploadUrlRes?.secure_url,
        public_id: uploadUrlRes?.public_id,
        caption: caption
      })

      const message = uploadPostRes?.message || "Upload successful"
      const postData = uploadPostRes?.postData
      setRecentPostUploadData(postData)
      setModalMessage(message)
      setPopupModal(true)
      fetchRandomPost(null, true)
      navigate('/')
    } catch (err) {
      console.error(err)
      setModalMessage('Upload failed. Please try again.')
      setPopupModal(true)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-blue-50 to-cyan-50">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleUploadPost}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`px-5 py-12 ${post ? 'mt-16' : 'mt-40'} gap-4 md:border border-cyan-200 md:shadow-md flex flex-col rounded-xl bg-transparent md:bg-white`}
        >
          <h2 className="text-xl font-semibold text-center mb-2 text-cyan-700">Create Post</h2>

          {imageError && <span className="text-rose-500 text-sm">{imageError}</span>}

          <label
            htmlFor="postUpload"
            className="cursor-pointer select-none self-center bg-cyan-600 text-white hover:bg-cyan-700 
            border border-cyan-600 hover:border-cyan-700 transition-all duration-150 px-5 py-2 rounded-md font-medium text-sm"
          >
            {post ? 'Change File' : 'Upload Media'}
            <input disabled={isUploading} id="postUpload" ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
          </label>

          {postURL && post?.type.startsWith('image/') && (
            <img src={postURL} className="w-full object-contain max-h-64 rounded-md" alt="preview" />
          )}

          {postURL && post?.type.startsWith('video/') && (
            <video src={postURL} className="w-full object-contain max-h-64 rounded-md" controls preload="metadata" />
          )}

          <textarea
            className="border border-cyan-200 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="Write a caption (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {isUploading && (
            <div className="w-full bg-cyan-100 rounded-full h-2">
              <div
                className="bg-cyan-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            {post && !isUploading && (
              <button
                type="button"
                className="text-rose-500 text-sm underline"
                onClick={resetUpload}
              >
                Cancel Upload
              </button>
            )}
            {post && (
              <button
                type="submit"
                disabled={isUploading}
                className={`py-1 px-4 font-medium border rounded-md transition-all duration-150 
                  ${isUploading
                    ? 'bg-cyan-100 text-cyan-400 cursor-not-allowed'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
