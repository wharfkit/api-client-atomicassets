import type {APIClient} from '@wharfkit/antelope'
import {AssetsV1APIClient} from './assets/v1'

export class AssetsAPIClient {
    public v1: AssetsV1APIClient

    constructor(private client: APIClient) {
        this.v1 = new AssetsV1APIClient(client)
    }
}
