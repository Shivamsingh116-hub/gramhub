import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import PostShowCard from '../../components/postShow/PostShowCard';

const ProfileShow = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPostShow, setIsPostShow] = useState(false)
    const [postShowData, setPostShowData] = useState(null)
    useEffect(() => {
        const fetchProfileShowData = async () => {
            try {
                const { data: res } = await axiosInstance.get(`/get/profile-show/${username}`);
                setProfileData(res);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileShowData();
    }, [username]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
                Loading Profile...
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="text-center text-red-500 mt-10">
                Failed to load profile.
            </div>
        );
    }
    const handlePostShow = (current_post) => {
        setIsPostShow(true)
        setPostShowData(current_post)
        console.log(current_post)
    }
    const { user, posts } = profileData;

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* === Profile Header === */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 border-b pb-6 mb-8">
                <img
                    src={user.avatarURL}
                    alt={`${user.username}'s profile picture`}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-300 shadow"
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold">@{user.username}</h2>
                    <p className="text-sm text-gray-600">
                        {user.name || 'No name provided'}
                    </p>
                    {user.gender && (
                        <p className="text-sm mt-0.5 text-gray-500">Gender: {user.gender}</p>
                    )}
                    <p className="mt-3 whitespace-pre-wrap text-gray-700 text-sm">
                        {user.bio || 'No bio available'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Joined on{' '}
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </p>
                </div>
            </div>

            {/* === Posts Grid === */}
            <h3 className="text-xl font-semibold mb-4">Posts ({posts.length})</h3>

            {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            role='button'
                            onClick={() => handlePostShow(post)}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition hover:scale-[1.02] duration-200"
                        >
                            <img
                                src={post.image?.url}
                                alt="Post"
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-3 text-sm text-gray-700">
                                <div className="flex justify-between items-center mb-1">
                                    <span>❤️ {post.likes.length}</span>
                                    <span>💬 {post.comments.length}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isPostShow && <PostShowCard  postData={ postShowData} setIsPostShow={setIsPostShow} />}
        </div>
    );
};

export default ProfileShow;
