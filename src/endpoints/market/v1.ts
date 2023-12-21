import type {APIClient} from '@wharfkit/antelope'
import type {Float64Type, Int32Type, NameType, UInt64Type} from '@wharfkit/antelope'
import type {AuctionState, BuyofferState, OfferState} from '../../types'
import {Market} from '../../types'
import type {ActionNames as SActionType} from '../../contracts/atomicassets'
import type {ActionNames as MActionType} from '../../contracts/atomicmarket'
import {buildQueryParams} from '../utils'

export class MarketV1APIClient {
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
            sort?:
                | 'asset_id'
                | 'minted'
                | 'updated'
                | 'transferred'
                | 'template_mint'
                | 'name'
                | 'suggested_median_price'
                | 'suggested_average_price'
                | 'median_price'
                | 'average_price'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicmarket/v1/assets${queryParams}`,
            method: 'GET',
            responseType: Market.GetAssetsResponse,
        })
    }

    async get_asset(asset_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/assets/${asset_id}`,
            method: 'GET',
            responseType: Market.GetAssetResponse,
        })
    }

    async get_asset_stats(asset_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/assets/${asset_id}/stats`,
            method: 'GET',
            responseType: Market.GetAssetStatsResponse,
        })
    }

    async get_asset_logs(
        asset_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: SActionType[]
            action_blacklist?: SActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/assets/${asset_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Market.ActionLogsResponse,
        })
    }

    async get_asset_sales(
        asset_id: UInt64Type,
        options?: {
            buyer?: NameType[]
            seller?: NameType[]
            symbol?: string
            order?: 'asc' | 'desc'
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/assets/${asset_id}/sales${queryParams}`,
            method: 'GET',
            responseType: Market.GetAssetSalesResponse,
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
            path: `/atomicmarket/v1/offers${queryParams}`,
            method: 'GET',
            responseType: Market.GetOffersResponse,
        })
    }

    async get_offer(offer_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/offers/${offer_id}`,
            method: 'GET',
            responseType: Market.GetOfferResponse,
        })
    }

    async get_offer_logs(
        offer_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: SActionType[]
            action_blacklist?: SActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/offers/${offer_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Market.ActionLogsResponse,
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
            path: `/atomicmarket/v1/transfers${queryParams}`,
            method: 'GET',
            responseType: Market.GetTransfersResponse,
        })
    }

    async get_sale(sale_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/sales/${sale_id}`,
            method: 'GET',
            responseType: Market.GetSaleResponse,
        })
    }

    async get_sale_logs(
        sale_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: MActionType[]
            action_blacklist?: MActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/sales/${sale_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Market.ActionLogsResponse,
        })
    }

    async get_sales_by_templates(
        options: {
            symbol: string
            min_price?: Float64Type
            max_price?: Float64Type
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
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?: 'template_id' | 'price'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicmarket/v1/sales/templates${queryParams}`,
            method: 'GET',
            responseType: Market.GetSalesTemplatesResponse,
        })
    }

    async get_auctions(
        options?: {
            state?: AuctionState[]
            bidder?: NameType[]
            participant?: NameType
            hide_empty_auctions?: boolean
            hide_templates_by_accounts?: NameType[]
            max_assets?: UInt64Type
            min_assets?: UInt64Type
            show_seller_contracts?: boolean
            contract_whitelist?: NameType[]
            seller_blacklist?: NameType[]
            buyer_blacklist?: NameType[]
            asset_id?: UInt64Type[]
            marketplace?: string[]
            maker_marketplace?: string[]
            taker_marketplace?: string[]
            symbol?: string
            account?: NameType[]
            seller?: NameType[]
            buyer?: NameType[]
            min_price?: Float64Type
            max_price?: Float64Type
            min_template_mint?: UInt64Type
            max_template_mint?: UInt64Type
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
            auction_id?: UInt64Type[]
            ids?: UInt64Type[]
            lower_bound?: string
            upper_bound?: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?:
                | 'created'
                | 'updated'
                | 'ending'
                | 'auction_id'
                | 'price'
                | 'template_mint'
                | 'name'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicmarket/v1/auctions${queryParams}`,
            method: 'GET',
            responseType: Market.GetAuctionsResponse,
        })
    }

    async get_auction(auction_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/auctions/${auction_id}`,
            method: 'GET',
            responseType: Market.GetAuctionResponse,
        })
    }

    async get_auction_logs(
        auction_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: MActionType[]
            action_blacklist?: MActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/auctions/${auction_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Market.ActionLogsResponse,
        })
    }

    async get_buyoffers(
        options?: {
            state?: BuyofferState[]
            max_assets?: UInt64Type
            min_assets?: UInt64Type
            show_seller_contracts?: boolean
            contract_whitelist?: NameType[]
            seller_blacklist?: NameType[]
            buyer_blacklist?: NameType[]
            asset_id?: UInt64Type[]
            marketplace?: string[]
            maker_marketplace?: string[]
            taker_marketplace?: string[]
            symbol?: string
            account?: NameType[]
            seller?: NameType[]
            buyer?: NameType[]
            min_price?: Float64Type
            max_price?: Float64Type
            min_template_mint?: UInt64Type
            max_template_mint?: UInt64Type
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
            buyoffer_id?: UInt64Type[]
            ids?: UInt64Type[]
            lower_bound?: string
            upper_bound?: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?:
                | 'created'
                | 'updated'
                | 'ending'
                | 'buyoffer_id'
                | 'price'
                | 'template_mint'
                | 'name'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicmarket/v1/buyoffers${queryParams}`,
            method: 'GET',
            responseType: Market.GetBuyoffersResponse,
        })
    }

    async get_buyoffer(buyoffer_id: UInt64Type) {
        return this.client.call({
            path: `/atomicmarket/v1/buyoffers/${buyoffer_id}`,
            method: 'GET',
            responseType: Market.GetBuyofferResponse,
        })
    }

    async get_buyoffer_logs(
        buyoffer_id: UInt64Type,
        options?: {
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            action_whitelist?: MActionType[]
            action_blacklist?: MActionType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/buyoffers/${buyoffer_id}/logs${queryParams}`,
            method: 'GET',
            responseType: Market.ActionLogsResponse,
        })
    }

    async get_marketplaces() {
        return this.client.call({
            path: `/atomicmarket/v1/marketplaces`,
            method: 'GET',
            responseType: Market.GetMarketplacesResponse,
        })
    }

    async get_marketplace(marketplace_name: string) {
        return this.client.call({
            path: `/atomicmarket/v1/marketplaces/${marketplace_name}`,
            method: 'GET',
            responseType: Market.GetMarketplaceResponse,
        })
    }

    async get_sale_prices(options?: {
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        burned?: boolean
        symbol?: string
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/prices/sales${queryParams}`,
            method: 'GET',
            responseType: Market.GetSalePricesResponse,
        })
    }

    async get_sale_prices_by_days(options?: {
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        burned?: boolean
        symbol?: string
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/prices/sales/days${queryParams}`,
            method: 'GET',
            responseType: Market.GetSalePricesDaysResponse,
        })
    }

    async get_template_prices(options?: {
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        burned?: boolean
        symbol?: string
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/prices/templates${queryParams}`,
            method: 'GET',
            responseType: Market.GetTemplatePricesResponse,
        })
    }

    async get_asset_prices(options?: {
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
        authorized_account?: NameType
        hide_offers?: boolean
        asset_id?: UInt64Type[]
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/prices/assets${queryParams}`,
            method: 'GET',
            responseType: Market.GetAssetPricesResponse,
        })
    }

    async get_inventory_prices(
        account: NameType,
        options?: {
            collection_name?: NameType[]
            schema_name?: NameType[]
            template_id?: Int32Type[]
            burned?: boolean
            match?: string
            search?: string
            match_immutable_name?: string
            match_mutable_name?: string
            is_transferable?: boolean
            is_burnable?: boolean
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
            authorized_account?: NameType
            hide_offers?: boolean
            asset_id?: UInt64Type[]
            ids?: UInt64Type[]
            lower_bound?: string
            upper_bound?: string
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/prices/inventory/${account}${queryParams}`,
            method: 'GET',
            responseType: Market.GetInventoryPricesResponse,
        })
    }

    async get_stats_collections(options: {
        symbol: string
        search: string
        collection_name?: NameType[]
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
        sort?: 'volume' | 'listings'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/collections${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsCollectionsResponse,
        })
    }

    async get_stats_collection(
        collection_name: NameType,
        options: {
            symbol: string
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/collections/${collection_name}${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsCollectionResponse,
        })
    }

    async get_stats_accounts(options: {
        symbol: string
        collection_name?: NameType[]
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'buy_volume' | 'sell_volume'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/accounts${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsAccountsResponse,
        })
    }

    async get_stats_account(
        account: NameType,
        options: {
            symbol: string
            collection_blacklist?: NameType[]
            collection_whitelist?: NameType[]
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/accounts/${account}${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsAccountResponse,
        })
    }

    async get_stats_schemas(
        collection_name: NameType,
        options: {
            symbol: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?: 'volume' | 'listings'
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/schemas/${collection_name}${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsSchemasV1Response,
        })
    }

    async get_stats_templates(options: {
        symbol: string
        search: string
        collection_name?: NameType[]
        schema_name?: NameType[]
        template_id?: Int32Type[]
        hide_unlisted_templates?: boolean
        ids?: UInt64Type[]
        lower_bound?: string
        upper_bound?: string
        before?: number
        after?: number
        page?: number
        limit?: number
        order?: 'asc' | 'desc'
        sort?: 'volume' | 'sales'
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/templates${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsTemplatesResponse,
        })
    }

    async get_stats_graph(options: {
        symbol: string
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/graph${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsGraphResponse,
        })
    }

    async get_stats_sales(options: {
        symbol: string
        collection_blacklist?: NameType[]
        collection_whitelist?: NameType[]
    }) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v1/stats/sales${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsSalesResponse,
        })
    }

    async get_config() {
        return this.client.call({
            path: '/atomicmarket/v1/config',
            method: 'GET',
            responseType: Market.GetConfigResponse,
        })
    }
}
