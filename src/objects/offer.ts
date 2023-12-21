import type {Action, NameType} from '@wharfkit/antelope'
import {Name} from '@wharfkit/antelope'
import type {OfferObject} from '../types'
import {OfferState} from '../types'
import {Asset} from './asset'
import type {KitUtility} from '../utility'

export class Offer {
    readonly data: OfferObject
    readonly sender_assets: Asset[]
    readonly recipient_assets: Asset[]
    readonly utility: KitUtility

    static from(offerObject: OfferObject, utility: KitUtility) {
        const sender_assets: Asset[] = []
        const recipient_assets: Asset[] = []

        for (const item of [
            {ass: sender_assets, objs: offerObject.sender_assets},
            {ass: recipient_assets, objs: offerObject.recipient_assets},
        ]) {
            for (const assetObject of item.objs) {
                item.ass.push(Asset.from(assetObject, utility))
            }
        }

        return new this(utility, offerObject, sender_assets, recipient_assets)
    }

    constructor(
        utility: KitUtility,
        data: OfferObject,
        sender_assets: Asset[],
        recipient_assets: Asset[]
    ) {
        this.utility = utility
        this.data = data
        this.sender_assets = sender_assets
        this.recipient_assets = recipient_assets
    }

    get offerId() {
        return this.data.offer_id
    }

    get senderName() {
        return Name.from(this.data.sender_name)
    }

    get recipientName() {
        return Name.from(this.data.recipient_name)
    }

    get memo() {
        return this.data.memo
    }

    get state() {
        return OfferState[OfferState[this.data.state.toNumber()]]
    }

    get isSenderContract() {
        return this.data.is_sender_contract
    }

    get isRecipientContract() {
        return this.data.is_recipient_contract
    }

    cancel(): Action {
        return this.utility.assetsContract.action('canceloffer', {
            offer_id: this.offerId,
        })
    }

    decline(): Action {
        return this.utility.assetsContract.action('declineoffer', {
            offer_id: this.offerId,
        })
    }

    accept(): Action {
        return this.utility.assetsContract.action('acceptoffer', {
            offer_id: this.offerId,
        })
    }

    payram(payer: NameType): Action {
        return this.utility.assetsContract.action('payofferram', {
            payer,
            offer_id: this.offerId,
        })
    }
}
