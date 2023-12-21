import type {Action, AssetType, NameType} from '@wharfkit/antelope'
import {Asset as AntelopeAsset, ExtendedAsset, Name, UInt64} from '@wharfkit/antelope'

import type {AssetObject} from '../types'
import {Collection} from './collection'
import {Schema} from './schema'
import {Template} from './template'
import type {KitUtility} from '../utility'
import type * as AtomicAssetsContract from '../contracts/atomicassets'

export class Asset {
    readonly data: AssetObject
    readonly collection: Collection
    readonly schema: Schema
    readonly template: Template
    readonly backedTokens: ExtendedAsset[]
    readonly utility: KitUtility

    static from(assetObject: AssetObject, utility: KitUtility) {
        const collection = new Collection(utility, assetObject.collection)
        const schema = new Schema(utility, assetObject.schema, collection)
        const template = new Template(utility, assetObject.template, collection, schema)

        return new this(utility, assetObject, collection, schema, template)
    }

    constructor(
        utility: KitUtility,
        data: AssetObject,
        collection: Collection,
        schema: Schema,
        template: Template
    ) {
        this.utility = utility
        this.data = data
        this.collection = collection
        this.schema = schema
        this.template = template
        this.backedTokens = this.data.backed_tokens.map((t) =>
            ExtendedAsset.from({
                quantity: AntelopeAsset.fromUnits(
                    t.amount,
                    AntelopeAsset.Symbol.from(`${t.token_precision},${t.token_symbol}`)
                ),
                contract: t.token_contract,
            })
        )
    }

    get assetId() {
        return UInt64.from(this.data.asset_id)
    }

    get immutableData() {
        return this.data.immutable_data
    }

    get mutableData() {
        return this.data.mutable_data
    }

    get assetData() {
        return this.data.data
    }

    get owner() {
        return Name.from(this.data.owner)
    }

    get transferable() {
        return this.data.is_transferable
    }

    get burnable() {
        return this.data.is_burnable
    }

    get name() {
        return this.data.name
    }

    get burnedByAccount() {
        return this.data.burned_by_account ? Name.from(this.data.burned_by_account) : null
    }

    burn(): Action {
        return this.utility.assetsContract.action('burnasset', {
            asset_owner: this.owner,
            asset_id: this.assetId,
        })
    }

    back(payer: NameType, backedToken: AssetType): Action {
        return this.utility.assetsContract.action('backasset', {
            payer,
            asset_owner: this.owner,
            asset_id: this.assetId,
            token_to_back: backedToken,
        })
    }

    setData(
        authorizedEditor: NameType,
        mutableData: AtomicAssetsContract.ActionParams.Type.pair_string_ATOMIC_ATTRIBUTE[]
    ): Action {
        return this.utility.assetsContract.action('setassetdata', {
            authorized_editor: authorizedEditor,
            asset_owner: this.owner,
            asset_id: this.assetId,
            new_mutable_data: mutableData,
        })
    }
}
