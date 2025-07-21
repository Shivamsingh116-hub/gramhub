import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import PostShowCard from '../../components/postShow/PostShowCard';
import { AuthContext } from '../../context/AuthContext';
import { FollowBtnFunction } from '../../utils/buttons/FollowBtnFunction';
import { Context } from '../../context/Context';
import FollowersShow from '../../components/small/FollowersShow';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBtn from '../../utils/buttons/MessageBtn';

const ProfileShow = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPostShow, setIsPostShow] = useState(false);
    const [postShowData, setPostShowData] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { setPopupModal, setModalMessage } = useContext(Context);
    const [isFollowComponent, setIsFollowComponent] = useState(false);
    const [componentType, setComponentType] = useState(null);
    const [isFollow, setIsFollow] = useState(false);
    const [isProfilePhotoShow, setIsProfilePhotoShow] = useState(false);

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

    useEffect(() => {
        if (profileData && currentUser) {
            const followed = profileData.user.followers.includes(currentUser._id);
            setIsFollow(followed);
        }
    }, [profileData, currentUser]);

    const handleFollowToggle = async () => {
        try {
            const operation = isFollow ? 'pull' : 'addToSet';
            await FollowBtnFunction(profileData.user._id, operation);
            setIsFollow((prev) => !prev);

            setProfileData((prevData) => {
                if (!prevData) return prevData;

                const updatedFollowers = isFollow
                    ? prevData.user.followers.filter((id) => id !== currentUser._id)
                    : [...prevData.user.followers, currentUser._id];

                return {
                    ...prevData,
                    user: {
                        ...prevData.user,
                        followers: updatedFollowers,
                    },
                };
            });
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
            setModalMessage('Action failed. Try again.');
            setPopupModal(true);
        }
    };

    const handlePostShow = (current_post) => {
        setIsPostShow(true);
        setPostShowData(current_post);
    };

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

    const { user, posts } = profileData;

    return (
        <motion.div
            className="max-w-5xl mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* === Profile Header === */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 border-b pb-6 mb-8">
                {user.avatarURL ? (
                    <img
                        onClick={() => setIsProfilePhotoShow(true)}
                        src={user.avatarURL}
                        alt={`${user.username}'s profile picture`}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mt-4 border-2 sm:self-start border-gray-300 shadow"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 mt-4 border-2 sm:self-start border-gray-300 shadow flex items-center justify-center text-4xl font-semibold text-white uppercase">
                        {user.username?.charAt(0) || '?'}
                    </div>
                )}

                <div className="text-center sm:text-left flex flex-col">
                    <h2 className="text-3xl font-bold">@{user.username}</h2>
                    <div className="flex gap-6 text-xs mt-2 self-center sm:self-start">
                        <button>
                            <span>{posts?.length || '0'}</span>
                            <p>{posts?.length === 1 ? 'post' : 'posts'}</p>
                        </button>
                        <button
                            onClick={() => {
                                setIsFollowComponent(true);
                                setComponentType('followers');
                            }}
                        >
                            <span>{user.followers?.length || '0'}</span>
                            <p>{user.followers?.length === 1 ? 'follower' : 'followers'}</p>
                        </button>
                        <button
                            onClick={() => {
                                setIsFollowComponent(true);
                                setComponentType('following');
                            }}
                        >
                            <span>{user.following?.length || '0'}</span>
                            <p>{user.following?.length === 1 ? 'following' : 'followings'}</p>
                        </button>
                        {isFollowComponent && (
                            <FollowersShow
                                type={componentType}
                                data={profileData.user}
                                setIsComponent={setIsFollowComponent}
                            />
                        )}

                    </div>
                    {user.name && (
                        <p className="text-md font-medium mt-1 text-gray-600">
                            {user.name}
                            {user.gender && (
                                <>
                                    {" "}
                                    (
                                    {user.gender === "male"
                                        ? "he/him"
                                        : user.gender === "female"
                                            ? "she/her"
                                            : "they/them"}
                                    )
                                </>
                            )}
                        </p>
                    )}

                    {user.bio && (
                        <p className=" whitespace-pre-wrap text-gray-700 text-sm">{user.bio}</p>
                    )}

                    {profileData?.user?._id !== currentUser?._id && (
                        <div className="flex self-center flex-row gap-4 mt-3 mb-1">
                            <button
                                className="flex w-20 items-center justify-center h-8 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-md transition duration-150"
                                type="button"
                                onClick={handleFollowToggle}
                            >
                                {isFollow ? 'Following' : 'Follow'}
                            </button>
                            <MessageBtn recipient={profileData?.user} />
                        </div>
                    )}

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
            {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-3 gap-[1px] sm:gap-2 bg-white"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                            },
                        },
                    }}
                >
                    <AnimatePresence>
                        {posts.map((post) => (
                            <motion.div
                                key={post._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="aspect-square overflow-hidden cursor-pointer"
                                onClick={() => handlePostShow(post)}
                            >
                                <img
                                    src={post.image?.url}
                                    alt="Post"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {isPostShow && <PostShowCard postData={postShowData} setIsPostShow={setIsPostShow} />}

            <AnimatePresence>
                {isProfilePhotoShow && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfilePhotoShow(false)}
                    >
                        <motion.img
                            src={user.avatarURL}
                            alt="Profile"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfileShow;
