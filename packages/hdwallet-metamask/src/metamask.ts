import {
  HDWallet,
  GetPublicKey,
  PublicKey,
  RecoverDevice,
  ResetDevice,
  Coin,
  Ping,
  Pong,
  LoadDevice,
  ETHWallet,
  ETHGetAddress,
  ETHSignTx,
  ETHGetAccountPath,
  ETHAccountPath,
  ETHSignMessage,
  ETHSignedMessage,
  ETHVerifyMessage,
  ETHSignedTx,
  DescribePath,
  PathDescription,
  addressNListToBIP32,
  BIP32Path,
  slip44ByCoin,
  Transport,
  Keyring,
  HDWalletInfo,
  ETHWalletInfo
} from "@shapeshiftoss/hdwallet-core"

// TODO: replace this placeholder
function describeETHPath (path: BIP32Path): PathDescription {
  let pathStr = addressNListToBIP32(path)
  let unknown: PathDescription = {
    verbose: pathStr,
    coin: 'Ethereum',
    isKnown: false
  }

  if (path.length !== 5)
    return unknown

  if (path[0] !== 0x80000000 + 44)
    return unknown

  if (path[1] !== 0x80000000 + slip44ByCoin('Ethereum'))
    return unknown

  if ((path[2] & 0x80000000) >>> 0 !== 0x80000000)
    return unknown

  if (path[3] !== 0)
    return unknown

  if (path[4] !== 0)
    return unknown

  let index = path[2] & 0x7fffffff
  return {
    verbose: `Ethereum Account #${index}`,
    accountIdx: index,
    wholeAccount: true,
    coin: 'Ethereum',
    isKnown: true
  }
}

class MetaMaskTransport extends Transport {
  public getDeviceID() {
    return 'metamask:0'
  }

  public call (...args: any[]): Promise<any> {
    return Promise.resolve()
  }

}

export class MetaMaskHDWallet implements HDWallet, ETHWallet {
  _supportsETH: boolean = true
  _supportsETHInfo: boolean = true
  _supportsBTCInfo: boolean = false
  _supportsBTC: boolean = false
  _supportsDebugLink: boolean = false
  _isMetaMask: boolean = true

  transport = new MetaMaskTransport(new Keyring())

  info: MetaMaskHDWalletInfo & HDWalletInfo
  ethereum: any

  constructor(ethereum) {
    this.ethereum = ethereum
    this.info = new MetaMaskHDWalletInfo()
  }

  public async isLocked(): Promise<boolean> {
    return false
  }

  public getVendor(): string {
    return "Portis"
  }

  public getModel(): Promise<string> {
    return Promise.resolve('portis')
  }

  public getLabel(): Promise<string> {
    return Promise.resolve('Portis')
  }

  public initialize(): Promise<any> {
    // no means to reset the state of the Portis widget
    // while it's in the middle of execution
    return Promise.resolve()
  }

  public async hasOnDevicePinEntry(): Promise<boolean> {
    return this.info.hasOnDevicePinEntry()
  }

  public async hasOnDevicePassphrase(): Promise<boolean> {
    return this.info.hasOnDevicePassphrase()
  }

  public async hasOnDeviceDisplay(): Promise<boolean> {
    return this.info.hasOnDeviceDisplay()
  }

  public async hasOnDeviceRecovery(): Promise<boolean> {
    return this.info.hasOnDeviceRecovery()
  }

  public async hasNativeShapeShift(
    srcCoin: Coin,
    dstCoin: Coin
  ): Promise<boolean> {
    return false
  }

  public clearSession(): Promise<void> {
    throw new Error('not implemented')
  }

  public ping(msg: Ping): Promise<Pong> {
    throw new Error('not implemented')
  }

  public sendPin(pin: string): Promise<void> {
    throw new Error('not implemented')
  }

  public sendPassphrase(passphrase: string): Promise<void> {
    throw new Error('not implemented')
  }

  public sendCharacter(charater: string): Promise<void> {
    throw new Error('not implemented')
  }

  public sendWord(word: string): Promise<void> {
    throw new Error('not implemented')
  }

  public cancel(): Promise<void> {
    throw new Error('not implemented')
  }

  public wipe(): Promise<void> {
    throw new Error('not implemented')
  }

