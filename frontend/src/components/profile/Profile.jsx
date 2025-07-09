import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import AvatarUploader from './AvtarUploader';
import UserInfoCard from './UserInfoCard';
import LogoutButton from '../../utils/LogOutButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { useState } from 'react';
import { useEffect } from 'react';

const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false)
    const { setPopupModal, setModalMessage } = useContext(Context);
    const avatarURL = currentUser?.avatarURL
    const navigate = useNavigate()
    useEffect(() => {
        if (!avatarURL) return;

        setImageLoaded(false);
        setImageError(false);

        const img = new Image();
        img.src = avatarURL;

        if (img.complete) {
            // If already loaded from cache
            setImageLoaded(true);
        } else {
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
        }

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [avatarURL]);

    console.log(imageLoaded, imageError)
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md relative mx-auto p-6 mt-12 bg-white md:shadow-xl rounded-2xl md:border border-gray-100">
            <h2 className="text-3xl  font-semibold text-gray-800 mb-4 text-center">ᴘʀᴏꜰɪʟᴇ</h2>

            <div className=" flex px-5 flex-col  gap-4">
                <div tabIndex={0} className='self-center relative w-32 h-32 box-border overflow-hidden rounded-full' role='button' onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ' ') {
                        navigate('/avatar-uploader')
                    }
                }} onClick={() => navigate('/avatar-uploader')}>
                    {avatarURL && !imageError && (
                        <img
                            src={avatarURL}
                            alt="Avatar"
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() =>
                                setImageLoaded(true)
                            }
                            onError={() => setImageError(true)}
                        />
                    )}

                    {/* Fallback if image fails or not available */}
                    {(!avatarURL || imageError) && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xl font-semibold">
                            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                    {!imageLoaded && avatarURL && !imageError && <Loader size='sm' />}
                </div>
                <UserInfoCard
                    username={currentUser.username}
                    email={currentUser.email}
                    name={currentUser.name}
                    bio={currentUser.bio}
                    gender={currentUser.gender}
                />
                <div className='flex flex-row gap-10 '>
                    <button className='flex-1 py-2.5 bg-black transition-all transition-normal duration-100 hover:cursor-pointer text-white hover:bg-white border hover:text-black font-medium text-xs' type='button' onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                    <button onClick={() => {
                        setModalMessage("Project is in process")
                        setPopupModal(true)
                    }} className='flex-1 py-2.5 bg-white transition-all transition-normal duration-100 hover:cursor-pointer hover:bg-black border hover:text-white font-medium text-xs'>Share Profile</button>
                </div>
                <LogoutButton setCurrentUser={setCurrentUser} />
            </div>
        </div>
    );
};

export default Profile;
