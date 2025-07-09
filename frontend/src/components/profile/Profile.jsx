import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import AvatarUploader from './AvtarUploader';
import UserInfoCard from './UserInfoCard';
import LogoutButton from '../../utils/LogOutButton';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { setPopupModal, setModalMessage } = useContext(Context);
    const avatarURL = currentUser?.avatarURL
    const navigate = useNavigate()
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md relative mx-auto p-6 mt-12 bg-white md:shadow-xl rounded-2xl md:border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Profile</h2>

            <div className="flex flex-col items-center gap-4">
                <div tabIndex={0} className='w-28 h-28 box-border overflow-hidden rounded-full' role='button' onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ' ') {
                        navigate('/avatar-uploader')
                    }
                }} onClick={() => navigate('/avatar-uploader')}>
                    {avatarURL ? (
                        <img
                            src={avatarURL}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-4xl font-semibold">
                            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                <UserInfoCard username={currentUser.username} email={currentUser.email} />
                <LogoutButton setCurrentUser={setCurrentUser} />
            </div>
        </div>
    );
};

export default Profile;
