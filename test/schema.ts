import {assert} from 'chai'
import {APIClient, FetchProvider, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Schema} from '$lib'
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
const schemaName = 'cmbz.res'
const accountName = 'test.gm'

suite('Schema', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testSchema: Schema

    setup(async function () {
        testSchema = await kitInst.loadSchema(collectionName, schemaName)
    })

    test('schemaName', function () {
        assert.isTrue(testSchema.schemaName.equals(schemaName))
    })

    test('collection', function () {
        assert.isTrue(testSchema.collection.collectionName.equals(collectionName))
    })

    test('format', function () {
        assert.instanceOf(testSchema.format[0], AtomicAssetsContract.Types.FORMAT)
    })

    test('extendSchema', function () {
        const action = testSchema.extendSchema(accountName, [{name: 'video', type: 'string'}])

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('extendschema'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.extendschema,
        })
        assert.isTrue(decoded.authorized_editor.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(collectionName))
        assert.isTrue(decoded.schema_name.equals(testSchema.schemaName))
        assert.isTrue(decoded.schema_format_extension[0].name === 'video')
        assert.isTrue(decoded.schema_format_extension[0].type === 'string')
    })

    test('createSchema', function () {
        const action = kitInst.createSchema({
            authorized_creator: accountName,
            collection_name: collectionName,
            schema_name: schemaName,
            schema_format: [{name: 'video', type: 'string'}],
        })

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('createschema'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.createschema,
        })
        assert.isTrue(decoded.authorized_creator.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(collectionName))
        assert.isTrue(decoded.schema_name.equals(schemaName))
        assert.isTrue(decoded.schema_format[0].name === 'video')
        assert.isTrue(decoded.schema_format[0].type === 'string')
    })
})
