import type {APIClient} from '@wharfkit/antelope'
import type {Int32Type, NameType, UInt32Type, UInt64Type} from '@wharfkit/antelope'
import type {ActionNames as ActionType} from '../../contracts/atomicassets'
import {Assets} from '../../types'
import type {OfferState} from '../../types'
import {buildQueryParams} from '../utils'

export class AssetsV1APIClient {
    constructor(private client: APIClient) {}

    async get_assets(
        options?: {
            collection_name?: NameType[]
            schema_name?: NameType[]
            template_id?: Int32Type[]
            burned?: boolean
            owner?: NameType[]
            match?: string
            search?: string
            match_immutable_name?: string
            match_mutable_name?: string
            is_transferable?: boolean
            is_burnable?: boolean
            minter?: NameType[]
            burner?: NameType[]
            initial_receiver?: NameType[]
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
            only_duplicate_templates?: boolean
            has_backed_tokens?: boolean
            authorized_account?: NameType
            template_whitelist?: Int32Type[]
            template_blacklist?: Int32Type[]
            hide_templates_by_accounts?: NameType[]
            hide_offers?: boolean
            asset_id?: UInt64Type[]
            ids?: UInt64Type[]
            lower_bound?: string
            upper_bound?: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?: 'asset_id' | 'minted' | 'updated' | 'transferred' | 'template_mint' | 'name'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicassets/v1/assets${queryParams}`,
            method: 'GET',
            responseType: Assets.GetAssetsResponse,
        })
    }

    async get_asset(asset_id: UInt64Type) {
        return this.client.call({
            path: `/atomicassets/v1/assets/${asset_id}`,
            method: 'GET',
            responseType: Assets.GetAssetResponse,
        })
    }

    async get_asset_stats(asset_id: UInt64Type) {
        return this.client.call({
            path: `/atomicassets/v1/assets/${asset_id}/stats`,
            method: 'GET',
            responseType: Assets.GetAssetStatsResponse,
        })
    }

    async get_asset_logs(
        asset_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/assets/${asset_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Assets.ActionLogsResponse,
        })
    }

    async get_collections(options?: {
        author?: NameType[]
        match?: string
        authorized_account?: NameType
        notify_account?: NameType
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        collection_name?: NameType[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'created' | 'collection_name'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/collections${queryParams}`,
            method: 'GET',
            responseType: Assets.GetCollectionsResponse,
        })
    }

    async get_collection(collection_name: NameType) {
        return this.client.call({
            path: `/atomicassets/v1/collections/${collection_name}`,
            method: 'GET',
            responseType: Assets.GetCollectionResponse,
        })
    }

    async get_collection_stats(collection_name: NameType) {
        return this.client.call({
            path: `/atomicassets/v1/collections/${collection_name}/stats`,
            method: 'GET',
            responseType: Assets.GetCollectionStatsResponse,
        })
    }

    async get_collection_logs(
        collection_name: NameType,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/collections/${collection_name}/logs${queryParams}`,
            method: 'GET',
            responseType: Assets.ActionLogsResponse,
        })
    }

    async get_schemas(options?: {
        collection_name?: NameType[]
        authorized_account?: NameType
        schema_name?: NameType[]
        match?: string
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'created' | 'schema_name' | 'assets'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/schemas${queryParams}`,
            method: 'GET',
            responseType: Assets.GetSchemasResponse,
        })
    }

    async get_schema(collection_name: NameType, schema_name: NameType) {
        return this.client.call({
            path: `/atomicassets/v1/schemas/${collection_name}/${schema_name}`,
            method: 'GET',
            responseType: Assets.GetSchemaResponse,
        })
    }

    async get_schema_stats(collection_name: NameType, schema_name: NameType) {
        return this.client.call({
            path: `/atomicassets/v1/schemas/${collection_name}/${schema_name}/stats`,
            method: 'GET',
            responseType: Assets.GetSchemaStatsResponse,
        })
    }

    async get_schema_logs(
        collection_name: NameType,
        schema_name: NameType,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/schemas/${collection_name}/${schema_name}/logs${queryParams}`,
            method: 'GET',
            responseType: Assets.ActionLogsResponse,
        })
    }

    async get_templates(
        options?: {
            collection_name?: NameType[]
            schema_name?: NameType[]
            issued_supply?: UInt32Type
            min_issued_supply?: UInt32Type
            max_issued_supply?: UInt32Type
            has_assets?: boolean
            max_supply?: UInt32Type
            is_burnable?: boolean
            is_transferable?: boolean
            authorized_account?: NameType
            match?: string
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
            template_id?: Int32Type[]
            ids?: Int32Type[]
            lower_bound?: string
            upper_bound?: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?: 'created' | 'name'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicassets/v1/templates${queryParams}`,
            method: 'GET',
            responseType: Assets.GetTemplatesResponse,
        })
    }

    async get_template(collection_name: NameType, template_id: Int32Type) {
        return this.client.call({
            path: `/atomicassets/v1/templates/${collection_name}/${template_id}`,
            method: 'GET',
            responseType: Assets.GetTemplateResponse,
        })
    }

    async get_template_stats(collection_name: NameType, template_id: Int32Type) {
        return this.client.call({
            path: `/atomicassets/v1/templates/${collection_name}/${template_id}/stats`,
            method: 'GET',
            responseType: Assets.GetTemplateStatsResponse,
        })
    }

    async get_template_logs(
        collection_name: NameType,
        template_id: Int32Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/templates/${collection_name}/${template_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Assets.ActionLogsResponse,
        })
    }

    async get_offers(options?: {
        account?: NameType[]
        sender?: NameType[]
        recipient?: NameType[]
        memo?: string
        match_memo?: string
        state?: OfferState[]
        is_recipient_contract?: boolean
        asset_id?: UInt64Type[]
        template_id?: Int32Type[]
        schema_name?: NameType[]
        collection_name?: NameType[]
        account_whitelist?: NameType[]
        account_blacklist?: NameType[]
        sender_asset_whitelist?: UInt64Type[]
        sender_asset_blacklist?: UInt64Type[]
        recipient_asset_whitelist?: UInt64Type[]
        recipient_asset_blacklist?: UInt64Type[]
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        hide_contracts?: boolean
        hide_empty_offers?: boolean
        offer_id?: UInt64Type
        ids?: UInt64Type
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'created' | 'updated'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/offers${queryParams}`,
            method: 'GET',
            responseType: Assets.GetOffersResponse,
        })
    }

    async get_offer(offer_id: UInt64Type) {
        return this.client.call({
            path: `/atomicassets/v1/offers/${offer_id}`,
            method: 'GET',
            responseType: Assets.GetOfferResponse,
        })
    }

    async get_offer_logs(
        offer_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: ActionType[]
            action_blacklist?: ActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/offers/${offer_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Assets.ActionLogsResponse,
        })
    }

    async get_transfers(options?: {
        account?: NameType[]
        sender?: NameType[]
        recipient?: NameType[]
        memo?: string
        match_memo?: string
        asset_id?: UInt64Type[]
        template_id?: Int32Type[]
        schema_name?: NameType[]
        collection_name?: NameType[]
        hide_contracts?: boolean
        transfer_id?: UInt64Type[]
        ids?: UInt64Type[]
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'created'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/transfers${queryParams}`,
            method: 'GET',
            responseType: Assets.GetTransfersResponse,
        })
    }

    async get_accounts(options?: {
        match_owner?: string
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        burned?: boolean
        hide_offers?: boolean
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        owner?: NameType[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/accounts${queryParams}`,
            method: 'GET',
            responseType: Assets.GetAccountsResponse,
        })
    }

    async get_account(
        account: NameType,
        options?: {
            hide_offers?: boolean
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/accounts/${account}${queryParams}`,
            method: 'GET',
            responseType: Assets.GetAccountResponse,
        })
    }

    async get_account_template_schema_count(account: NameType, collection_name: NameType) {
        return this.client.call({
            path: `/atomicassets/v1/accounts/${account}/${collection_name}`,
            method: 'GET',
            responseType: Assets.GetAccountTemplateSchemaCountResponse,
        })
    }

    async get_burns(options?: {
        match_owner?: string
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        burned?: boolean
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        burned_by_account?: NameType[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/burns${queryParams}`,
            method: 'GET',
            responseType: Assets.GetAccountsResponse,
        })
    }

    async get_account_burns(
        account: NameType,
        options?: {
            hide_offers?: boolean
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicassets/v1/burns/${account}${queryParams}`,
            method: 'GET',
            responseType: Assets.GetAccountBurnsResponse,
        })
    }

    async get_config() {
        return this.client.call({
            path: '/atomicassets/v1/config',
            method: 'GET',
            responseType: Assets.GetConfigResponse,
        })
    }
}
