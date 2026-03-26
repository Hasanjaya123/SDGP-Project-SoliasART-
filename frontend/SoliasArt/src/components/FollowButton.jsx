import { useEffect, useState } from 'react'
import { getUserIdFromToken, getAuthToken } from '../utils/auth'
import { checkFollowStatus, unfollowArtist, toggleFollow } from '../api/feedApi'

const FOLLOW_EVENT = 'follow-state-changed'

function FollowButton({ artistId }) {
    const userId = getUserIdFromToken()
    const token = getAuthToken()

    const [isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!userId || !artistId || !token) {
            setIsFollowing(false)
            return
        }

        checkFollowStatus(artistId, token)
            .then(response => setIsFollowing(response.data.is_following))
            .catch(error => console.error('Failed to check follow status:', error))

        // Listen for follow state changes from other FollowButton components
        function handleFollowStateChange(event) {
            const changedArtistId = event.detail?.artistId
            // If this is for the same artist, refresh the status
            if (changedArtistId === String(artistId)) {
                checkFollowStatus(artistId, token)
                    .then(response => setIsFollowing(response.data.is_following))
                    .catch(error => console.error('Failed to sync follow status:', error))
            }
        }

        window.addEventListener(FOLLOW_EVENT, handleFollowStateChange)
        return () => window.removeEventListener(FOLLOW_EVENT, handleFollowStateChange)
    }, [artistId, userId, token])

    async function handleToggleFollow() {
        if (!artistId || !userId || !token || loading) return

        setLoading(true)
        try {
            // Based on current state, either follow or unfollow
            if (isFollowing) {
                // Currently following, so unfollow
                await unfollowArtist(artistId, token)
            } else {
                // Currently not following, so follow
                await toggleFollow(artistId, token)
            }

            // After successful toggle, check the new status to verify
            const response = await checkFollowStatus(artistId, token)
            setIsFollowing(response.data.is_following)

            // Broadcast the change to all other FollowButton components
            const event = new CustomEvent(FOLLOW_EVENT, {
                detail: { artistId: String(artistId), isFollowing: response.data.is_following }
            })
            window.dispatchEvent(event)
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleToggleFollow}
            disabled={!artistId || !userId || loading}
            className={`text-xs font-semibold border rounded-full px-3 py-1 transition ${isFollowing
                ? 'text-stone-700 border-stone-300 bg-stone-100 hover:bg-stone-200'
                : 'text-amber-600 border-amber-600 hover:bg-amber-50'
                } ${(!artistId || !userId || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
        </button>
    )
}

export default FollowButton