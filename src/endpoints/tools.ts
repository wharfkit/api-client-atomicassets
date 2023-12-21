import type {APIClient} from '@wharfkit/antelope'
import {ToolsV1APIClient} from './tools/v1'

export class ToolsAPIClient {
    public v1: ToolsV1APIClient

    constructor(private client: APIClient) {
        this.v1 = new ToolsV1APIClient(client)
    }
}
