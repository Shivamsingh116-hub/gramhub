import React, { useContext, useRef, useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import CommentAndLikeShow from '../../components/small/CommentAndLikeShow';
import useClickOutsideMulti from '../reuseHooks/UseClickOutside';
const LikeBtn = ({ likes, postId }) => {
    const { currentUser } = useContext(AuthContext)
    const [likeCount, setLikeCount] = useState(likes.length)
    const [isLiked, setIsLiked] = useState(likes.includes(currentUser._id))
    const [loading, setLoading] = useState(false)
    const [isComponentShow, setIsComponentShow] = useState(false)
    const likeListRef = useRef(null)
    const handleLike = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.put(`/update/likes/${postId}`)
            const updatedLikes = res.data.likes
            setLikeCount(updatedLikes.length)
            setIsLiked(updatedLikes.includes(currentUser._id))
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    useClickOutsideMulti([likeListRef], () => setIsComponentShow(false))

    return (
        <div className='flex flex-row gap-1 items-center'>
            <button disabled={loading} onClick={handleLike} className="transition-transform duration-300 transform hover:scale-110">
                {isLiked ? (
                    <FavoriteIcon className="text-red-500 transition-all duration-300" />
                ) : (
                    <FavoriteBorderOutlinedIcon className="transition-all duration-300" />
                )}
            </button>
            <button disabled={loading} onClick={() => setIsComponentShow(true)} className='text-sm'>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</button>
            {isComponentShow && <div ref={likeListRef}> <CommentAndLikeShow postId={postId} setIsComponent={setIsComponentShow} type='like' /></div>}
        </div>
    )
}

export default LikeBtn