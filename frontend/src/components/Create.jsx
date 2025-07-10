import React, { useContext, useState } from 'react'
import { Context } from '../context/Context'
import axiosInstance from '../utils/axiosInstance'

const Create = () => {
  const [imageError, setImageError] = useState('')
  const [post, setPost] = useState('')
  const [postURL, setPostURL] = useState('')
  const { setModalMessage, setPopupModal } = useContext(Context)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setPost(null);
      setPostURL(null);
      setImageError("No image/video selected")
      return;
    } const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setImageError("Select an image or video file");
      return;
    }
    if (postURL?.startsWith('blob:')) {
      URL.revokeObjectURL(postURL);
    }
    const localURL = URL.createObjectURL(file);
    setPost(file);
    setPostURL(localURL);
    setImageError("");
  }
  const handleUploadPost = async (e) => {
    e.preventDefault()
    if (!post) {
      setImageError("No image selected")
      return
    }
    const isImage = post.type.startsWith('image/')
    const isVideo = post.type.startsWith('video/')
    const folder = isImage ? 'image' : isVideo ? 'video' : 'other'
    try {
      const { data: sigData } = await axiosInstance.post(`/upload/get-post-upload-signature`, { folder })
      console.log(sigData)
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className={`w-full min-h-[100vh] flex flex-col  items-center`}>
      <div className='w-full max-w-md'>
        <form onSubmit={handleUploadPost} className={`px-5 py-12 ${post?"mt-16":"mt-40"}  gap-3 border-gray-200 border shadow-md h-full flex-col flex `}>
          {imageError && <span className='text-red-500 text-sm'>{imageError}</span>}
          <label className='cursor-pointer select-none self-center bg-black
           text-white hover:bg-white hover:text-black 
          border transition-all transition-normal duration-100 px-5 py-2 rounded-md
          hover:cursor-pointer font-medium text-sm ' role="button" htmlFor='postUpload'>
            {post?"ChangeFile":"CreatePost"}
            <input id='postUpload' type='file' onChange={handleFileChange} className='hidden' />
          </label>
          {postURL && post?.type.startsWith('image/') && <img src={postURL} className='w-full object-contain max-h-64' alt='post' />}
          {postURL && post?.type.startsWith('video/') && <video src={postURL} className='w-full object-contain max-h-64' controls alt='post' />}
          {post && <button className='bg-white py-1 font-medium hover:cursor-pointer text-black hover:bg-black hover:text-white border transition-all transition-normal duration-100' type='submit'>Upload</button>}

        </form>
      </div>
    </div>
  )
}

export default Create