import React, { useRef, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import LikeBtn from '../../utils/buttons/LikeBtn';
import CommentBtn from '../../utils/buttons/CommentBtn';
import useClickOutsideMulti from '../../utils/reuseHooks/UseClickOutside';

const PostShowCard = ({ postData, setIsPostShow }) => {
    const [postComments, setPostComments] = useState(postData.comments)
    const containerRef = useRef(null)
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
    const formattedDate = new Date(createdAt).toLocaleString();
    useClickOutsideMulti([containerRef], () => setIsPostShow(false))
    return (
        <div  className='fixed flex justify-center items-center inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-100 z-50'>
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostShowCard;
