import {assert} from 'chai'
import {APIClient, FetchProvider, PublicKey, Serializer, Signature} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Link} from '$lib'
import {
    Asset,
    AtomicAssetsAPIClient,
    AtomicToolsContract,
    AtomicToolsKit,
    KitUtility,
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

const utility = new KitUtility('https://wax.api.atomicassets.io/', Chains.WAX, {
    client,
    atomicClient: atomicassets,
})

const kitInst = new AtomicToolsKit('https://wax.api.atomicassets.io/', Chains.WAX, utility)
const linkId = 1451754
const accountName = 'test.gm'

suite('Link', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testLink: Link

    setup(async function () {
        testLink = await kitInst.loadLink(linkId)
    })

    test('linkId', function () {
        assert.isTrue(testLink.linkId.equals(linkId))
    })

    test('assets', function () {
        assert.instanceOf(testLink.assets[0], Asset)
    })

    test('publicKey', function () {
        assert.isTrue(testLink.publicKey.equals(testLink.data.public_key))
        assert.instanceOf(testLink.publicKey, PublicKey)
    })

    test('creator', function () {
        assert.isTrue(testLink.creator.equals(testLink.data.creator))
    })

    test('claimer', function () {
        if (testLink.claimer) {
            assert.isTrue(testLink.claimer.equals(testLink.data.claimer))
        } else {
            assert.isTrue(testLink.claimer === null)
        }
    })

    test('state', function () {
        assert.isTrue(testLink.state === Types.LinkState.CLAIMED)
    })

    test('memo', function () {
        assert.isTrue(testLink.memo === testLink.data.memo)
    })

    test('cancel', function () {
        const action = testLink.cancel()

        assert.isTrue(action.account.equals('atomictoolsx'))
        assert.isTrue(action.name.equals('cancellink'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicToolsContract.Types.cancellink,
        })
        assert.isTrue(decoded.link_id.equals(testLink.linkId))
    })

    test('claim', function () {
        const sig = Signature.from(
            'SIG_K1_KfPLgpw35iX8nfDzhbcmSBCr7nEGNEYXgmmempQspDJYBCKuAEs5rm3s4ZuLJY428Ca8ZhvR2Dkwu118y3NAoMDxhicRj9'
        )
        const action = testLink.claim(accountName, sig)

        assert.isTrue(action.account.equals('atomictoolsx'))
        assert.isTrue(action.name.equals('claimlink'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicToolsContract.Types.claimlink,
        })
        assert.isTrue(decoded.link_id.equals(testLink.linkId))
        assert.isTrue(decoded.claimer.equals(accountName))
        assert.isTrue(decoded.claimer_signature.equals(sig))
    })

    test('announceLink', function () {
        const action = kitInst.announceLink({
            creator: testLink.creator,
            key: testLink.publicKey,
            asset_ids: testLink.assets.map((x) => x.assetId),
            memo: testLink.memo,
        })

        assert.isTrue(action.account.equals('atomictoolsx'))
        assert.isTrue(action.name.equals('announcelink'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicToolsContract.Types.announcelink,
        })
        assert.isTrue(decoded.creator.equals(testLink.creator))
        assert.isTrue(decoded.key.equals(testLink.publicKey))
        assert.isTrue(decoded.asset_ids.length === testLink.assets.length)
        assert.isTrue(decoded.asset_ids[0].equals(testLink.assets[0].assetId))
        assert.isTrue(decoded.memo === testLink.memo)
    })
})
