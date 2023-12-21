import type {Action, NameType, SignatureType} from '@wharfkit/antelope'
import {Name, PublicKey, UInt64} from '@wharfkit/antelope'
import type {LinkObject} from '../types'
import {LinkState} from '../types'
import {Asset} from './asset'
import type {KitUtility} from '../utility'

export class Link {
    readonly data: LinkObject
    readonly assets: Asset[]
    readonly utility: KitUtility
    readonly publicKey: PublicKey

    static from(linkObject: LinkObject, utility: KitUtility) {
        const assets = linkObject.assets.map((a) => Asset.from(a, utility))
        return new this(utility, linkObject, assets)
    }

    constructor(utility: KitUtility, data: LinkObject, assets: Asset[]) {
        this.utility = utility
        this.data = data
        this.assets = assets
        this.publicKey = PublicKey.from(this.data.public_key)
    }

    get linkId() {
        return UInt64.from(this.data.link_id)
    }

    get creator() {
        return Name.from(this.data.creator)
    }

    get claimer() {
        return this.data.claimer ? Name.from(this.data.claimer) : null
    }

    get state() {
        return LinkState[LinkState[this.data.state.toNumber()]]
    }

    get memo() {
        return this.data.memo
    }

    cancel(): Action {
        return this.utility.toolsContract.action('cancellink', {link_id: this.linkId})
    }

    claim(claimer: NameType, claimerSignature: SignatureType): Action {
        return this.utility.toolsContract.action('claimlink', {
            link_id: this.linkId,
            claimer,
            claimer_signature: claimerSignature,
        })
    }
}
