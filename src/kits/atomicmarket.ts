import type {Action, UInt64Type} from '@wharfkit/antelope'
import type {ChainDefinition} from '@wharfkit/common'

import {Auction, Buyoffer, Sale} from '../objects'
import type * as AtomicMarketContract from '../contracts/atomicmarket'
import type {KitOptions} from '../utility'
import {KitUtility} from '../utility'

export class AtomicMarketKit {
    readonly utility: KitUtility

    constructor(url: string, chain: ChainDefinition, options?: KitOptions) {
        this.utility = new KitUtility(url, chain, options)
    }

    async loadAuction(auctionId: UInt64Type): Promise<Auction> {
        const data = await this.utility.atomicClient.atomicmarket.v1.get_auction(auctionId)

        return Auction.from(data.data, this.utility)
    }

    announceAuction(value: AtomicMarketContract.ActionParams.announceauct): Action {
        return this.utility.marketContract.action('announceauct', value)
    }

    async loadSale(saleId: UInt64Type): Promise<Sale> {
        const data = await this.utility.atomicClient.atomicmarket.v1.get_sale(saleId)

        return Sale.from(data.data, this.utility)
    }

    announceSale(value: AtomicMarketContract.ActionParams.announcesale): Action {
        return this.utility.marketContract.action('announcesale', value)
    }

    async loadBuyoffer(buyofferId: UInt64Type): Promise<Buyoffer> {
        const data = await this.utility.atomicClient.atomicmarket.v1.get_buyoffer(buyofferId)

        return Buyoffer.from(data.data, this.utility)
    }

    createBuyo(value: AtomicMarketContract.ActionParams.createbuyo): Action {
        return this.utility.marketContract.action('createbuyo', value)
    }

    addBonusfeeCounter(value: AtomicMarketContract.ActionParams.addbonusfee): Action {
        return this.utility.marketContract.action('addafeectr', value)
    }

    addBonusfee(value: AtomicMarketContract.ActionParams.addbonusfee): Action {
        return this.utility.marketContract.action('addbonusfee', value)
    }

    delBonusfee(value: AtomicMarketContract.ActionParams.delbonusfee): Action {
        return this.utility.marketContract.action('delbonusfee', value)
    }

    stopBonusfee(value: AtomicMarketContract.ActionParams.stopbonusfee): Action {
        return this.utility.marketContract.action('stopbonusfee', value)
    }

    addConfToken(value: AtomicMarketContract.ActionParams.addconftoken): Action {
        return this.utility.marketContract.action('addconftoken', value)
    }

    addDelphi(value: AtomicMarketContract.ActionParams.adddelphi): Action {
        return this.utility.marketContract.action('adddelphi', value)
    }

    registerMarketplace(value: AtomicMarketContract.ActionParams.regmarket): Action {
        return this.utility.marketContract.action('regmarket', value)
    }

    setMarketfee(value: AtomicMarketContract.ActionParams.setmarketfee): Action {
        return this.utility.marketContract.action('setmarketfee', value)
    }

    setMinbidinc(value: AtomicMarketContract.ActionParams.setminbidinc): Action {
        return this.utility.marketContract.action('setminbidinc', value)
    }

    setVersion(value: AtomicMarketContract.ActionParams.setversion): Action {
        return this.utility.marketContract.action('setversion', value)
    }

    withdraw(value: AtomicMarketContract.ActionParams.withdraw): Action {
        return this.utility.marketContract.action('withdraw', value)
    }
}
