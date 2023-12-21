export function buildQueryParams(
    params?: {[key: string]: any},
    extra?: {[key: string]: string}
): string {
    const queryParts = extra ? extra : {}

    for (const [key, value] of Object.entries(params || {})) {
        if (['boolean', 'number'].includes(typeof value)) {
            queryParts[key] = value
        } else {
            queryParts[key] = String(value)
        }
    }

    const queryParams = Object.keys(queryParts).length
        ? '?' + new URLSearchParams(queryParts).toString()
        : ''

    return queryParams
}
