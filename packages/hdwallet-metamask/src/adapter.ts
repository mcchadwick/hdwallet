import {
  Keyring,
  HDWallet,
  Events
} from '@shapeshiftoss/hdwallet-core'

import { MetaMaskHDWallet } from './metamask'

type MetamaskWallet = any

const INACTIVITY_LOGOUT_TIME = 10 * 60 * 1000

export class MetaMaskAdapter {
  keyring: Keyring
  portis: any
  portisAppId: string

  /// wallet id to remove from the keyring when the active wallet changes
  currentDeviceId: string

  private constructor (keyring: Keyring) {
    this.keyring = keyring
  }

  public static useKeyring (keyring: Keyring) {
    return new MetaMaskAdapter(keyring)
  }

  public async initialize (): Promise<number> {
    return Object.keys(this.keyring.wallets).length
  }

  public async pairDevice (): Promise<HDWallet> {
    const metamask = window && window['ethereum']

    if (!metamask) return null

    metamask.on('accountsChanged', (accts) => {
      console.log('accounts changed to: ', accts)
    })

    const wallet = new MetaMaskHDWallet(metamask)
    await wallet.initialize()
    const deviceId = await wallet.getDeviceID()
    this.keyring.add(wallet, deviceId)
    this.keyring.emit(["MetaMask", deviceId, Events.CONNECT], deviceId)
    return wallet
  }

  private onAccountsChanged (accounts: string[]) {
    console.log('so private')
    console.log('accounts changed to: ', accounts)
  }
}
