import type {APIClient} from '@wharfkit/antelope'
import type {Float64Type, Int32Type, NameType, UInt64Type} from '@wharfkit/antelope'
import type {SaleState} from '../../types'
import {Market} from '../../types'
import {buildQueryParams} from '../utils'

export class MarketV2APIClient {
    constructor(private client: APIClient) {}

    async get_sales(
        options?: {
            state?: SaleState[]
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
            sale_id?: UInt64Type[]
            ids?: UInt64Type[]
            lower_bound?: string
            upper_bound?: string
            before?: number
            after?: number
            page?: number
            limit?: number
            order?: 'asc' | 'desc'
            sort?: 'created' | 'updated' | 'sale_id' | 'price' | 'template_mint' | 'name'
        },
        extra_options?: {[key: string]: string}
    ) {
        const queryParams = buildQueryParams(options, extra_options)

        return this.client.call({
            path: `/atomicmarket/v2/sales${queryParams}`,
            method: 'GET',
            responseType: Market.GetSalesResponse,
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
            sort?: 'volume' | 'sales'
        }
    ) {
        const queryParams = buildQueryParams(options)

        return this.client.call({
            path: `/atomicmarket/v2/stats/schemas/${collection_name}${queryParams}`,
            method: 'GET',
            responseType: Market.GetStatsSchemasV2Response,
        })
    }
}
