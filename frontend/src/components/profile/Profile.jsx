import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import AvatarUploader from './AvtarUploader';
import UserInfoCard from './UserInfoCard';
import LogoutButton from '../../utils/LogOutButton';

const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { setPopupModal, setModalMessage } = useContext(Context);

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
                <AvatarUploader
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    setPopupModal={setPopupModal}
                    setModalMessage={setModalMessage}
                />
                <UserInfoCard username={currentUser.username} email={currentUser.email} />
                <LogoutButton setCurrentUser={setCurrentUser} />
            </div>
        </div>
    );
};

export default Profile;
