import type {APIClient} from '@wharfkit/antelope'
import type {NameType, PublicKeyType, UInt64Type} from '@wharfkit/antelope'
import type {LinkState} from '../../types'
import {Tools} from '../../types'
import type {ActionNames as ActionType} from '../../contracts/atomictoolsx'

export class ToolsV1APIClient {
    constructor(private client: APIClient) {}

    async get_links(options?: {
        creator?: NameType[]
        claimer?: NameType[]
        public_key?: PublicKeyType
        state?: LinkState[]
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        link_id?: UInt64Type[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'created'
    }) {
        const queryParts = {}

        for (const [key, value] of Object.entries(options || {})) {
            queryParts[key] = String(value)
        }

        const queryParams = Object.keys(queryParts).length
            ? '?' + new URLSearchParams(queryParts).toString()
            : ''

        return this.client.call({
            path: `/atomictools/v1/links${queryParams}`,
            method: 'GET',
            responseType: Tools.GetLinksResponse,
        })
    }

    async get_link(link_id: UInt64Type) {
        return this.client.call({
            path: `/atomictools/v1/links/${link_id}`,
            method: 'GET',
            responseType: Tools.GetLinkResponse,
        })
    }

    async get_link_logs(
        link_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParts = {}

        for (const [key, value] of Object.entries(options || {})) {
            queryParts[key] = String(value)
        }

        const queryParams = Object.keys(queryParts).length
            ? '?' + new URLSearchParams(queryParts).toString()
            : ''

        return this.client.call({
            path: `/atomictools/v1/links/${link_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Tools.ActionLogsResponse,
        })
    }

    async get_config() {
        return this.client.call({
            path: '/atomictools/v1/config',
            method: 'GET',
            responseType: Tools.GetConfigResponse,
        })
    }
}
