import React, { useContext, useRef, useState } from 'react'
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../axiosInstance'
import CommentAndLikeShow from '../../components/small/CommentAndLikeShow'
import useClickOutsideMulti from '../reuseHooks/UseClickOutside'
import { AnimatePresence, motion } from 'framer-motion'

const CommentBtn = ({ postComments, setPostComments, postId }) => {
    const { currentUser } = useContext(AuthContext)
    const [commentText, setCommentText] = useState('')
    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false)
    const [commentCount, setCommentCount] = useState(postComments.length)
    const [error, setError] = useState('')
    const commentListRef = useRef(null)
    const inputBoxRef = useRef(null)

    const hasUserCommented = postComments.some(comment => comment.userId === currentUser._id)

    const handleCommentToggle = () => {
        setIsCommentBoxOpen(prev => !prev)
        setError('')
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) {
            setError('Comment cannot be empty')
            return
        }

        try {
            const res = await axiosInstance.post(`/update/${postId}/comment`, {
                text: commentText.trim(),
            })

            const updatedComments = [...postComments, res.data.comment]
            setPostComments(updatedComments)
            setCommentCount(updatedComments.length)
            setCommentText('')
            setIsCommentBoxOpen(false)
            setError('')
        } catch (err) {
            console.error('Error submitting comment:', err)
            setError('Failed to post comment. Try again.')
        }
    }

    useClickOutsideMulti([commentListRef, inputBoxRef], () => setIsCommentBoxOpen(false))

    return (
        <div className="mt-1 flex flex-col gap-1">
            <button onClick={handleCommentToggle} className="flex flex-row items-center gap-1">
                <div>
                    {hasUserCommented ? (
                        <ModeCommentRoundedIcon className="transition duration-200 text-blue-600" />
                    ) : (
                        <ModeCommentOutlinedIcon className="transition duration-200" />
                    )}
                </div>
                <span className="text-sm">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
            </button>

            <AnimatePresence>
                {isCommentBoxOpen && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-transparent bg-opacity-30 backdrop-blur-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCommentBoxOpen(false)}
                        />

                        {/* Comment Display */}
                        <motion.div
                            ref={commentListRef}
                            className="fixed inset-x-0 bottom-16 z-50 max-h-[50vh] overflow-y-auto bg-white shadow-lg p-4 rounded-t-lg"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                        >
                            <CommentAndLikeShow
                                postId={postId}
                                setIsComponent={setIsCommentBoxOpen}
                                type='comment'
                            />
                        </motion.div>

                        {/* Input Box */}
                        <motion.form
                            onSubmit={handleCommentSubmit}
                            ref={inputBoxRef}
                            className="fixed bottom-0 left-0 w-full bg-white z-50 px-4 py-3 border-t shadow-md"
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative">
                                <textarea
                                    maxLength={100}
                                    value={commentText}
                                    onChange={(e) => {
                                        setCommentText(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="Write a comment..."
                                    className="w-full h-14 border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-2.5 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    Post
                                </button>
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            </div>
                        </motion.form>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CommentBtn
