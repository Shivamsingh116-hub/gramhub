import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import PostShowCard from './PostShowCard';

const AllPostShow = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPostData, setCurrentPostData] = useState(null)
    const [isPostShow, setIsPostShow] = useState(false)
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
        setIsPostShow(true)
        setCurrentPostData(post)
    }
    if (loading) {
        return <p className="text-center text-gray-500 mt-4">Loading posts...</p>;
    }

    if (!posts.length) {
        return <p className="text-center text-gray-500 mt-4">No posts found.</p>;
    }

    return (
        <div className="mt-8  md:gap-6 grid grid-cols-3">
            {posts.map((post) => (
                <div role='button' onClick={() => handlePostShow(post)} key={post._id} className="md:p-4 border md:rounded-lg shadow bg-white">
                    {/* Post Image */}
                    {post.image?.url && (
                        <img
                            src={post.image.url}
                            alt="Post"
                            className="w-full sm:h-72 h-40 object-cover md:rounded-md md:mb-3"
                        />
                    )}

                    {/* Post Details */}
                    {post?.details && <p className="text-gray-800 mb-2 md:block hidden">{post.details}</p>}

                    {/* Likes and Comments */}
                    <div className="md:flex items-center justify-between text-md text-gray-600  hidden">
                        <span>{post.likes?.length || 0} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                        <span>{post.comments?.length || 0} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mt-1 hidden md:block ">
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
            {isPostShow && <PostShowCard postData={currentPostData} setIsPostShow={setIsPostShow} />}
        </div>
    );
};

export default AllPostShow;
