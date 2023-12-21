import {assert} from 'chai'
import {Asset as AntelopeAsset, APIClient, FetchProvider, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Sale} from '$lib'
import {AtomicAssetsAPIClient, AtomicMarketContract, AtomicMarketKit, KitUtility, Types} from '$lib'

const client = new APIClient({
    provider: new FetchProvider(Chains.WAX.url, {fetch: mockFetch}),
})

// Setup the API
const atomicassets = new AtomicAssetsAPIClient(
    new APIClient({
        provider: new FetchProvider('https://wax.api.atomicassets.io/', {fetch: mockFetch}),
    })
)

const utility = new KitUtility('https://wax.api.atomicassets.io/', Chains.WAX, {
    client,
    atomicClient: atomicassets,
})

const kitInst = new AtomicMarketKit('https://wax.api.atomicassets.io/', Chains.WAX, utility)
const accountName = 'test.gm'
const saleId = 89024803

suite('Sale', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testSale: Sale

    setup(async function () {
        testSale = await kitInst.loadSale(saleId)
    })

    test('saleId', function () {
        assert.isTrue(testSale.saleId.equals(saleId))
    })

    test('seller', function () {
        assert.isTrue(testSale.seller.equals(testSale.data.seller))
    })

    test('buyer', function () {
        if (testSale.buyer) {
            assert.isTrue(testSale.buyer.equals(testSale.data.buyer))
        } else {
            assert.isTrue(testSale.buyer === testSale.data.buyer)
        }
    })

    test('listingPrice', function () {
        assert.isTrue(testSale.data.listing_price.equals(testSale.listingPrice.units))
    })

    test('listingSymbol', function () {
        assert.isTrue(testSale.listingSymbol.equals(testSale.price.quantity.symbol))
    })

    test('makerMarketplace', function () {
        assert.isTrue(testSale.makerMarketplace.equals(testSale.data.maker_marketplace))
    })

    test('takerMarketplace', function () {
        if (testSale.takerMarketplace) {
            assert.isTrue(testSale.takerMarketplace.equals(testSale.data.taker_marketplace))
        } else {
            assert.isTrue(testSale.takerMarketplace === null)
        }
    })

    test('state', function () {
        assert.isTrue(testSale.state === Types.SaleState.SOLD)
    })

    test('isSellerContract', function () {
        assert.isTrue(testSale.isSellerContract === testSale.data.is_seller_contract)
    })

    test('assert', function () {
        const action = testSale.assert()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('assertsale'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.assertsale,
        })
        assert.isTrue(decoded.sale_id.equals(testSale.saleId))
        assert.isTrue(decoded.asset_ids_to_assert.length === testSale.assets.length)
        assert.isTrue(decoded.listing_price_to_assert.equals(testSale.listingPrice))
        assert.isTrue(decoded.settlement_symbol_to_assert.equals(testSale.listingSymbol))
    })

    test('cancel', function () {
        const action = testSale.cancel()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('cancelsale'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.cancelsale,
        })
        assert.isTrue(decoded.sale_id.equals(testSale.saleId))
    })

    test('payram', function () {
        const action = testSale.payram(accountName)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('paysaleram'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.paysaleram,
        })
        assert.isTrue(decoded.sale_id.equals(testSale.saleId))
        assert.isTrue(decoded.payer.equals(accountName))
    })

    test('purchase', function () {
        const takerM = 'x.nft'
        const token = AntelopeAsset.from('0.0001 WAX')
        const action = testSale.purchase(accountName, token.value, takerM)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('purchasesale'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.purchasesale,
        })
        assert.isTrue(decoded.buyer.equals(accountName))
        assert.isTrue(decoded.sale_id.equals(testSale.saleId))
        assert.isTrue(decoded.intended_delphi_median.equals(token.value))
        assert.isTrue(decoded.taker_marketplace.equals(takerM))
    })

    test('announceSale', function () {
        const token = AntelopeAsset.from('0.0001 WAX')
        const action = kitInst.announceSale({
            seller: testSale.seller,
            asset_ids: testSale.assets.map((x) => x.assetId),
            listing_price: token,
            settlement_symbol: token.symbol,
            maker_marketplace: testSale.makerMarketplace,
        })

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('announcesale'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.announcesale,
        })
        assert.isTrue(decoded.seller.equals(testSale.seller))
        assert.isTrue(decoded.asset_ids.length === testSale.assets.length)
        assert.isTrue(decoded.asset_ids[0].equals(testSale.assets[0].assetId))
        assert.isTrue(decoded.listing_price.equals(token))
        assert.isTrue(decoded.settlement_symbol.equals(token.symbol))
        assert.isTrue(decoded.maker_marketplace.equals(testSale.makerMarketplace))
    })
})
