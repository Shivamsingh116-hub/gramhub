import React, { useState, useRef, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { AVATAR_SIZE_LIMIT } from '../../utils/constants/ImageSizes';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const AvatarUploader = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const { setPopupModal, setModalMessage } = useContext(Context)
    const [avatar, setAvatar] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarURL);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSelectavatar = (e) => {
        const file = e.target.files[0];
        if (!(file.type.startsWith('image/'))) {
            setModalMessage("Select an image file");
            setPopupModal(true);
            return
        }
        if (file) {
            if (avatarUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
            const localUrl = URL.createObjectURL(file);
            setAvatar(file);
            setAvatarUrl(localUrl);
        } else {
            setAvatar(null);
            setAvatarUrl(currentUser.avatarURL);
        }
    };
    console.log(currentUser)
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
            const { data: sigData } = await axiosInstance.post('/upload/get-upload-signature');
            console.log(sigData)
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
            console.log(uploadRes.data)
            await axiosInstance.put('/upload/update-profile-photo', {
                imageUrl: secureUrl
            });

            setAvatarUrl(secureUrl);
            setCurrentUser({ ...currentUser, avatarURL: secureUrl });
            setModalMessage("Uploaded successfully");
            setPopupModal(true);
            resetFileInput();
            setAvatar(null);
            navigate('/profile')
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
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    return (
        <div className="fixed inset-0  backdrop-blur-sm z-50 flex flex-col justify-center items-center gap-3">
            <button type='button' disabled={loading} onClick={() => navigate('/profile')}
                className={`${loading ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}
                fixed border rounded-full text-black bg-white  hover:bg-black
                 hover:text-white md:top-10 top-8 right-8 md:right-14 
                  hover:scale-115 transition-all transition-normal duration-100`}><CloseOutlinedIcon /></button>
            <div className="relative w-48 h-48 rounded-full md:w-64 md:h-64 border-2 border-gray-300 shadow-sm overflow-hidden group transition-all duration-200">
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
                |{loading && <Loader size='md' />}
            </div>
            <div className='flex justify-around mt-5 gap-8 md:gap-16'>
                <label
                    htmlFor="avatarUpload"
                    tabIndex={0}
                    role="button"
                    aria-label="Upload Avatar"
                    className={`w-24 h-10 flex items-center justify-center gap-1  text-sm rounded-md font-medium border transition duration-150 ease-in-out ${loading
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}                >
                    <EditOutlinedIcon />
                    Edit
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="avatarUpload"
                        disabled={loading}
                        onChange={handleSelectavatar}
                        className="hidden"

                    />
                </label>
                <button
                    type="button"
                    onClick={handleUploadavatar}
                    disabled={loading}
                    aria-disabled={loading}
                    className={`w-24 h-10  text-sm rounded-md font-medium border transition duration-150 ease-in-out ${loading
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-white hover:text-black hover:border-black'
                        }`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div >
    );
};

export default AvatarUploader;
