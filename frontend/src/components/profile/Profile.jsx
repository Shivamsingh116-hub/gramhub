import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import AvatarUploader from './AvtarUploader';
import UserInfoCard from './UserInfoCard';
import LogoutButton from '../../utils/LogOutButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import FollowersShow from '../small/FollowersShow';
import AllPostShow from '../postShow/AllPostShow';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { setPopupModal, setModalMessage } = useContext(Context);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFollowComponent, setIsFollowComponent] = useState(false);
  const [componentType, setComponentType] = useState(null);
  const avatarURL = currentUser?.avatarURL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!avatarURL) return;
    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    img.src = avatarURL;

    if (img.complete) {
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

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100">
        <p className="text-cyan-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* Profile Card */}
      <div className="max-w-md relative mx-auto p-6 mt-10 md:bg-white bg-transparent md:shadow-xl md:rounded-2xl md:border border-blue-100">
        <h2 className="text-3xl font-semibold text-cyan-700 mb-4 text-center">ᴘʀᴏꜰɪʟᴇ</h2>

        <div className="flex px-5 flex-col gap-4">
          {/* Avatar */}
          <div
            tabIndex={0}
            className="self-center relative w-32 h-32 overflow-hidden rounded-full shadow-md hover:ring-2 ring-cyan-300 transition-all duration-200 cursor-pointer"
            role="button"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/avatar-uploader')}
            onClick={() => navigate('/avatar-uploader')}
          >
            {avatarURL && !imageError ? (
              <img
                src={avatarURL}
                alt="Avatar"
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-cyan-100 text-cyan-700 text-xl font-semibold">
                {currentUser?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            {!imageLoaded && avatarURL && !imageError && <Loader size="sm" />}
          </div>

          {/* Followers/Following */}
          <div className='flex gap-6 text-xs mt-2 self-center'>
            <button onClick={() => {
              setIsFollowComponent(true);
              setComponentType('followers');
            }}>
              <span>{currentUser.followers?.length || '0'}</span>
              <p>{currentUser.followers?.length === 1 ? 'follower' : 'followers'}</p>
            </button>
            <button onClick={() => {
              setIsFollowComponent(true);
              setComponentType('following');
            }}>
              <span>{currentUser.following?.length || '0'}</span>
              <p>{currentUser.following?.length === 1 ? 'following' : 'followings'}</p>
            </button>
            {isFollowComponent && <FollowersShow type={componentType} data={currentUser} setIsComponent={setIsFollowComponent} />}
          </div>

          {/* Info */}
          <UserInfoCard
            username={currentUser.username}
            email={currentUser.email}
            name={currentUser.name}
            bio={currentUser.bio}
            gender={currentUser.gender}
          />

          {/* Buttons */}
          <div className="flex flex-row gap-4">
            <button
              className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-md transition duration-150"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                setModalMessage('Project is in process');
                setPopupModal(true);
              }}
              className="flex-1 py-2.5 bg-white text-cyan-700 border border-cyan-300 hover:bg-cyan-600 hover:text-white text-xs font-medium rounded-md transition duration-150"
            >
              Share Profile
            </button>
          </div>

          {/* Logout */}
          <LogoutButton setCurrentUser={setCurrentUser} />
        </div>
      </div>

      {/* ⬇️ All Posts Section Outside the Card */}
      <div className="max-w-full mx-auto px-4 mt-8 mb-10">
        <h3 className="text-2xl font-semibold text-cyan-700 mb-4 text-center">Your Posts</h3>
        <AllPostShow userId={currentUser._id} />
      </div>
    </>
  );
};

export default Profile;
