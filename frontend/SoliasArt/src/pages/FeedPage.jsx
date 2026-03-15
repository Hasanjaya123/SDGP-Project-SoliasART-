import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeed } from '../api/feedApi'
import PostCard from '../components/PostCard'
import ArtworkCard from '../components/ArtworkCard'
import Sidebar from '../components/Nav-bar'
import { getUserIdFromToken } from '../utils/auth'

const FALLBACK_USER_ID = '8c2a0157-8f91-44d6-8ad1-8599ff33bd0c'

function FeedPage() {
    const currentUserId = getUserIdFromToken() || FALLBACK_USER_ID

    // State for the list of cards
    const [feedData, setFeedData] = useState([])

    // State for loading - waiting for backend
    const [loading, setLoading] = useState(true)

    // state for error - stores error message if something goes wrong
    const [error, setError] = useState(null)

    // state for pagination
    const [page, setPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [loadMoreError, setLoadMoreError] = useState(null)

    // Fetch feed data from backend
    useEffect(() => {
        loadFeed()
    }, [])

    async function loadFeed(pageNum = 1) {
        setLoading(true)
        setLoadMoreError(null)
        if (pageNum === 1) {
            setError(null)
        }

        try {
            const response = await getFeed(pageNum, currentUserId)

            // response.data.cards is the array of post/artwork cards
            const data = response.data

            if (pageNum === 1) {
                setFeedData(data.cards)
            } else {
                // add to existing cards
                setFeedData(prev => [...prev, ...data.cards])
            }
            setHasNext(data.has_next)
            setPage(pageNum)
        } catch (err) {
            if (pageNum === 1) {
                setError('Could not load feed. Is your backend running?')
            } else {
                setLoadMoreError('Failed to load more. Please try again.')
            }
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    function loadMore() {
        loadFeed(page + 1)
    }

    return (
        <div className='min-h-screen bg-stone-50 md:flex'>
            <div className='hidden md:block md:shrink-0'>
                <Sidebar />
            </div>

            <div className='flex-1'>
                <div className='mx-auto max-w-[470px]'>
                    <div className='px-4 py-4'>
                        <div className='rounded-[26px] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]'>
                            <div className='flex items-start gap-3'>
                                <img
                                    src='https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                                    alt='User avatar'
                                    className='h-12 w-12 rounded-full object-cover'
                                />
                                <div className='min-w-0 flex-1'>
                                    <Link
                                        to='/posts/create'
                                        className='block text-[28px] font-medium tracking-[-0.03em] text-slate-500 transition hover:text-slate-700'
                                    >
                                        What&apos;s Happening?
                                    </Link>
                                </div>
                            </div>

                            <div className='mt-6 flex items-center justify-between'>
                                <Link
                                    to='/posts/create'
                                    className='flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-stone-100 hover:text-slate-700'
                                    aria-label='Add photo'
                                >
                                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                        <rect x='3' y='5' width='18' height='14' rx='2' ry='2' />
                                        <circle cx='8.5' cy='10.5' r='1.5' />
                                        <path d='M21 16l-5.5-5.5L7 19' />
                                    </svg>
                                </Link>

                                <Link
                                    to='/posts/create'
                                    className='inline-flex min-w-24 items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-base font-bold leading-none no-underline shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300'
                                    style={{ color: '#ffffff' }}
                                >
                                    Post
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/*Error message*/}
                    {error && (
                        <div className="mx-4 my-3 p-3 bg-red-50 border border-red-200
                            rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    {/*Feed cards*/}
                    {feedData.map(card => {
                        // check the type and show the right component
                        if (card.type === 'artwork') {
                            return (
                                <ArtworkCard
                                    key={card.id}
                                    card={card}
                                    userId={currentUserId}
                                />
                            )
                        } else {
                            return (
                                <PostCard
                                    key={card.id}
                                    card={card}
                                    userId={currentUserId}
                                />
                            )
                        }
                    })}
                    {/*Loading spinner*/}
                    {loading && (
                        <div className='flex justify-center py-8'>
                            <div className="w-6 h-6 border-2 border-amber-600
                                  border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/*Empty state*/}
                    {!loading && feedData.length === 0 && !error && (
                        <div className="text-center py-16 text-stone-400 text-sm">
                            No Post yet
                        </div>
                    )}

                    {/*Load more Button*/}
                    {loadMoreError && (
                        <div className="mx-4 my-2 p-3 bg-red-50 border border-red-200
                            rounded-lg text-sm text-red-600 text-center">
                            {loadMoreError}
                        </div>
                    )}
                    {hasNext && !loading && (
                        <div className="flex justify-center py-6">
                            <button
                                onClick={loadMore}
                                className="bg-stone-800 text-white text-sm font-medium
                               px-8 py-2.5 rounded-full"
                            >
                                Load more
                            </button>
                        </div>
                    )}

                    {/* Bottom padding */}
                    <div className="h-8" />
                </div>
            </div>
        </div>
    )
}

export default FeedPage