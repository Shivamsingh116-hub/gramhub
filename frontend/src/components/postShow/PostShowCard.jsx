import React, { useContext, useEffect, useRef, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import LikeBtn from '../../utils/buttons/LikeBtn';
import CommentBtn from '../../utils/buttons/CommentBtn';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { AuthContext } from '../../context/AuthContext';
const PostShowCard = ({ postData, setIsPostShow }) => {
    const [postComments, setPostComments] = useState(postData.comments)
    const containerRef = useRef(null)
    const { currentUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    if (!postData) return null;
    const {
        details,
        image,
        createdAt,
        _id,
        userId,
        likes = [],
        comments = [],
    } = postData;
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => document.body.style.overflow = ''
    })
    const formattedDate = new Date(createdAt).toLocaleString();
    const handleDelete = async () => {

        setLoading(true)
        try {
            await axiosInstance.delete(`/delete/post/${_id}`);
            window.location.reload()
            setIsPostShow(false);

        } catch (error) {
            console.error('Error deleting post:', error);
            alert("Failed to delete the post. Please try again.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='fixed flex justify-center items-center inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-100 z-50'>
            <button
                className='fixed top-6 right-6 md:top-6 md:right-10 hover:cursor-pointer text-gray-600 hover:text-red-500 text-xl font-bold'
                onClick={() => setIsPostShow(false)}
            >
                <CloseOutlinedIcon />
            </button>
            <div ref={containerRef} className=' bg-transparent md:shadow-xl rounded-lg overflow-hidden w-full max-w-md p-6 '>


                {/* Post Image */}
                <img
                    src={image?.url}
                    alt='Post'
                    className='w-full h-64 object-cover rounded-md'
                />

                {/* Post Details */}
                <div className='mt-4 flex flex-col'>
                    <p className='text-gray-800 text-sm'>{details}</p>


                    <div className='mt-2 flex flex-col justify-between text-sm'>
                        <LikeBtn likes={likes} postId={_id} />
                    </div>
                    <CommentBtn postComments={postComments} setPostComments={setPostComments} postId={postData._id} />
                    <div className='mt-2 self-end  text-xs text-gray-500'>
                        <span>Posted on: {formattedDate}</span>
                        {currentUser?._id === userId && <button
                            onClick={handleDelete}
                            className={`relative ml-2 ${loading ? "bg-transparent" : ''} hover:text-red-600 transition`}
                            title="Delete Post"
                            disabled={loading}
                        >
                            <DeleteIcon />
                            {loading && <Loader size='sm' />}
                        </button>}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostShowCard;
