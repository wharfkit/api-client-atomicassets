import {assert} from 'chai'
import {APIClient, FetchProvider, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Offer} from '$lib'
import {
    Asset,
    AtomicAssetsAPIClient,
    AtomicAssetsContract,
    AtomicAssetsKit,
    AtomicUtility,
    Types,
} from '$lib'

const client = new APIClient({
    provider: new FetchProvider(Chains.WAX.url, {fetch: mockFetch}),
})

// Setup the API
const atomicassets = new AtomicAssetsAPIClient(
    new APIClient({
        provider: new FetchProvider('https://wax.api.atomicassets.io/', {fetch: mockFetch}),
    })
)

const utility = new AtomicUtility('https://wax.api.atomicassets.io/', Chains.WAX, {
    client,
    atomicClient: atomicassets,
})

const kitInst = new AtomicAssetsKit(utility)
const offerId = 22820296
const accountName = 'test.gm'

suite('Offer', function () {
    this.slow(200)
    this.timeout(10 * 10000)

    let testOffer: Offer

    setup(async function () {
        testOffer = await kitInst.loadOffer(offerId)
    })

    test('offerstate', function () {
        assert.isTrue(Types.OfferState.PENDING === 0)
    })

    test('offerId', function () {
        assert.isTrue(testOffer.offerId.equals(offerId))
    })

    test('sender_assets', function () {
        assert.instanceOf(testOffer.sender_assets[0], Asset)
    })

    test('recipient_assets', function () {
        assert.isTrue(testOffer.recipient_assets.length === 0)
    })

    test('senderName', function () {
        assert.isTrue(testOffer.senderName.equals(testOffer.data.sender_name))
    })

    test('recipientName', function () {
        assert.isTrue(testOffer.recipientName.equals(testOffer.data.recipient_name))
    })

    test('memo', function () {
        assert.isTrue(testOffer.memo === testOffer.data.memo)
    })

    test('state', function () {
        assert.isTrue(testOffer.state === Types.OfferState.ACCEPTED)
    })

    test('isSenderContract', function () {
        assert.isTrue(testOffer.isSenderContract === testOffer.data.is_sender_contract)
    })

    test('isRecipientContract', function () {
        assert.isTrue(testOffer.isRecipientContract === testOffer.data.is_recipient_contract)
    })

    test('cancel', function () {
        const action = testOffer.cancel()

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('canceloffer'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.Canceloffer,
        })
        assert.isTrue(decoded.offer_id.equals(testOffer.offerId))
    })

    test('decline', function () {
        const action = testOffer.decline()

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('declineoffer'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.Declineoffer,
        })
        assert.isTrue(decoded.offer_id.equals(testOffer.offerId))
    })

    test('accept', function () {
        const action = testOffer.accept()

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('acceptoffer'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.Acceptoffer,
        })
        assert.isTrue(decoded.offer_id.equals(testOffer.offerId))
    })

    test('payram', function () {
        const action = testOffer.payram(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('payofferram'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.Payofferram,
        })
        assert.isTrue(decoded.offer_id.equals(testOffer.offerId))
        assert.isTrue(decoded.payer.equals(accountName))
    })

    test('createOffer', function () {
        const action = kitInst.createOffer(
            AtomicAssetsContract.Types.Createoffer.from({
                sender: testOffer.senderName,
                recipient: testOffer.recipientName,
                sender_asset_ids: testOffer.sender_assets.map((x) => x.assetId),
                recipient_asset_ids: testOffer.recipient_assets.map((x) => x.assetId),
                memo: testOffer.memo,
            })
        )

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('createoffer'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.Createoffer,
        })
        assert.isTrue(decoded.sender.equals(testOffer.senderName))
        assert.isTrue(decoded.recipient.equals(testOffer.recipientName))
        assert.isTrue(decoded.sender_asset_ids.length === testOffer.sender_assets.length)
        assert.isTrue(decoded.sender_asset_ids[0].equals(testOffer.sender_assets[0].assetId))
        assert.isTrue(decoded.recipient_asset_ids.length === testOffer.recipient_assets.length)
    })
})