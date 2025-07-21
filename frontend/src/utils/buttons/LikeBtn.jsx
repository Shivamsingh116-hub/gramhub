import React, { useContext, useRef, useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import axiosInstance from '../axiosInstance'
import { AuthContext } from '../../context/AuthContext'
import CommentAndLikeShow from '../../components/small/CommentAndLikeShow'
import useClickOutsideMulti from '../reuseHooks/UseClickOutside'
import { AnimatePresence, motion } from 'framer-motion'

const LikeBtn = ({ likes, postId }) => {
    const { currentUser } = useContext(AuthContext)
    const [likeCount, setLikeCount] = useState(likes.length)
    const [isLiked, setIsLiked] = useState(likes.includes(currentUser._id))
    const [loading, setLoading] = useState(false)
    const [isComponentShow, setIsComponentShow] = useState(false)
    const [error, setError] = useState('')
    const likeListRef = useRef(null)

    const handleLike = async () => {
        if (loading) return
        setLoading(true)
        try {
            const res = await axiosInstance.put(`/update/likes/${postId}`)
            const updatedLikes = res.data.likes
            setLikeCount(updatedLikes.length)
            setIsLiked(updatedLikes.includes(currentUser._id))
            setError('')
        } catch (err) {
            console.error('Failed to like post:', err)
            setError('Failed to like. Try again.')
        } finally {
            setLoading(false)
        }
    }

    useClickOutsideMulti([likeListRef], () => setIsComponentShow(false))

    return (
        <div className="flex flex-row items-center gap-1 relative">
            {/* Like Button */}
            <motion.button
                disabled={loading}
                onClick={handleLike}
                title={isLiked ? 'Unlike' : 'Like'}
                whileTap={{ scale: 0.8 }}
                className="transition-transform duration-300 transform focus:outline-none"
            >
                <motion.div
                    key={isLiked} // triggers animation on toggle
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                        scale: [1.2, 1.4, 1],
                        opacity: [0.5, 1],
                    }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                    }}
                >
                    {isLiked ? (
                        <FavoriteIcon className="text-red-500" />
                    ) : (
                        <FavoriteBorderOutlinedIcon className="text-gray-600" />
                    )}
                </motion.div>
            </motion.button>

            {/* Like Count */}
            <button
                disabled={loading}
                onClick={() => setIsComponentShow(true)}
                className="text-sm text-gray-700 hover:underline focus:outline-none"
                title="View who liked this"
            >
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>

            {/* Error message */}
            {error && (
                <p className="absolute top-full mt-1 text-xs text-red-500">{error}</p>
            )}

            {/* Modal for like list */}
            <AnimatePresence>
                {isComponentShow && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-transparent bg-opacity-30 backdrop-blur-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsComponentShow(false)}
                        />

                        <motion.div
                            ref={likeListRef}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg max-h-[50vh] overflow-y-auto p-4 rounded-t-md"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                        >
                            <CommentAndLikeShow
                                postId={postId}
                                setIsComponent={setIsComponentShow}
                                type="like"
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LikeBtn
