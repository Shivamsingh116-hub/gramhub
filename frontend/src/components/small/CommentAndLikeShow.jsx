import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const CommentAndLikeShow = ({ postId, setIsComponent, type }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentRef = useRef(null);

    useEffect(() => {
        if (!type || !postId) return;

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axiosInstance.get(`/get/fetch-comment-or-like/${postId}?type=${type}`);
                setData(res.data?.[type + 's'] || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId, type]);

    if (!type) return null;

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style.overflow = ''
    }, [])
    return (
        <div
            ref={currentRef}
            className="fixed bottom-0 left-0 md:h-[50%] h-[56%] w-full bg-white z-40 
                       rounded-tl-3xl rounded-tr-3xl p-4 shadow-lg flex flex-col"
        >
            {/* Close Button */}
            <div className="flex justify-end mb-2">
                <button className="hover:cursor-pointer" onClick={() => setIsComponent(false)}>
                    <CloseOutlinedIcon fontSize="medium" />
                </button>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2 capitalize">{type}s</h2>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : data.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No {type}s available.</p>
                ) : (
                    <ul className="space-y-2">
                        {type === 'like'
                            ? [...data].reverse().map((like, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-2 border-b pb-1"
                                >
                                    <img
                                        src={like.avatarURL || '/default-avatar.png'}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-gray-700">{like.username}</span>
                                </li>
                            ))
                            : [...data].reverse().map((comment, index) => (
                                <li
                                    key={index}
                                    className="flex items-start space-x-3 border p-2 rounded-md bg-gray-50"
                                >
                                    <img
                                        src={
                                            comment.userId.avatarURL ||
                                            '/default-avatar.png'
                                        }
                                        alt={`${comment.userId.username}'s avatar`}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {comment.userId.username}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {comment.text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CommentAndLikeShow;
