import type {Action, NameType, UInt64Type} from '@wharfkit/antelope'
import {Asset as AntelopeAsset, ExtendedAsset, Name, UInt64} from '@wharfkit/antelope'
import type {SaleObject} from '../types'
import {SaleState} from '../types'
import {Collection} from './collection'
import {Asset} from './asset'
import type {KitUtility} from '../utility'

export class Sale {
    readonly data: SaleObject
    readonly collection: Collection
    readonly assets: Asset[]
    readonly price: ExtendedAsset
    readonly utility: KitUtility

    static from(saleObject: SaleObject, utility: KitUtility) {
        const collection = new Collection(utility, saleObject.collection)
        const assets = saleObject.assets.map((a) => Asset.from(a, utility))
        return new this(utility, saleObject, collection, assets)
    }

    constructor(utility: KitUtility, data: SaleObject, collection: Collection, assets: Asset[]) {
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

    get saleId() {
        return UInt64.from(this.data.sale_id)
    }

    get seller() {
        return Name.from(this.data.seller)
    }

    get buyer() {
        return this.data.buyer ? Name.from(this.data.buyer) : null
    }

    get listingPrice() {
        return AntelopeAsset.fromUnits(this.data.listing_price, this.listingSymbol)
    }

    get listingSymbol() {
        return this.price.quantity.symbol
    }

    get makerMarketplace() {
        return Name.from(this.data.maker_marketplace)
    }

    get takerMarketplace() {
        return this.data.taker_marketplace ? Name.from(this.data.taker_marketplace) : null
    }

    get state() {
        return SaleState[SaleState[this.data.state.toNumber()]]
    }

    get isSellerContract() {
        return this.data.is_seller_contract
    }

    assert(): Action {
        return this.utility.marketContract.action('assertsale', {
            sale_id: this.saleId,
            asset_ids_to_assert: this.assets.map((a) => a.assetId),
            listing_price_to_assert: this.listingPrice,
            settlement_symbol_to_assert: this.listingSymbol,
        })
    }

    cancel(): Action {
        return this.utility.marketContract.action('cancelsale', {
            sale_id: this.saleId,
        })
    }

    payram(payer: NameType): Action {
        return this.utility.marketContract.action('paysaleram', {
            payer,
            sale_id: this.saleId,
        })
    }

    purchase(
        buyer: NameType,
        intendedDelphiMedian: UInt64Type,
        takerMarketplace: NameType
    ): Action {
        return this.utility.marketContract.action('purchasesale', {
            buyer,
            sale_id: this.saleId,
            intended_delphi_median: intendedDelphiMedian,
            taker_marketplace: takerMarketplace,
        })
    }
}
