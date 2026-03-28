import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import SaveButton from './SaveButton'
import CommentBox from './CommentBox'
import FollowButton from './FollowButton'
import { trackView } from '../api/feedApi'

function ArtworkCard({ card, userId }) {
    const navigate = useNavigate()
    const [commentCount, setCommentCount] = useState(card.comment_count ?? 0)
    const artistName = card.artist_name || 'Unknown Artist'
    const imageSrc = Array.isArray(card.image_url) ? card.image_url[0] : card.image_url
    const profileImage = card.artist_profile_image
    const cardRef = useRef(null)

    useEffect(() => {
        setCommentCount(card.comment_count ?? 0)
    }, [card.comment_count])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    trackView('artwork', card.id, userId)
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
                    {artistName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className='flex-1'>
                    <p className='text-sm font-semibold text-stone-800 dark:text-gray-100'>
                        {artistName}
                    </p>
                    <p className='text-xs text-stone-400 dark:text-gray-500'>
                        {new Date(card.created_at).toLocaleDateString()}
                    </p>
                </div>
                <FollowButton artistId={card.artist_id} />
            </div>
            {/*Image*/}
            <div className='aspect-square overflow-hidden bg-stone-900'>
                <img
                    src={imageSrc}
                    alt={card.description}
                    className='h-full w-full object-contain'
                    onError={(e) => e.target.src = 'https://placehold.co/600x400'}
                />
            </div>

            {/*Actions*/}
            <div className='flex items-center px-3.5 pt-2.5 pb-1.5 gap-4'>
                <LikeButton
                    targetType="artwork"
                    targetId={card.id}
                    initialCount={card.like_count}
                    initialLiked={card.is_liked_by_me}
                    userId={userId}
                />
                <button className='flex items-center gap-1.5 text-stone-600 dark:text-gray-400'>
                    <svg width='20' height='20' viewBox="0 0 24 24" fill='none'
                        stroke='currentColor' strokeWidth="1.8" strokeLinecap='round' strokeLinejoin='round'>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className='text-sm'>{commentCount}</span>
                </button>
                <SaveButton
                    targetType="artwork"
                    targetId={card.id}
                    initialSaved={card.is_saved}
                    userId={userId}
                />
            </div>

            {/*Caption*/}
            <div className="px-3.5 pb-2">
                {card.title && (
                    <p className="text-sm font-semibold text-stone-900 dark:text-gray-100">
                        {card.title}
                    </p>
                )}
                <p className="text-sm text-stone-700 dark:text-gray-300 mt-0.5 leading-snug">
                    {card.description}
                </p>
            </div>
            {/*Comment Box - only show when click the comment button, for simplicity we always show it here*/}
            <CommentBox
                targetType="artwork"
                targetId={card.id}
                userId={userId}
                onCommentCountChange={setCommentCount}
            />

            {/*Price + Buy — ONLY on artwork cards*/}
            <div className="flex items-center justify-between px-3.5 py-3 border-t border-stone-100 dark:border-gray-700">
                <span className="text-base font-bold text-stone-900 dark:text-gray-100">
                    LKR. {Number(card.price).toLocaleString()}
                </span>
                <button
                    onClick={() => navigate(`/artwork/${card.id}`)}
                    className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white text-sm font-semibold
                                    px-6 py-2.5 rounded-full active:bg-amber-800 transition-colors">
                    Buy
                </button>
            </div>
        </div>
    )
}

export default ArtworkCard