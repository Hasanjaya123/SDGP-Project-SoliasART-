export function getUserIdFromToken() {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const [, payloadBase64] = token.split('.')
        const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
        const payloadJson = atob(padded)
        const payload = JSON.parse(payloadJson)
        return payload?.sub || null
    } catch {
        return null
    }
}