  public reset(msg: ResetDevice): Promise<void> {
    throw new Error('not implemented')
  }

  public recover(msg: RecoverDevice): Promise<void> {
    throw new Error('not implemented')
  }

  public loadDevice (msg: LoadDevice): Promise<void> {
    throw new Error('not implemented')
  }

  public async ethSupportsNetwork (chainId: number = 1): Promise<boolean> {
    return this.info.ethSupportsNetwork(chainId)
  }

  public async ethSupportsSecureTransfer (): Promise<boolean> {
    return this.info.ethSupportsSecureTransfer()
  }

  public async ethSupportsNativeShapeShift (): Promise<boolean> {
    return this.info.ethSupportsNativeShapeShift()
  }

  public async ethVerifyMessage (msg: ETHVerifyMessage): Promise<boolean> {
    throw new Error('not implemented')
  }

  public describePath (msg: DescribePath): PathDescription {
    switch (msg.coin) {
    case 'Ethereum':
      return describeETHPath(msg.path)
    default:
      throw new Error("Unsupported path")
    }
  }

  public ethNextAccountPath (msg: ETHAccountPath): ETHAccountPath | undefined {
    throw new Error('not implemented')
  }

  public async isInitialized (): Promise<boolean> {
    return true
  }

  public disconnect (): Promise<void> {
    return Promise.resolve()
  }

  public async getPublicKeys(msg: GetPublicKey[]): Promise<PublicKey[]> {
    throw new Error('not implemented')
  }

  public async ethSignTx (msg: ETHSignTx): Promise<ETHSignedTx> {
    throw new Error('not implemented')
  }

  public async ethSignMessage (msg: ETHSignMessage): Promise<ETHSignedMessage> {
    throw new Error('not implemented')
  }

  public ethGetAccountPaths (msg: ETHGetAccountPath): Array<ETHAccountPath> {
    return this.info.ethGetAccountPaths(msg)
  }

  public async ethGetAddress (msg: ETHGetAddress): Promise<string> {
    throw new Error('not implemented')
  }

  public async getDeviceID(): Promise<string> {
    throw new Error('not implemented')
  }

  public async getFirmwareVersion(): Promise<string> {
    return 'metamask'
  }
}


export class MetaMaskHDWalletInfo implements HDWalletInfo, ETHWalletInfo {
  _supportsBTCInfo: boolean = false
  _supportsETHInfo: boolean = true

  public getVendor (): string {
    return "MetaMask"
  }

  public async ethSupportsNetwork (chainId: number = 1): Promise<boolean> {
    return chainId === 1
  }

  public async ethSupportsSecureTransfer (): Promise<boolean> {
    return false
  }

  public async ethSupportsNativeShapeShift (): Promise<boolean> {
    return false
  }

  public ethGetAccountPaths (msg: ETHGetAccountPath): Array<ETHAccountPath> {
    // TODO: replace this placeholder
    return [{
      addressNList: [ 0x80000000 + 44, 0x80000000 + slip44ByCoin(msg.coin), 0x80000000 + msg.accountIdx, 0, 0 ],
      hardenedPath: [ 0x80000000 + 44, 0x80000000 + slip44ByCoin(msg.coin), 0x80000000 + msg.accountIdx ],
      relPath: [ 0, 0 ],
      description: "MetaMask"
    }]
  }

  public async hasOnDevicePinEntry (): Promise<boolean> {
    return true
  }

  public async hasOnDevicePassphrase (): Promise<boolean> {
    return true
  }

  public async hasOnDeviceDisplay (): Promise<boolean> {
    return true
  }

  public async hasOnDeviceRecovery (): Promise<boolean> {
    return true
  }

  public async hasNativeShapeShift (srcCoin: Coin, dstCoin: Coin): Promise<boolean> {
    // It doesn't... yet?
    return false
  }

  public describePath (msg: DescribePath): PathDescription {
    switch (msg.coin) {
      case 'Ethereum':
        return describeETHPath(msg.path)
      default:
        throw new Error("Unsupported path")
      }
  }

  public ethNextAccountPath (msg: ETHAccountPath): ETHAccountPath | undefined {
    throw new Error("need to implement")
  }
}

