import {assert} from 'chai'

import {APIClient, FetchProvider, Name} from '@wharfkit/antelope'
import {mockFetch} from '@wharfkit/mock-data'

import {AtomicAssetsAPIClient, Types} from '$lib'

// Setup an APIClient
const client = new APIClient({
    provider: new FetchProvider('https://wax.api.atomicassets.io/', {fetch: mockFetch}),
})

// Setup the API
const atomicassets = new AtomicAssetsAPIClient(client)

suite('atomicassets', function () {
    this.slow(200)
    this.timeout(10 * 1000)

    test('get_config', async function () {
        const res = await atomicassets.atomicassets.v1.get_config()
        assert.instanceOf(res, Types.Assets.GetConfigResponse)
        assert.equal(res.success, true)
    })

    test('get_accounts', async function () {
        const res = await atomicassets.atomicassets.v1.get_accounts({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            owner: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetAccountsResponse)
        assert.equal(res.success, true)
    })

    test('get_account', async function () {
        const res = await atomicassets.atomicassets.v1.get_account('taco')
        assert.instanceOf(res, Types.Assets.GetAccountResponse)
        assert.equal(res.success, true)
    })

    test('get_account_template_schema_count', async function () {
        const res = await atomicassets.atomicassets.v1.get_account_template_schema_count(
            'taco',
            'taco'
        )
        assert.instanceOf(res, Types.Assets.GetAccountTemplateSchemaCountResponse)
        assert.equal(res.success, true)
    })

    test('get_collections', async function () {
        const res = await atomicassets.atomicassets.v1.get_collections({
            author: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetCollectionsResponse)
        assert.equal(res.success, true)
    })

    test('get_collection', async function () {
        const res = await atomicassets.atomicassets.v1.get_collection('taco')
        assert.instanceOf(res, Types.Assets.GetCollectionResponse)
        assert.equal(res.success, true)
    })

    test('get_collection_stats', async function () {
        const res = await atomicassets.atomicassets.v1.get_collection_stats('taco')
        assert.instanceOf(res, Types.Assets.GetCollectionStatsResponse)
        assert.equal(res.success, true)
    })

    test('get_collection_logs', async function () {
        const res = await atomicassets.atomicassets.v1.get_collection_logs('taco', {
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_schemas', async function () {
        const res = await atomicassets.atomicassets.v1.get_schemas({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetSchemasResponse)
        assert.equal(res.success, true)
    })

    test('get_schema', async function () {
        const res = await atomicassets.atomicassets.v1.get_schema('taco', 'cmbz.res')
        assert.instanceOf(res, Types.Assets.GetSchemaResponse)
        assert.equal(res.success, true)
    })

    test('get_schema_stats', async function () {
        const res = await atomicassets.atomicassets.v1.get_schema_stats('taco', 'cmbz.res')
        assert.instanceOf(res, Types.Assets.GetSchemaStatsResponse)
        assert.equal(res.success, true)
    })

    test('get_schema_logs', async function () {
        const res = await atomicassets.atomicassets.v1.get_schema_logs('taco', 'cmbz.res', {
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_templates', async function () {
        const res = await atomicassets.atomicassets.v1.get_templates({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetTemplatesResponse)
        assert.equal(res.success, true)
    })

    test('get_template', async function () {
        const res = await atomicassets.atomicassets.v1.get_template('taco', 750150)
        assert.instanceOf(res, Types.Assets.GetTemplateResponse)
        assert.equal(res.success, true)
    })

    test('get_template_stats', async function () {
        const res = await atomicassets.atomicassets.v1.get_template_stats('taco', 750150)
        assert.instanceOf(res, Types.Assets.GetTemplateStatsResponse)
        assert.equal(res.success, true)
    })

    test('get_template_logs', async function () {
        const res = await atomicassets.atomicassets.v1.get_template_logs('taco', 750150, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_assets', async function () {
        const res = await atomicassets.atomicassets.v1.get_assets({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            owner: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetAssetsResponse)
        assert.equal(res.success, true)
    })

    test('get_asset', async function () {
        const res = await atomicassets.atomicassets.v1.get_asset(1099851897196)
        assert.instanceOf(res, Types.Assets.GetAssetResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_stats', async function () {
        const res = await atomicassets.atomicassets.v1.get_asset_stats(1099851897196)
        assert.instanceOf(res, Types.Assets.GetAssetStatsResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_logs', async function () {
        const res = await atomicassets.atomicassets.v1.get_asset_logs(1099851897196, {
            action_whitelist: ['logmint', 'mintasset', 'logtransfer'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_offers', async function () {
        const res = await atomicassets.atomicassets.v1.get_offers({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetOffersResponse)
        assert.equal(res.success, true)
    })

    test('get_offer', async function () {
        const res = await atomicassets.atomicassets.v1.get_offer(22820296)
        assert.instanceOf(res, Types.Assets.GetOfferResponse)
        assert.equal(res.success, true)
    })

    test('get_offer_logs', async function () {
        const res = await atomicassets.atomicassets.v1.get_offer_logs(22820296, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_transfers', async function () {
        const res = await atomicassets.atomicassets.v1.get_transfers({
            account: ['taco'],
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetTransfersResponse)
        assert.equal(res.success, true)
    })

    test('get_burns', async function () {
        const res = await atomicassets.atomicassets.v1.get_burns({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            match_owner: 'taco',
            limit: 10,
        })
        assert.instanceOf(res, Types.Assets.GetAccountsResponse)
        assert.equal(res.success, true)
    })

    test('get_account_burns', async function () {
        const res = await atomicassets.atomicassets.v1.get_account_burns('taco')
        assert.instanceOf(res, Types.Assets.GetAccountBurnsResponse)
        assert.equal(res.success, true)
    })
})

suite('atomictools', function () {
    this.slow(200)
    this.timeout(10 * 1000)

    test('get_links', async function () {
        const res = await atomicassets.atomictools.v1.get_links({
            creator: [Name.from('taco'), 'federation'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Tools.GetLinksResponse)
        assert.equal(res.success, true)
    })

    test('get_link', async function () {
        const res = await atomicassets.atomictools.v1.get_link('1451754')
        assert.instanceOf(res, Types.Tools.GetLinkResponse)
        assert.equal(res.success, true)
    })

    test('get_link_logs', async function () {
        const res = await atomicassets.atomictools.v1.get_link_logs('1451754', {limit: 10})
        assert.instanceOf(res, Types.Tools.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_config', async function () {
        const res = await atomicassets.atomictools.v1.get_config()
        assert.instanceOf(res, Types.Tools.GetConfigResponse)
        assert.equal(res.success, true)
    })
})

suite('atomicmarket', function () {
    this.slow(200)
    this.timeout(10 * 1000)

    test('get_assets', async function () {
        const res = await atomicassets.atomicmarket.v1.get_assets({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            owner: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetAssetsResponse)
        assert.equal(res.success, true)
    })

    test('get_asset', async function () {
        const res = await atomicassets.atomicmarket.v1.get_asset(1099851897196)
        assert.instanceOf(res, Types.Market.GetAssetResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_stats', async function () {
        const res = await atomicassets.atomicmarket.v1.get_asset_stats(1099851897196)
        assert.instanceOf(res, Types.Market.GetAssetStatsResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_logs', async function () {
        const res = await atomicassets.atomicmarket.v1.get_asset_logs(1099851897196, {
            action_whitelist: ['logmint', 'mintasset', 'logtransfer'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_sales', async function () {
        const res = await atomicassets.atomicmarket.v1.get_asset_sales(1099851897196)
        assert.instanceOf(res, Types.Market.GetAssetSalesResponse)
        assert.equal(res.success, true)
    })

    test('get_offers', async function () {
        const res = await atomicassets.atomicmarket.v1.get_offers({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetOffersResponse)
        assert.equal(res.success, true)
    })

    test('get_offer', async function () {
        const res = await atomicassets.atomicmarket.v1.get_offer(22820296)
        assert.instanceOf(res, Types.Market.GetOfferResponse)
        assert.equal(res.success, true)
    })

    test('get_offer_logs', async function () {
        const res = await atomicassets.atomicmarket.v1.get_offer_logs(22820296, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_transfers', async function () {
        const res = await atomicassets.atomicmarket.v1.get_transfers({
            account: ['taco'],
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetTransfersResponse)
        assert.equal(res.success, true)
    })

    test('get_sales', async function () {
        const res = await atomicassets.atomicmarket.v2.get_sales({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            buyer: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetSalesResponse)
        assert.equal(res.success, true)
    })

    test('get_sale', async function () {
        const res = await atomicassets.atomicmarket.v1.get_sale(89024803)
        assert.instanceOf(res, Types.Market.GetSaleResponse)
        assert.equal(res.success, true)
    })

    test('get_sale_logs', async function () {
        const res = await atomicassets.atomicmarket.v1.get_sale_logs(89024803, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_sales_by_templates', async function () {
        const res = await atomicassets.atomicmarket.v1.get_sales_by_templates({
            symbol: 'WAX',
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetSalesTemplatesResponse)
        assert.equal(res.success, true)
    })

    test('get_auctions', async function () {
        const res = await atomicassets.atomicmarket.v1.get_auctions({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetAuctionsResponse)
        assert.equal(res.success, true)
    })

    test('get_auction', async function () {
        const res = await atomicassets.atomicmarket.v1.get_auction(1301765)
        assert.instanceOf(res, Types.Market.GetAuctionResponse)
        assert.equal(res.success, true)
    })

    test('get_auction_logs', async function () {
        const res = await atomicassets.atomicmarket.v1.get_auction_logs(1301765, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_buyoffers', async function () {
        const res = await atomicassets.atomicmarket.v1.get_buyoffers({
            collection_name: [Name.from('taco'), 'alien.worlds'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetBuyoffersResponse)
        assert.equal(res.success, true)
    })

    test('get_buyoffer', async function () {
        const res = await atomicassets.atomicmarket.v1.get_buyoffer(2432258)
        assert.instanceOf(res, Types.Market.GetBuyofferResponse)
        assert.equal(res.success, true)
    })

    test('get_buyoffer_logs', async function () {
        const res = await atomicassets.atomicmarket.v1.get_buyoffer_logs(2432258, {
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.ActionLogsResponse)
        assert.equal(res.success, true)
    })

    test('get_marketplaces', async function () {
        const res = await atomicassets.atomicmarket.v1.get_marketplaces()
        assert.instanceOf(res, Types.Market.GetMarketplacesResponse)
        assert.equal(res.success, true)
    })

    test('get_marketplace', async function () {
        const res = await atomicassets.atomicmarket.v1.get_marketplace('market.place')
        assert.instanceOf(res, Types.Market.GetMarketplaceResponse)
        assert.equal(res.success, true)
    })

    test('get_sale_prices_by_days', async function () {
        const res = await atomicassets.atomicmarket.v1.get_sale_prices_by_days({
            collection_name: ['taco'],
        })
        assert.instanceOf(res, Types.Market.GetSalePricesDaysResponse)
        assert.equal(res.success, true)
    })

    test('get_sale_prices', async function () {
        const res = await atomicassets.atomicmarket.v1.get_sale_prices({collection_name: ['taco']})
        assert.instanceOf(res, Types.Market.GetSalePricesResponse)
        assert.equal(res.success, true)
    })

    test('get_template_prices', async function () {
        const res = await atomicassets.atomicmarket.v1.get_template_prices({
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetTemplatePricesResponse)
        assert.equal(res.success, true)
    })

    test('get_asset_prices', async function () {
        const res = await atomicassets.atomicmarket.v1.get_asset_prices({
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetAssetPricesResponse)
        assert.equal(res.success, true)
    })

    test('get_inventory_prices', async function () {
        const res = await atomicassets.atomicmarket.v1.get_inventory_prices('taco', {
            collection_name: ['taco'],
        })
        assert.instanceOf(res, Types.Market.GetInventoryPricesResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_collections', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_collections({
            symbol: 'WAX',
            search: 'taco',
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetStatsCollectionsResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_collection', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_collection('taco', {
            symbol: 'WAX',
        })
        assert.instanceOf(res, Types.Market.GetStatsCollectionResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_accounts', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_accounts({
            symbol: 'WAX',
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetStatsAccountsResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_account', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_account('taco', {
            symbol: 'WAX',
        })
        assert.instanceOf(res, Types.Market.GetStatsAccountResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_schemas_v1', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_schemas('taco', {
            symbol: 'WAX',
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetStatsSchemasV1Response)
        assert.equal(res.success, true)
    })

    test('get_stats_schemas_v2', async function () {
        const res = await atomicassets.atomicmarket.v2.get_stats_schemas('taco', {
            symbol: 'WAX',
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetStatsSchemasV2Response)
        assert.equal(res.success, true)
    })

    test('get_stats_templates', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_templates({
            symbol: 'WAX',
            search: 'taco',
            collection_name: ['taco'],
            limit: 10,
        })
        assert.instanceOf(res, Types.Market.GetStatsTemplatesResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_graph', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_graph({
            symbol: 'WAX',
            collection_whitelist: ['taco'],
        })
        assert.instanceOf(res, Types.Market.GetStatsGraphResponse)
        assert.equal(res.success, true)
    })

    test('get_stats_sales', async function () {
        const res = await atomicassets.atomicmarket.v1.get_stats_sales({
            symbol: 'WAX',
            collection_whitelist: ['taco'],
        })
        assert.instanceOf(res, Types.Market.GetStatsSalesResponse)
        assert.equal(res.success, true)
    })

    test('get_config', async function () {
        const res = await atomicassets.atomicmarket.v1.get_config()
        assert.instanceOf(res, Types.Market.GetConfigResponse)
        assert.equal(res.success, true)
    })
})
