import { useEffect, useState } from 'react'
import { getUserIdFromToken } from '../utils/auth'

const STORAGE_KEY = 'following_artist_ids_by_user'

function readFollowMap() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

function writeFollowMap(map) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    } catch {
        // Ignore storage errors in private/incognito contexts.
    }
}

function readFollowedArtistsForUser(userKey) {
    const map = readFollowMap()
    const ids = map[userKey]
    return Array.isArray(ids) ? ids : []
}

function FollowButton({ artistId }) {
    const userId = getUserIdFromToken()
    const userKey = userId || 'guest'
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        if (!artistId) {
            setIsFollowing(false)
            return
        }

        const followed = readFollowedArtistsForUser(userKey)
        setIsFollowing(followed.includes(String(artistId)))
    }, [artistId, userKey])

    function handleToggleFollow() {
        if (!artistId) return

        const artistKey = String(artistId)
        const followMap = readFollowMap()
        const followed = readFollowedArtistsForUser(userKey)

        let next
        if (followed.includes(artistKey)) {
            next = followed.filter((id) => id !== artistKey)
            setIsFollowing(false)
        } else {
            // Set enforces one follow per artist per user.
            next = [...new Set([...followed, artistKey])]
            setIsFollowing(true)
        }

        followMap[userKey] = next
        writeFollowMap(followMap)
    }

    return (
        <button
            type="button"
            onClick={handleToggleFollow}
            disabled={!artistId}
            className={`text-xs font-semibold border rounded-full px-3 py-1 transition ${isFollowing
                ? 'text-stone-700 border-stone-300 bg-stone-100 hover:bg-stone-200'
                : 'text-amber-600 border-amber-600 hover:bg-amber-50'
                } ${!artistId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    )
}

export default FollowButton
