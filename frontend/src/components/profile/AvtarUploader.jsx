import React, { useState, useRef, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { AVATAR_SIZE_LIMIT } from '../../utils/constants/ImageSizes';

const AvatarUploader = ({ currentUser, setCurrentUser, setPopupModal, setModalMessage }) => {
    const [avatar, setAvatar] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarURL);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSelectavatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (avatarUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
            const localUrl = URL.createObjectURL(file);
            setAvatar(file);
            setAvatarUrl(localUrl);
        } else {
            setAvatar(null);
            setAvatarUrl(currentUser.image);
        }
    };

    const resetFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUploadavatar = async () => {
        if (!avatar) {
            setModalMessage("No image selected");
            setPopupModal(true);
            return;
        }
        if (avatar.size > AVATAR_SIZE_LIMIT.inBytes) {
            setModalMessage(`Image too large. Max ${AVATAR_SIZE_LIMIT.label} allowed.`);
            setPopupModal(true);
            return;
        }

        setLoading(true);
        try {
            const { data: sigData } = await axiosInstance.post('/upload/get-upload-signature', {
                id: currentUser.id
            });

            const formData = new FormData();
            formData.append('file', avatar);
            formData.append('api_key', sigData.apiKey);
            formData.append('timestamp', sigData.timestamp);
            formData.append('upload_preset', sigData.uploadPreset);
            formData.append('signature', sigData.signature);
            formData.append('folder', sigData.folder);
            formData.append('public_id', sigData.public_id);
            formData.append('overwrite', sigData.overwrite);

            const uploadRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
                formData
            );

            const secureUrl = uploadRes.data.secure_url;

            await axiosInstance.put('/upload/update-profile-photo', {
                imageUrl: secureUrl,
                id: currentUser.id
            });

            setAvatarUrl(secureUrl);
            setCurrentUser({ ...currentUser, avatarURL: secureUrl });
            setModalMessage("Uploaded successfully");
            setPopupModal(true);
            resetFileInput();
            setAvatar(null);
        } catch (e) {
            console.log(e);
            setModalMessage(e?.message === "Network Error" ? "Network Error" : "Upload failed. Please try again.");
            setPopupModal(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (avatarUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-full border-2 border-gray-300 shadow-sm overflow-hidden group transition-all duration-200">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarUrl(null)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-4xl font-semibold">
                        {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    id="avatarUpload"
                    disabled={loading}
                    onChange={handleSelectavatar}
                    className="hidden"
                   
                />

                <label
                    htmlFor="avatarUpload"
                    tabIndex={0}
                    role="button"
                    aria-label="Upload Avatar"
                    className="absolute bottom-0 left-0 right-0 bg-gray-400 bg-opacity-60 text-white text-center py-1 text-sm opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                    <EditOutlinedIcon fontSize="small" />
                </label>

                {loading && <Loader size='sm' />}
            </div>

            {avatar && (
                <button
                    type="button"
                    onClick={handleUploadavatar}
                    disabled={loading}
                    aria-disabled={loading}
                    className={`px-4 py-1.5 text-sm rounded-md font-medium border transition duration-150 ease-in-out ${loading
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-white hover:text-black hover:border-black'
                        }`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            )}
        </div>
    );
};

export default AvatarUploader;
