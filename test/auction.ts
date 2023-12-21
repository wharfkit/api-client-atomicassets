import {assert} from 'chai'
import {Asset as AntelopeAsset, APIClient, FetchProvider, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Auction} from '$lib'
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
const auctionId = 1301765

suite('Auction', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testAuction: Auction

    setup(async function () {
        testAuction = await kitInst.loadAuction(auctionId)
    })

    test('auctionId', function () {
        assert.isTrue(testAuction.auctionId.equals(auctionId))
    })

    test('seller', function () {
        assert.isTrue(testAuction.seller.equals(testAuction.data.seller))
    })

    test('buyer', function () {
        if (testAuction.buyer) {
            assert.isTrue(testAuction.buyer.equals(testAuction.data.buyer))
        } else {
            assert.isTrue(testAuction.buyer === testAuction.data.buyer)
        }
    })

    test('endTime', function () {
        assert.isTrue(testAuction.endTime === testAuction.data.end_time)
    })

    test('bids', function () {
        assert.isTrue(testAuction.bids === testAuction.data.bids)
    })

    test('state', function () {
        assert.isTrue(testAuction.state === Types.AuctionState.INVALID)
    })

    test('claimedBySeller', function () {
        assert.isTrue(testAuction.claimedBySeller === testAuction.data.claimed_by_seller)
    })

    test('claimedByBuyer', function () {
        assert.isTrue(testAuction.claimedByBuyer === testAuction.data.claimed_by_buyer)
    })

    test('makerMarketplace', function () {
        assert.isTrue(testAuction.makerMarketplace.equals(testAuction.data.maker_marketplace))
    })

    test('takerMarketplace', function () {
        if (testAuction.takerMarketplace) {
            assert.isTrue(testAuction.takerMarketplace.equals(testAuction.data.taker_marketplace))
        } else {
            assert.isTrue(testAuction.takerMarketplace === null)
        }
    })

    test('isSellerContract', function () {
        assert.isTrue(testAuction.isSellerContract === testAuction.data.is_seller_contract)
    })

    test('assert', function () {
        const action = testAuction.assert()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('assertauct'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.assertauct,
        })
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
        assert.isTrue(decoded.asset_ids_to_assert.length === testAuction.assets.length)
    })

    test('claimBuy', function () {
        const action = testAuction.claimBuy()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('auctclaimbuy'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.auctclaimbuy,
        })
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
    })

    test('claimSell', function () {
        const action = testAuction.claimSell()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('auctclaimsel'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.auctclaimsel,
        })
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
    })

    test('bid', function () {
        const takerM = 'x.nft'
        const token = AntelopeAsset.from('0.0001 WAX')
        const action = testAuction.bid(accountName, token, takerM)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('auctionbid'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.auctionbid,
        })
        assert.isTrue(decoded.bidder.equals(accountName))
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
        assert.isTrue(decoded.bid.equals(token))
        assert.isTrue(decoded.taker_marketplace.equals(takerM))
    })

    test('cancel', function () {
        const action = testAuction.cancel()

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('cancelauct'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.cancelauct,
        })
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
    })

    test('payram', function () {
        const action = testAuction.payram(accountName)

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('payauctram'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.payauctram,
        })
        assert.isTrue(decoded.auction_id.equals(testAuction.auctionId))
        assert.isTrue(decoded.payer.equals(accountName))
    })

    test('announceAuction', function () {
        const token = AntelopeAsset.from('0.0001 WAX')
        const action = kitInst.announceAuction({
            seller: testAuction.seller,
            asset_ids: testAuction.assets.map((x) => x.assetId),
            starting_bid: token,
            duration: 100000, // seconds
            maker_marketplace: testAuction.makerMarketplace,
        })

        assert.isTrue(action.account.equals('atomicmarket'))
        assert.isTrue(action.name.equals('announceauct'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicMarketContract.Types.announceauct,
        })
        assert.isTrue(decoded.seller.equals(testAuction.seller))
        assert.isTrue(decoded.asset_ids.length === testAuction.assets.length)
        assert.isTrue(decoded.asset_ids[0].equals(testAuction.assets[0].assetId))
        assert.isTrue(decoded.starting_bid.equals(token))
        assert.isTrue(decoded.maker_marketplace.equals(testAuction.makerMarketplace))
    })
})
