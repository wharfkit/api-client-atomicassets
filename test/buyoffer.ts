import {assert} from 'chai'
import {APIClient, FetchProvider, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Buyoffer} from '$lib'
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
const buyofferId = 2432258

suite('Buyoffer', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testBuyoffer: Buyoffer

    setup(async function () {
        testBuyoffer = await kitInst.loadBuyoffer(buyofferId)
    })

    test('buyofferId', function () {
        assert.isTrue(testBuyoffer.buyofferId.equals(buyofferId))
    })

    test('buyer', function () {
        assert.isTrue(testBuyoffer.buyer.equals(testBuyoffer.data.buyer))
    })

    test('seller', function () {
        if (testBuyoffer.seller) {
            assert.isTrue(testBuyoffer.seller.equals(testBuyoffer.data.seller))
        } else {
            assert.isTrue(testBuyoffer.seller === testBuyoffer.data.seller)
        }
    })

    test('makerMarketplace', function () {
        assert.isTrue(testBuyoffer.makerMarketplace.equals(testBuyoffer.data.maker_marketplace))
    })

    test('takerMarketplace', function () {
        if (testBuyoffer.takerMarketplace) {
            assert.isTrue(testBuyoffer.takerMarketplace.equals(testBuyoffer.data.taker_marketplace))
        } else {
            assert.isTrue(testBuyoffer.takerMarketplace === null)
        }
    })

    test('memo', function () {
        assert.isTrue(testBuyoffer.memo === testBuyoffer.data.memo)
    })

    test('declineMemo', function () {
        assert.isTrue(testBuyoffer.declineMemo === testBuyoffer.data.decline_memo)
    })

    test('state', function () {
        assert.isTrue(testBuyoffer.state === Types.BuyofferState.CANCELED)
    })

    test('accept', function () {
        const takerM = 'x.nft'
        const action = testBuyoffer.accept(takerM)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('acceptbuyo'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.acceptbuyo,
        })
        assert.isTrue(decoded.buyoffer_id.equals(testBuyoffer.buyofferId))
        assert.isTrue(decoded.expected_asset_ids.length === testBuyoffer.assets.length)
        assert.isTrue(decoded.expected_price.equals(testBuyoffer.price.quantity))
        assert.isTrue(decoded.taker_marketplace.equals(takerM))
    })

    test('cancel', function () {
        const action = testBuyoffer.cancel()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('cancelbuyo'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.cancelbuyo,
        })
        assert.isTrue(decoded.buyoffer_id.equals(testBuyoffer.buyofferId))
    })

    test('decline', function () {
        const declineMemo = 'nothing'
        const action = testBuyoffer.decline(declineMemo)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('declinebuyo'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.declinebuyo,
        })
        assert.isTrue(decoded.buyoffer_id.equals(testBuyoffer.buyofferId))
        assert.isTrue(decoded.decline_memo === declineMemo)
    })

    test('payram', function () {
        const action = testBuyoffer.payram(accountName)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('paybuyoram'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.paybuyoram,
        })
        assert.isTrue(decoded.buyoffer_id.equals(testBuyoffer.buyofferId))
        assert.isTrue(decoded.payer.equals(accountName))
    })

    test('createbuyo', function () {
        const action = kitInst.createBuyo({
            buyer: testBuyoffer.buyer,
            recipient: accountName,
            price: testBuyoffer.price.quantity,
            asset_ids: testBuyoffer.assets.map((x) => x.assetId),
            memo: 'everything',
            maker_marketplace: testBuyoffer.makerMarketplace,
        })

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('createbuyo'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.createbuyo,
        })
        assert.isTrue(decoded.buyer.equals(testBuyoffer.buyer))
        assert.isTrue(decoded.recipient.equals(accountName))
        assert.isTrue(decoded.asset_ids.length === testBuyoffer.assets.length)
        assert.isTrue(decoded.asset_ids[0].equals(testBuyoffer.assets[0].assetId))
        assert.isTrue(decoded.price.equals(testBuyoffer.price.quantity))
        assert.isTrue(decoded.memo === 'everything')
        assert.isTrue(decoded.maker_marketplace.equals(testBuyoffer.makerMarketplace))
    })
})
