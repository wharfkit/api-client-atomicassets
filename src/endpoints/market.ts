import type {APIClient} from '@wharfkit/antelope'
import {MarketV1APIClient} from './market/v1'
import {MarketV2APIClient} from './market/v2'

export class MarketAPIClient {
    public v1: MarketV1APIClient
    public v2: MarketV2APIClient

    constructor(private client: APIClient) {
        this.v1 = new MarketV1APIClient(client)
        this.v2 = new MarketV2APIClient(client)
    }
}
