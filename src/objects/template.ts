import type {Action, NameType} from '@wharfkit/antelope'
import {Int32, UInt32} from '@wharfkit/antelope'
import type {TemplateObject} from '../types'
import {Collection} from './collection'
import {Schema} from './schema'
import type {KitUtility} from '../utility'

export class Template {
    readonly data: TemplateObject
    readonly collection: Collection
    readonly schema: Schema
    readonly utility: KitUtility

    static from(templateObject: TemplateObject, utility: KitUtility) {
        const collection = new Collection(utility, templateObject.collection)
        const schema = new Schema(utility, templateObject.schema, collection)
        return new this(utility, templateObject, collection, schema)
    }

    constructor(utility: KitUtility, data: TemplateObject, collection: Collection, schema: Schema) {
        this.utility = utility
        this.data = data
        this.collection = collection
        this.schema = schema
    }

    get templateId() {
        return Int32.from(this.data.template_id)
    }

    get transferable() {
        return this.data.is_transferable
    }

    get burnable() {
        return this.data.is_burnable
    }

    get issuedSupply() {
        return UInt32.from(this.data.issued_supply)
    }

    get maxSupply() {
        return UInt32.from(this.data.max_supply)
    }

    get immutableData() {
        return this.data.immutable_data
    }

    lock(authorizedEditor: NameType): Action {
        return this.utility.assetsContract.action('locktemplate', {
            authorized_editor: authorizedEditor,
            collection_name: this.collection.collectionName,
            template_id: this.templateId,
        })
    }
}
