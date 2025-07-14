import React, { useState } from 'react';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import LikeBtn from '../utils/buttons/LikeBtn';
import CommentBtn from '../utils/buttons/CommentBtn';

const PostCard = ({ postData }) => {
    const [postImageLoaded, setPostImageLoaded] = useState(false);
    const [postImageError, setPostImageError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [postComments, setPostComments] = useState(postData.comments)
    const user = postData?.userId || {};
    const avatarURL = avatarError ? '/default-profile.png' : user?.avatarURL || '/default-profile.png';
    const timestamp = postData.createdAt;
    const navigate = useNavigate()
    const readableDate = new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true  // ensures AM/PM format
    });
  

    return (
        <div className="max-w-md mx-auto bg-white md:rounded-xl md:shadow-sm border border-blue-50 overflow-hidden mb-6">
            {/* Post Header */}
            <div role='button' onClick={() => navigate(`/profile-show/${user.username}`)} className="hover:cursor-pointer flex items-center p-4 bg-blue-50">
                <img
                    src={avatarURL}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-cyan-200"
                    onError={() => setAvatarError(true)}
                />
                <span className="ml-4 font-semibold text-cyan-700">{user?.username || "Unknown User"}</span>
            </div>

            {/* Post Image */}
            <div className="relative min-h-[300px] bg-cyan-50 flex items-center justify-center">
                {postData?.image?.url ? (
                    !postImageError ? (
                        <>
                            <img
                                src={postData.image.url}
                                alt="Post"
                                className={`w-full max-h-[500px] object-cover transition-opacity duration-300 ${postImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setPostImageLoaded(true)}
                                onError={() => setPostImageError(true)}
                            />
                            {!postImageLoaded && <Loader size="md" />}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 absolute inset-0 bg-blue-100">
                            Failed to load image
                        </div>
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-500 text-sm">
                        No image provided
                    </div>
                )}
            </div>

            {/* Caption & Likes */}
            <div className="p-4 bg-white">
                {postData?.details?.trim() && (
                    <p className="text-sm mb-2 text-cyan-700">{postData.details}</p>
                )}
                <LikeBtn likes={postData.likes} postId={postData._id} />
                <CommentBtn postComments={postComments} setPostComments={setPostComments} postId={postData._id} />
            </div>

            {/* Comments */}




            <div className="px-4 pb-4 bg-white">
                <p className='text-xs'>{readableDate}</p>
            </div>
        </div >
    );
};

export default PostCard;
