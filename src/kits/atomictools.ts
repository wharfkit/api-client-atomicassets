import type {Action, UInt64Type} from '@wharfkit/antelope'
import type {ChainDefinition} from '@wharfkit/common'

import {Link} from '../objects'
import type * as AtomicToolsContract from '../contracts/atomictoolsx'
import type {KitOptions} from '../utility'
import {KitUtility} from '../utility'

export class AtomicToolsKit {
    readonly utility: KitUtility

    constructor(url: string, chain: ChainDefinition, options?: KitOptions) {
        this.utility = new KitUtility(url, chain, options)
    }

    async loadLink(linkId: UInt64Type): Promise<Link> {
        const data = await this.utility.atomicClient.atomictools.v1.get_link(linkId)

        return Link.from(data.data, this.utility)
    }

    announceLink(value: AtomicToolsContract.ActionParams.announcelink): Action {
        return this.utility.toolsContract.action('announcelink', value)
    }
}
