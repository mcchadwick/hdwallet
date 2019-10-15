import { HDWallet, HDWalletInfo } from '@shapeshiftoss/hdwallet-core'

import { bitcoinTests } from './bitcoin'
import { testnetTests } from './testnet'
import { litecoinTests } from './litecoin'
import { bitcoinCashTests } from './bitcoin-cash'

export function btcTests (get: () => { wallet: HDWallet, info: HDWalletInfo }): void {
  bitcoinTests(get)
  testnetTests(get)
  litecoinTests(get)
  bitcoinCashTests(get)
}
