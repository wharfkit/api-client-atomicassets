import type {Action, Float64Type, NameType} from '@wharfkit/antelope'
import {Float64, Name} from '@wharfkit/antelope'
import type {CollectionObject} from '../types'
import type * as AtomicAssetsContract from '../contracts/atomicassets'
import type {KitUtility} from '../utility'

export class Collection {
    readonly data: CollectionObject
    readonly utility: KitUtility

    static from(collectionObject: CollectionObject, utility: KitUtility) {
        return new this(utility, collectionObject)
    }

    constructor(utility: KitUtility, data: CollectionObject) {
        this.utility = utility
        this.data = data
    }

    get collectionName() {
        return Name.from(this.data.collection_name)
    }

    get author() {
        return Name.from(this.data.author)
    }

    get allowNotify() {
        return this.data.allow_notify
    }

    get authorizedAccounts() {
        return this.data.authorized_accounts.map((a) => Name.from(a))
    }

    get notifyAccounts() {
        return this.data.notify_accounts.map((a) => Name.from(a))
    }

    get marketFee() {
        return Float64.from(this.data.market_fee)
    }

    get collectionData() {
        return this.data.data
    }

    get name() {
        return this.data.name
    }

    get image() {
        return this.data.img
    }

    addAuth(account: NameType): Action {
        return this.utility.assetsContract.action('addcolauth', {
            collection_name: this.collectionName,
            account_to_add: account,
        })
    }

    removeAuth(account: NameType): Action {
        return this.utility.assetsContract.action('remcolauth', {
            collection_name: this.collectionName,
            account_to_remove: account,
        })
    }

    setData(data: AtomicAssetsContract.ActionParams.Type.pair_string_ATOMIC_ATTRIBUTE[]): Action {
        return this.utility.assetsContract.action('setcoldata', {
            collection_name: this.collectionName,
            data,
        })
    }

    addNotifyAccount(account: NameType): Action {
        return this.utility.assetsContract.action('addnotifyacc', {
            collection_name: this.collectionName,
            account_to_add: account,
        })
    }

    removeNotifyAccount(account: NameType): Action {
        return this.utility.assetsContract.action('remnotifyacc', {
            collection_name: this.collectionName,
            account_to_remove: account,
        })
    }

    setMarketFee(fee: Float64Type): Action {
        return this.utility.assetsContract.action('setmarketfee', {
            collection_name: this.collectionName,
            market_fee: fee,
        })
    }

    forbidnotify(): Action {
        return this.utility.assetsContract.action('forbidnotify', {
            collection_name: this.collectionName,
        })
    }
}
