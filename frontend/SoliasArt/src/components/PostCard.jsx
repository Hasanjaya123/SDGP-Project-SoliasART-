import { useRef, useEffect } from 'react'
import LikeButton from './LikeButton'
import SaveButton from './SaveButton'
import CommentBox from './CommentBox'
import FollowButton from './FollowButton'
import { trackView } from '../api/feedApi'

function PostCard({ card, userId }) {
    const imageSrc = Array.isArray(card.image_url) ? card.image_url[0] : card.image_url
    const artistName = card.artist_name || 'Artist'
    const profileImage = card.artist_profile_image
    const cardRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    trackView('post', card.id, userId)
                    observer.unobserve(cardRef.current)
                }
            },
            { threshold: 0.5 } // Track when 50% of card is visible
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [card.id, userId])

    return (
        <div ref={cardRef} className='mx-4 mb-5 overflow-hidden rounded-2xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm md:mx-0'>
            <div className='flex items-center px-3.5 py-3 gap-2.5'>
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={artistName}
                        className='w-9 h-9 rounded-full object-cover flex-shrink-0 bg-stone-200 dark:bg-gray-700'
                        onError={(e) => e.target.style.display = 'none'}
                    />
                ) : null}
                <div className={`w-9 h-9 rounded-full bg-stone-200 dark:bg-gray-700 flex items-center justify-center text-stone-700 dark:text-gray-200 font-semibold text-sm flex-shrink-0 ${profileImage ? 'hidden' : ''}`}>
                    {/*get the first letter ofthe name*/}
                    {artistName ? artistName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'AR'}
                </div>

                {/*Name and time*/}
                <div className="flex-1">
                    <p className='text-sm font-semibold text-stone-800 dark:text-gray-100'>
                        {artistName}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-gray-500">
                        {new Date(card.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/*Follow Button*/}
                <FollowButton artistId={card.artist_id} />
            </div>

            {/*Image*/}
            <div className='aspect-square overflow-hidden bg-stone-900'>
                <img
                    src={imageSrc}
                    alt={card.description}
                    className='h-full w-full object-contain'
                    onError={(e) => e.target.src = 'https://placehold.co/600x400'} //image fail to load show placeholder
                />
            </div>

            {/*Actions*/}
            <div className='flex items-center px-3.5 pt-2.5 pb-1.5 gap-4'>
                <LikeButton
                    targetType="post"
                    targetId={card.id}
                    initialCount={card.like_count}
                    initialLiked={card.is_liked_by_me}
                    userId={userId}
                />

                {/*Clicking count just display, ifyou click open the comments*/}
                <button className='flex items-center gap-1.5 text-stone-600 dark:text-gray-400'>
                    <svg
                        width='20' height='20' viewBox="0 0 24 24" fill='none'
                        stroke='currentColor' strokeWidth="1.8" strokeLinecap='round' strokeLinejoin='round'>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className='text-sm'>{card.comment_count}</span>
                </button>

                <SaveButton
                    targetType="post"
                    targetId={card.id}
                    initialSaved={card.is_saved}
                    userId={userId}
                />
            </div>

            {/*Description*/}
            <div className='px-3.5 pb-2'>
                <p className="text-sm text-stone-800 dark:text-gray-100">
                    <span className="font-semibold">{artistName} </span>
                </p>
                <p className="text-sm text-stone-700 dark:text-gray-300 mt-0.5 leading-snug">
                    {card.description}
                </p>
            </div>
            {/*Comments Section*/}
            <CommentBox
                targetType="post"
                targetId={card.id}
                userId={userId}
            />
        </div>
    )
}

export default PostCard