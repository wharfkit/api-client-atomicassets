import type {Action, NameType} from '@wharfkit/antelope'
import {Asset as AntelopeAsset, ExtendedAsset, Name, UInt64} from '@wharfkit/antelope'
import type {BuyofferObject} from '../types'
import {BuyofferState} from '../types'
import {Collection} from './collection'
import {Asset} from './asset'
import type {KitUtility} from '../utility'

export class Buyoffer {
    readonly data: BuyofferObject
    readonly collection: Collection
    readonly assets: Asset[]
    readonly price: ExtendedAsset
    readonly utility: KitUtility

    static from(buyofferObject: BuyofferObject, utility: KitUtility) {
        const collection = new Collection(utility, buyofferObject.collection)
        const assets = buyofferObject.assets.map((a) => Asset.from(a, utility))
        return new this(utility, buyofferObject, collection, assets)
    }

    constructor(
        utility: KitUtility,
        data: BuyofferObject,
        collection: Collection,
        assets: Asset[]
    ) {
        this.utility = utility
        this.data = data
        this.collection = collection
        this.assets = assets

        this.price = ExtendedAsset.from({
            quantity: AntelopeAsset.fromUnits(
                this.data.price.amount,
                AntelopeAsset.Symbol.from(
                    `${this.data.price.token_precision},${this.data.price.token_symbol}`
                )
            ),
            contract: this.data.price.token_contract,
        })
    }

    get buyofferId() {
        return UInt64.from(this.data.buyoffer_id)
    }

    get seller() {
        return this.data.seller ? Name.from(this.data.seller) : null
    }

    get buyer() {
        return Name.from(this.data.buyer)
    }

    get makerMarketplace() {
        return Name.from(this.data.maker_marketplace)
    }

    get takerMarketplace() {
        return this.data.taker_marketplace ? Name.from(this.data.taker_marketplace) : null
    }

    get memo() {
        return this.data.memo
    }

    get declineMemo() {
        return this.data.decline_memo
    }

    get state() {
        return BuyofferState[BuyofferState[this.data.state.toNumber()]]
    }

    accept(takerMarketplace: NameType): Action {
        return this.utility.marketContract.action('acceptbuyo', {
            buyoffer_id: this.buyofferId,
            expected_asset_ids: this.assets.map((a) => a.assetId),
            expected_price: this.price.quantity,
            taker_marketplace: takerMarketplace,
        })
    }

    cancel(): Action {
        return this.utility.marketContract.action('cancelbuyo', {
            buyoffer_id: this.buyofferId,
        })
    }

    decline(memo: string): Action {
        return this.utility.marketContract.action('declinebuyo', {
            buyoffer_id: this.buyofferId,
            decline_memo: memo,
        })
    }

    payram(payer: NameType): Action {
        return this.utility.marketContract.action('paybuyoram', {
            payer,
            buyoffer_id: this.buyofferId,
        })
    }
}
