import type {Action, NameType} from '@wharfkit/antelope'
import {Name} from '@wharfkit/antelope'
import type {SchemaObject} from '../types'
import {Collection} from './collection'
import type * as AtomicAssetsContract from '../contracts/atomicassets'
import type {KitUtility} from '../utility'

export class Schema {
    readonly data: SchemaObject
    readonly collection: Collection
    readonly utility: KitUtility

    static from(schemaObject: SchemaObject, utility: KitUtility) {
        const collection = new Collection(utility, schemaObject.collection)
        return new this(utility, schemaObject, collection)
    }

    constructor(utility: KitUtility, data: SchemaObject, collection: Collection) {
        this.utility = utility
        this.data = data
        this.collection = collection
    }

    get schemaName() {
        return Name.from(this.data.schema_name)
    }

    get format() {
        return this.data.format
    }

    extendSchema(
        authorizedEditor: NameType,
        schemaFormat: AtomicAssetsContract.ActionParams.Type.FORMAT[]
    ): Action {
        return this.utility.assetsContract.action('extendschema', {
            authorized_editor: authorizedEditor,
            collection_name: this.collection.collectionName,
            schema_name: this.schemaName,
            schema_format_extension: schemaFormat,
        })
    }
}
