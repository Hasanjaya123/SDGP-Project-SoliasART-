import LikeButton from './LikeButton'
import SaveButton from './SaveButton'
import CommentBox from './CommentBox'

function PostCard({ card, userId }) {
    return (
        <div className="bg-white mb-2.5">
            <div className="flex items-center px-3.5 gap-2.5">
                <div className="w-9 h-9 rounded-fully bg-amber-100 flex items-center
                justify-center text-amber-800 font-semibold text-sm flex-shrink-0">
                    {/*get the first letter ofthe name*/}
                    {card.title ? card.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUppercase() : 'AR'}
                </div>

                {/*Name and time*/}
                <div className="flex-1">
                    <p className='text-sm font-semibold text-stone-800'>
                        {card.title || 'Artist'}
                    </p>
                    <p className="text-xs text-stone-400">
                        {new Date(card.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/*Follow Button*/}
                <button className="text-xs font-semibold text-amber-600 border
                                    border-amber-600 rounded-full px-3 py-1">
                    Follow
                </button>
            </div>

            {/*Image*/}
            <div className='bg-stone-900'>
                <img
                    src={card.image_url[0]}
                    alt={card.description}
                    className='w-full object-cover max-h-96'
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
                <button className='flex items-center gap-1.5 text-stone-600'>
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
                <p className="text-sm text-stone-800">
                    <span className="font-semibold">Artist </span>
                    <span className="text-stone-500 text-xs">@artist_handle</span>
                </p>
                <p className="text-sm text-stone-700 mt-0.5 leading-snug">
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