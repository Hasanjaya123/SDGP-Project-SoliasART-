import { useState } from 'react'
import { toggleLike } from '../api/feedApi'

function LikeButton({ targetType, targetId, initialCount, initialLiked, userId }) {
    // user liked it and the count of likes
    const [liked, setLiked] = useState(initialLiked);
    const [count, setcount] = useState(initialCount);

    async function handleClick() {
        // update UI immediately for responsiveness
        const newLiked = !liked;
        setLiked(newLiked);
        setcount(newLiked ? count + 1 : count - 1);

        try {
            await toggleLike(targetType, targetId, userId);
        } catch (error) {
            // if backend falls then undo the changes
            setLiked(!newLiked);
            setcount(newLiked ? count - 1 : count + 1);
            console.error('Failed to toggle like:', error);
        }
    }

    return (
        <button onClick={handleClick}
            className="inline-flex items-center gap-1.5 leading-none text-stone-600"
        >
            {/* Heart icon filled red if liked, outline if not liked */}
            <svg
                viewBox="0 0 24 24"
                className="block h-5 w-5 shrink-0"
                fill={liked ? '#e04040' : 'none'}
                stroke={liked ? '#e04040' : 'currentColor'}
                strokeWidth="1.8"
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className='text-sm leading-none'>{count}</span>
        </button>
    )
}

export default LikeButton