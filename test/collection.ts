import {assert} from 'chai'
import {APIClient, FetchProvider, Int64, Name, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Collection} from '$lib'
import {AtomicAssetsAPIClient, AtomicAssetsContract, AtomicAssetsKit, KitUtility} from '$lib'

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

const kitInst = new AtomicAssetsKit('https://wax.api.atomicassets.io/', Chains.WAX, utility)
const collectionName = 'taco'
const accountName = 'test.gm'

suite('Collection', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testCollection: Collection

    setup(async function () {
        testCollection = await kitInst.loadCollection(collectionName)
    })

    test('collectionName', function () {
        assert.isTrue(testCollection.collectionName.equals(collectionName))
    })

    test('author', function () {
        assert.isTrue(testCollection.author.equals(testCollection.data.author))
    })

    test('allowNotify', function () {
        assert.isTrue(testCollection.allowNotify === testCollection.data.allow_notify)
    })

    test('authorizedAccounts', function () {
        assert.instanceOf(testCollection.authorizedAccounts[0], Name)
    })

    test('notifyAccounts', function () {
        assert.instanceOf(testCollection.authorizedAccounts[0], Name)
    })

    test('marketFee', function () {
        assert.isTrue(testCollection.marketFee.equals(testCollection.data.market_fee))
    })

    test('collectionData', function () {
        assert.isTrue(testCollection.data.name === testCollection.collectionData.name)
        assert.isTrue(testCollection.data.img === testCollection.collectionData.img)
    })

    test('name', function () {
        assert.isTrue(testCollection.name === testCollection.data.name)
    })

    test('image', function () {
        assert.isTrue(testCollection.image === testCollection.data.img)
    })

    test('addAuth', function () {
        const action = testCollection.addAuth(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('addcolauth'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.addcolauth,
        })
        assert.isTrue(decoded.account_to_add.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
    })

    test('removeAuth', function () {
        const action = testCollection.removeAuth(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('remcolauth'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.remcolauth,
        })
        assert.isTrue(decoded.account_to_remove.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
    })

    test('setData', function () {
        const data: AtomicAssetsContract.ActionParams.Type.pair_string_ATOMIC_ATTRIBUTE[] = [
            {
                key: 'hello',
                value: 'world',
            },
            {
                key: 'description',
                value: Int64.from(0),
            },
        ]

        const action = testCollection.setData(data)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('setcoldata'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.setcoldata,
        })
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
        assert.isTrue(decoded.data[0].key === 'hello')
        assert.isTrue(decoded.data[0].value.equals('world'))
        assert.isTrue(decoded.data[1].key === 'description')
        assert.isTrue(decoded.data[1].value.equals(['int64', 0]))
        assert.isTrue(decoded.data[1].value.equals(Int64.from(0)))
    })

    test('addNotifyAccount', function () {
        const action = testCollection.addNotifyAccount(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('addnotifyacc'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.addnotifyacc,
        })
        assert.isTrue(decoded.account_to_add.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
    })

    test('removeNotifyAccount', function () {
        const action = testCollection.removeNotifyAccount(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('remnotifyacc'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.remnotifyacc,
        })
        assert.isTrue(decoded.account_to_remove.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
    })

    test('setMarketFee', function () {
        const fee = '0.02'
        const action = testCollection.setMarketFee(fee)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('setmarketfee'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.setmarketfee,
        })
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
        assert.isTrue(decoded.market_fee.equals(fee))
    })

    test('forbidnotify', function () {
        const action = testCollection.forbidnotify()

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('forbidnotify'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.forbidnotify,
        })
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
    })

    test('createCollection', function () {
        const action = kitInst.createCollection({
            author: testCollection.author,
            collection_name: testCollection.collectionName,
            allow_notify: testCollection.allowNotify,
            authorized_accounts: testCollection.authorizedAccounts,
            notify_accounts: testCollection.notifyAccounts,
            market_fee: testCollection.marketFee,
            data: [
                {
                    key: 'name',
                    value: testCollection.collectionData.name,
                },
                {
                    key: 'img',
                    value: testCollection.collectionData.img,
                },
            ],
        })

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('createcol'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.createcol,
        })
        assert.isTrue(decoded.author.equals(testCollection.author))
        assert.isTrue(decoded.collection_name.equals(testCollection.collectionName))
        assert.isTrue(decoded.allow_notify === testCollection.allowNotify)
        assert.deepEqual(decoded.authorized_accounts, testCollection.authorizedAccounts)
        assert.deepEqual(decoded.notify_accounts, testCollection.notifyAccounts)
        assert.isTrue(decoded.market_fee.equals(testCollection.marketFee))
        assert.isTrue(decoded.data[0].key === 'name')
        assert.isTrue(decoded.data[0].value.equals(testCollection.collectionData.name))
        assert.isTrue(decoded.data[1].key === 'img')
        assert.isTrue(decoded.data[1].value.equals(['string', testCollection.collectionData.img]))
    })
})
