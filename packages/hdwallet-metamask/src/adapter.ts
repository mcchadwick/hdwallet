import {
  Keyring,
  HDWallet,
  Events
} from '@shapeshiftoss/hdwallet-core'

import { MetamaskHDWallet } from './metamask'

type MetamaskWallet = any

const INACTIVITY_LOGOUT_TIME = 10 * 60 * 1000

export class MetamaskAdapter {
  keyring: Keyring
  portis: any
  portisAppId: string

  /// wallet id to remove from the keyring when the active wallet changes
  currentDeviceId: string

  private constructor (keyring: Keyring) {
    this.keyring = keyring
  }

  public static useKeyring (keyring: Keyring, args: { portis?: MetamaskWallet, portisAppId?: string }) {
    return new MetamaskAdapter(keyring)
  }

  public async initialize (): Promise<number> {
    return Object.keys(this.keyring.wallets).length
  }

  public async pairDevice (): Promise<HDWallet> {
    return new MetamaskHDWallet('ethereum')
  }
}
