import {
    bip32ToAddressNList,
    HDWallet,
    BTCWallet,
    supportsBTC,
    BTCInputScriptType,
    Coin,
    HDWalletInfo
} from '@shapeshiftoss/hdwallet-core'

const MNEMONIC12_NOPIN_NOPASSPHRASE = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

const TIMEOUT = 60 * 1000

/**
 *  Main integration suite for testing BTCWallet implementations' Litecoin support.
 */
export function bitcoinCashTests (get: () => {wallet: HDWallet, info: HDWalletInfo}): void {

    let wallet: BTCWallet & HDWallet

    describe('BitcoinCash', () => {

        beforeAll(() => {
            const { wallet: w } = get()
            if (supportsBTC(w))
                wallet = w
        })

        beforeEach(async () => {
            if (!wallet) return
            await wallet.wipe()
            await wallet.loadDevice({ mnemonic: MNEMONIC12_NOPIN_NOPASSPHRASE, label: 'test', skipChecksum: true })
        }, TIMEOUT)

        it('should pass', function() {
            expect(true).toBeTruthy()
        })

    })
}
