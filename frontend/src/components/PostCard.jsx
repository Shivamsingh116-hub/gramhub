import React, { useState } from 'react';
import Loader from './Loader';

const PostCard = ({ postData }) => {
    const [postImageLoaded, setPostImageLoaded] = useState(false);
    const [postImageError, setPostImageError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const user = postData?.userId || {};
    const comments = postData?.comments || [];
    const likes = postData?.likes || [];
    const avatarURL = avatarError ? '/default-profile.png' : user?.avatarURL || '/default-profile.png';
    const timestamp = postData.createdAt;
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
            <div className="flex items-center p-4 bg-blue-50">
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
                <p className="text-sm font-semibold text-cyan-800">
                    {likes.length} like{likes.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Comments */}

            {comments.length > 0 && (
                <div className="px-4 pb-4 bg-white">
                    {comments.slice(0, 2).map((comment, index) => (
                        <div key={index} className="text-sm text-cyan-700">
                            <span className="font-medium text-cyan-800">
                                {comment?.userId?.username || "Anonymous"}:
                            </span>{" "}
                            <span>{comment?.text || ""}</span>
                        </div>
                    ))}
                    {comments.length > 2 && (
                        <p className="text-cyan-600 text-sm mt-1 cursor-pointer hover:underline">
                            View all {comments.length} comments
                        </p>
                    )}
                </div>
            )}

            <div className="px-4 pb-4 bg-white">
                <p className='text-xs'>{readableDate}</p>
            </div>
        </div >
    );
};

export default PostCard;
