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
        <div className='min-h-screen bg-stone-50 dark:bg-gray-950 md:flex transition-colors duration-200'>
            <div className='flex-1 pt-6'>
                <div className='mx-auto max-w-[470px]'>
                    {/*Error message*/}
                    {error && (
                        <div className="mx-4 my-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800
                            rounded-lg text-sm text-red-600 dark:text-red-400">
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
                        <div className="text-center py-16 text-stone-400 dark:text-gray-500 text-sm">
                            No Post yet
                        </div>
                    )}

                    {/*Load more Button*/}
                    {loadMoreError && (
                        <div className="mx-4 my-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800
                            rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
                            {loadMoreError}
                        </div>
                    )}
                    {hasNext && !loading && (
                        <div className="flex justify-center py-6">
                            <button
                                onClick={loadMore}
                                className="bg-stone-800 dark:bg-gray-700 hover:dark:bg-gray-600 text-white text-sm font-medium
                               px-8 py-2.5 rounded-full transition-colors"
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