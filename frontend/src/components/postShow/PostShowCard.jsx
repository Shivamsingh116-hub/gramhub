import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import LikeBtn from '../../utils/buttons/LikeBtn';
import CommentBtn from '../../utils/buttons/CommentBtn';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { AuthContext } from '../../context/AuthContext';

const PostShowCard = ({ postData, setIsPostShow }) => {
    const [postComments, setPostComments] = useState(postData.comments);
    const containerRef = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    if (!postData) return null;

    const {
        details,
        image,
        createdAt,
        _id,
        userId,
        likes = [],
    } = postData;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const formattedDate = new Date(createdAt).toLocaleString();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/delete/post/${_id}`);
            setIsPostShow(false);
            window.location.reload(); // Consider replacing with a better UX flow
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {postData && (
                <motion.div
                    key="post-modal"
                    className="fixed inset-0 z-50 flex justify-center items-center bg-gradient-to-br from-white via-blue-50 to-cyan-100 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => !loading && setIsPostShow(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Close Button */}
                    <motion.button
                        disabled={loading}
                        className="fixed top-6 right-6 md:top-6 md:right-10 text-gray-600 hover:text-red-500 text-xl font-bold z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!loading) setIsPostShow(false);
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        aria-label="Close post preview"
                    >
                        <CloseOutlinedIcon />
                    </motion.button>

                    {/* Modal Container */}
                    <motion.div
                        ref={containerRef}
                        className="sm:bg-white md:shadow-xl rounded-lg overflow-hidden w-full max-w-md p-6 z-40"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Post Image */}
                        {image?.url ? (
                            <motion.img
                                src={image.url}
                                alt="Post"
                                className="w-full max-h-96 object-cover rounded-md"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            />
                        ) : (
                            <motion.div
                                className="w-full h-60 flex items-center justify-center rounded-md bg-cyan-100 text-cyan-700 text-6xl font-bold uppercase"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {postData?.username?.[0]?.toUpperCase() || 'U'}
                            </motion.div>
                        )}

                        {/* Post Details */}
                        <div className="mt-4 flex flex-col">
                            {details && <p className="text-gray-800 text-sm">{details}</p>}

                            <div className="mt-2 flex flex-col justify-between text-sm">
                                <LikeBtn likes={likes} postId={_id} />
                            </div>

                            <CommentBtn
                                postComments={postComments}
                                setPostComments={setPostComments}
                                postId={_id}
                            />

                            <div className="mt-2 self-end text-xs text-gray-500 flex items-center gap-2">
                                <span>Posted on: {formattedDate}</span>
                                {(currentUser?._id === userId ||
                                    currentUser._id === '6872601a54c372d62a8d3494') && (
                                        <button
                                            onClick={handleDelete}
                                            className={`relative ml-2 ${loading ? 'opacity-50' : ''
                                                } hover:text-red-600 transition`}
                                            title="Delete Post"
                                            disabled={loading}
                                        >
                                            <DeleteIcon />
                                            {loading && <Loader size="sm" />}
                                        </button>
                                    )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    );
};

export default PostShowCard;
