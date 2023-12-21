import type {Action, AssetType, NameType} from '@wharfkit/antelope'
import {Asset as AntelopeAsset, ExtendedAsset, Name, UInt64} from '@wharfkit/antelope'
import type {AuctionObject} from '../types'
import {AuctionState} from '../types'
import {Collection} from './collection'
import {Asset} from './asset'
import type {KitUtility} from '../utility'

export class Auction {
    readonly data: AuctionObject
    readonly collection: Collection
    readonly assets: Asset[]
    readonly price: ExtendedAsset
    readonly utility: KitUtility

    static from(auctionObject: AuctionObject, utility: KitUtility) {
        const collection = new Collection(utility, auctionObject.collection)
        const assets = auctionObject.assets.map((a) => Asset.from(a, utility))
        return new this(utility, auctionObject, collection, assets)
    }

    constructor(utility: KitUtility, data: AuctionObject, collection: Collection, assets: Asset[]) {
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

    get auctionId() {
        return UInt64.from(this.data.auction_id)
    }

    get seller() {
        return Name.from(this.data.seller)
    }

    get buyer() {
        return this.data.buyer ? Name.from(this.data.buyer) : null
    }

    get endTime() {
        return this.data.end_time
    }

    get bids() {
        return this.data.bids
    }

    get state() {
        return AuctionState[AuctionState[this.data.state.toNumber()]]
    }

    get claimedBySeller() {
        return this.data.claimed_by_seller
    }

    get claimedByBuyer() {
        return this.data.claimed_by_buyer
    }

    get makerMarketplace() {
        return Name.from(this.data.maker_marketplace)
    }

    get takerMarketplace() {
        return this.data.taker_marketplace ? Name.from(this.data.taker_marketplace) : null
    }

    get isSellerContract() {
        return this.data.is_seller_contract
    }

    assert(): Action {
        return this.utility.marketContract.action('assertauct', {
            auction_id: this.auctionId,
            asset_ids_to_assert: this.assets.map((a) => a.assetId),
        })
    }

    claimBuy(): Action {
        return this.utility.marketContract.action('auctclaimbuy', {
            auction_id: this.auctionId,
        })
    }

    claimSell(): Action {
        return this.utility.marketContract.action('auctclaimsel', {
            auction_id: this.auctionId,
        })
    }

    bid(bidder: NameType, bid: AssetType, takerMarketplace: NameType): Action {
        return this.utility.marketContract.action('auctionbid', {
            bidder,
            auction_id: this.auctionId,
            bid,
            taker_marketplace: takerMarketplace,
        })
    }

    cancel(): Action {
        return this.utility.marketContract.action('cancelauct', {
            auction_id: this.auctionId,
        })
    }

    payram(payer: NameType): Action {
        return this.utility.marketContract.action('payauctram', {
            payer,
            auction_id: this.auctionId,
        })
    }
}
