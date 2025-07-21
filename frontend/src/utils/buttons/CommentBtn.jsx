import React, { useContext, useReducer, useRef, useState } from 'react'
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../axiosInstance'
import CommentAndLikeShow from '../../components/small/CommentAndLikeShow'
import useClickOutsideMulti from '../reuseHooks/UseClickOutside'

const CommentBtn = ({ postComments, setPostComments, postId }) => {
    const { currentUser } = useContext(AuthContext)
    const [commentText, setCommentText] = useState('')
    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false)
    const [commentCount, setCommentCount] = useState(postComments.length)
    const commentListRef = useRef(null)
    const inputBoxRef = useRef(null)
    const hasUserCommented = postComments.some(comment => comment.userId === currentUser._id)
    const handleCommentToggle = () => {
        setIsCommentBoxOpen(prev => !prev)
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return

        try {
            const res = await axiosInstance.post(`/update/${postId}/comment`, {
                text: commentText,
            })

            // Update local state
            console.log(res)
            const updatedComments = [...postComments, res.data.comment]
            setPostComments(updatedComments)
            setCommentCount(updatedComments.length)
            setCommentText('')
            setIsCommentBoxOpen(false)
        } catch (err) {
            console.error('Error submitting comment:', err)
        }
    }
    useClickOutsideMulti([commentListRef, inputBoxRef], () => setIsCommentBoxOpen(false))

    return (
        <div className='mt-1 flex flex-col gap-1'>
            <button onClick={handleCommentToggle} className='flex flex-row items-center gap-1'>
                <div>
                    {hasUserCommented ? (
                        <ModeCommentRoundedIcon className='transition duration-200 text-blue-600' />
                    ) : (
                        <ModeCommentOutlinedIcon className='transition duration-200' />
                    )}
                </div>
                <span className='text-sm'>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
            </button>
            {isCommentBoxOpen && <div ref={commentListRef}>
                <CommentAndLikeShow
                    postId={postId}
                    setIsComponent={setIsCommentBoxOpen}
                    type='comment'
                />
            </div>}

            {isCommentBoxOpen && (
                <form
                    onSubmit={handleCommentSubmit}
                    ref={inputBoxRef}
                    className='fixed bottom-0 left-0 w-full bg-white shadow-md z-50 p-3'
                >
                    <div className='mt-2 relative'>
                        <textarea
                            maxLength={100}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder='Write a comment...'
                            className='w-full h-14 border rounded p-[10px] resize-none'
                        />
                        <button
                            type='submit'
                            className='absolute right-3 top-[12px] bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition'
                        >
                            Post
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default CommentBtn
