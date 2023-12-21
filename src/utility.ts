import {APIClient, FetchProvider} from '@wharfkit/antelope'
import type {Contract} from '@wharfkit/contract'
import type {ChainDefinition} from '@wharfkit/common'

import {AtomicAssetsAPIClient} from './endpoints'

import * as AtomicAssetsContract from './contracts/atomicassets'
import * as AtomicMarketContract from './contracts/atomicmarket'
import * as AtomicToolsContract from './contracts/atomictoolsx'

export interface KitOptions {
    assetsContract?: Contract
    marketContract?: Contract
    toolsContract?: Contract
    client?: APIClient
    atomicClient?: AtomicAssetsAPIClient
}

export class KitUtility {
    readonly url: string
    readonly chain: ChainDefinition
    readonly client: APIClient
    readonly atomicClient: AtomicAssetsAPIClient
    readonly assetsContract: Contract
    readonly marketContract: Contract
    readonly toolsContract: Contract

    constructor(url: string, chain: ChainDefinition, options?: KitOptions) {
        this.url = url
        this.chain = chain
        this.client = options?.client || new APIClient({url: this.chain.url})
        this.atomicClient =
            options?.atomicClient ||
            new AtomicAssetsAPIClient(new APIClient({provider: new FetchProvider(this.url)}))
        this.assetsContract =
            options?.assetsContract || new AtomicAssetsContract.Contract({client: this.client})
        this.marketContract =
            options?.marketContract || new AtomicMarketContract.Contract({client: this.client})
        this.toolsContract =
            options?.toolsContract || new AtomicToolsContract.Contract({client: this.client})
    }
}
