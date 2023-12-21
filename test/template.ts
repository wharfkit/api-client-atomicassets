import {assert} from 'chai'
import {APIClient, FetchProvider, Int64, Serializer} from '@wharfkit/antelope'
import {Chains} from '@wharfkit/common'
import {mockFetch} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import type {Template} from '$lib'
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
const templateId = 750150
const accountName = 'test.gm'

suite('Template', function () {
    this.slow(200)
    this.timeout(5 * 1000)

    let testTemplate: Template

    setup(async function () {
        testTemplate = await kitInst.loadTemplate(collectionName, templateId)
    })

    test('templateId', function () {
        assert.isTrue(testTemplate.templateId.equals(templateId))
    })

    test('collection', function () {
        assert.isTrue(testTemplate.collection.collectionName.equals(collectionName))
    })

    test('schema', function () {
        assert.isTrue(testTemplate.schema.schemaName.equals(testTemplate.data.schema.schema_name))
    })

    test('transferable', function () {
        assert.isTrue(testTemplate.transferable === testTemplate.data.is_transferable)
    })

    test('burnable', function () {
        assert.isTrue(testTemplate.burnable === testTemplate.data.is_burnable)
    })

    test('issuedSupply', function () {
        assert.isTrue(testTemplate.issuedSupply.equals(testTemplate.data.issued_supply))
    })

    test('maxSupply', function () {
        assert.isTrue(testTemplate.maxSupply.equals(testTemplate.data.max_supply))
    })

    test('lock', function () {
        const action = testTemplate.lock(accountName)

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('locktemplate'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.locktemplate,
        })
        assert.isTrue(decoded.collection_name.equals(testTemplate.collection.collectionName))
        assert.isTrue(decoded.authorized_editor.equals(accountName))
        assert.isTrue(decoded.template_id.equals(testTemplate.templateId))
    })

    test('createtemplate', function () {
        const action = kitInst.createTemplate({
            authorized_creator: accountName,
            collection_name: testTemplate.collection.collectionName,
            schema_name: testTemplate.schema.schemaName,
            transferable: true,
            burnable: true,
            max_supply: testTemplate.maxSupply,
            immutable_data: [
                {
                    key: 'example',
                    value: Int64.from(0),
                },
            ],
        })

        assert.isTrue(action.account.equals('atomicassets'))
        assert.isTrue(action.name.equals('createtempl'))
        assert.isTrue(action.authorization[0].equals(PlaceholderAuth))

        const decoded = Serializer.decode({
            data: action.data,
            type: AtomicAssetsContract.Types.createtempl,
        })
        assert.isTrue(decoded.authorized_creator.equals(accountName))
        assert.isTrue(decoded.collection_name.equals(testTemplate.collection.collectionName))
        assert.isTrue(decoded.schema_name.equals(testTemplate.schema.schemaName))
        assert.isTrue(decoded.immutable_data[0].key === 'example')
        assert.isTrue(decoded.immutable_data[0].value.equals(Int64.from(0)))
    })
})
