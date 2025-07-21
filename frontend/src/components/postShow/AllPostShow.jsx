import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import PostShowCard from './PostShowCard';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ Added framer-motion

const AllPostShow = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPostData, setCurrentPostData] = useState(null);
    const [isPostShow, setIsPostShow] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchUserPosts = async () => {
            try {
                const res = await axiosInstance.get(`/get/user/post/${userId}`);
                setPosts(res.data || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [userId]);

    const handlePostShow = (post) => {
        setIsPostShow(true);
        setCurrentPostData(post);
    };

    if (loading) {
        return <p className="text-center text-gray-500 mt-4">Loading posts...</p>;
    }

    if (!posts.length) {
        return <p className="text-center text-gray-500 mt-4">No posts found.</p>;
    }

    return (
        <motion.div
            layout
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {posts.map((post) => (
                <motion.div
                    key={post._id}
                    layout
                    role="button"
                    onClick={() => handlePostShow(post)}
                    whileHover={{ scale: 1.02 }} // ✅ Hover effect for UX
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 md:p-4 border rounded-lg shadow bg-white"
                >
                    {/* ✅ Safe access and responsive layout */}
                    {post.image?.url && (
                        <img
                            src={post.image.url}
                            alt="Post"
                            className="w-full h-40 sm:h-60 md:h-72 object-cover rounded-md mb-3"
                        />
                    )}

                    {post?.details && (
                        <p className="text-gray-800 mb-2 hidden md:block">{post.details}</p>
                    )}

                    <div className="hidden md:flex items-center justify-between text-sm text-gray-600">
                        <span>
                            {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
                        </span>
                        <span>
                            {post.comments?.length || 0} {post.comments?.length === 1 ? 'comment' : 'comments'}
                        </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 hidden md:block">
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </motion.div>
            ))}

            <AnimatePresence>
                {isPostShow && (
                    <PostShowCard
                        postData={currentPostData}
                        setIsPostShow={setIsPostShow}
                        layoutId={`post-${currentPostData?._id}`} // ✅ If PostShowCard uses motion
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AllPostShow;
