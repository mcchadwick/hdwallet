import * as core from "@shapeshiftoss/hdwallet-core";

import BncClient from "bnb-javascript-sdk-nobroadcast";
import * as bitcoin from "bitcoinjs-lib";
import { getNetwork } from "./networks";
import { mnemonicToSeed } from "bip39";
import { toWords, encode } from "bech32";
import CryptoJS, { RIPEMD160, SHA256 } from "crypto-js";

export function MixinNativeBinanceWalletInfo<TBase extends core.Constructor>(Base: TBase) {
  return class MixinNativeBinanceWalletInfo extends Base implements core.BinanceWalletInfo {
    _supportsBinanceInfo = true;

    async binanceSupportsNetwork(): Promise<boolean> {
      return true;
    }

    async binanceSupportsSecureTransfer(): Promise<boolean> {
      return false;
    }

    binanceSupportsNativeShapeShift(): boolean {
      return false;
    }

    binanceGetAccountPaths(msg: core.BinanceGetAccountPaths): Array<core.BinanceAccountPath> {
      return [
        {
          addressNList: [0x80000000 + 44, 0x80000000 + 117, 0x80000000 + msg.accountIdx, 0, 0],
        },
      ];
    }

    binanceNextAccountPath(msg: core.BinanceAccountPath): core.BinanceAccountPath {
      // Only support one account for now (like portis).
      return undefined;
    }
  };
}

export function MixinNativeBinanceWallet<TBase extends core.Constructor>(Base: TBase) {
  return class MixinNativeBinanceWallet extends Base {
    _supportsBinance = true;
    #seed: Buffer;

    async binanceInitializeWallet(mnemonic: string): Promise<void> {
      this.#seed = await mnemonicToSeed(mnemonic);
    }

    bech32ify(address: ArrayLike<number>, prefix: string): string {
      const words = toWords(address);
      return encode(prefix, words);
    }

    createBinanceAddress(publicKey: string) {
      const message = SHA256(CryptoJS.enc.Hex.parse(publicKey));
      const hash = RIPEMD160(message as any).toString();
      const address = Buffer.from(hash, `hex`);
      const cosmosAddress = this.bech32ify(address, `bnb`);
      return cosmosAddress;
    }

    async binanceGetAddress(msg: core.BinanceGetAddress): Promise<string> {
      const network = getNetwork("binance");
      const wallet = bitcoin.bip32.fromSeed(this.#seed, network);
      const path = core.addressNListToBIP32(msg.addressNList);
      const keypair = bitcoin.ECPair.fromWIF(wallet.derivePath(path).toWIF(), network);
      const address = this.createBinanceAddress(keypair.publicKey.toString("hex"));

      return address;
    }

    async binanceSignTx(msg: core.BinanceSignTx): Promise<core.BinanceSignedTx> {
      const network = getNetwork("binance");
      const mKey = bitcoin.bip32.fromSeed(this.#seed, network);
      const path = core.addressNListToBIP32(msg.addressNList);

      const keypair = bitcoin.ECPair.fromWIF(mKey.derivePath(path).toWIF(), network);
      const privateKey = keypair.privateKey.toString("hex");

      //use sdk to build Amino encoded hex transaction
      const client = new BncClient("https://dex.binance.org"); //broadcast not used but available
      await client.chooseNetwork("mainnet");
      await client.setPrivateKey(privateKey);
      await client.initChain();

      const addressFrom = msg.tx.msgs[0].inputs[0].address;
      const addressTo = msg.tx.msgs[0].outputs[0].address;
      const amount = msg.tx.msgs[0].inputs[0].coins[0].amount;
      const asset = "BNB";
      const message = msg.tx.memo || "";

      const result = await client.transfer(addressFrom, addressTo, amount, asset, message, null);

      const rawHex = result.serialize();
      const buffer = Buffer.from(rawHex, "hex");
      const txid = SHA256(buffer.toString()).toString().toUpperCase();

      const pub_key = result.signatures[0].pub_key.toString("hex");
      const signature = new Buffer(result.signatures[0].signature, "base64").toString("base64");

      return {
        account_number: result.account,
        chain_id: result.chain_id,
        data: null,
        memo: result.memo,
        msgs: result.msgs,
        signatures: {
          pub_key,
          signature,
        },
        txid,
        serialized: result.serialized,
      };
    }
  };
}
