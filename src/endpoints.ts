import type {APIClient} from '@wharfkit/antelope'
import {AssetsAPIClient} from './endpoints/assets'
import {MarketAPIClient} from './endpoints/market'
import {ToolsAPIClient} from './endpoints/tools'

export class AtomicAssetsAPIClient {
    public atomicassets: AssetsAPIClient
    public atomicmarket: MarketAPIClient
    public atomictools: ToolsAPIClient

    constructor(private client: APIClient) {
        this.atomicassets = new AssetsAPIClient(client)
        this.atomicmarket = new MarketAPIClient(client)
        this.atomictools = new ToolsAPIClient(client)
    }
}
