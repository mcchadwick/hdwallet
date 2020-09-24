import { FioPublicKeyKind } from "@keepkey/device-protocol/lib/messages-fio_pb";

import { bip32ToAddressNList, HDWallet, FioWallet, supportsFio, FioTx } from "@mcchadwick/hdwallet-core";

import { HDWalletInfo } from "@mcchadwick/hdwallet-core/src/wallet";

import { toHexString } from "@mcchadwick/hdwallet-core";

import * as tx01_unsigned from "./tx01.unsigned.json";
import * as tx02_unsigned from "./tx02.unsigned.json";

const MNEMONIC12_NOPIN_NOPASSPHRASE = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle";
const MNEMONIC12_FIO_DEMO = "valley alien library bread worry brother bundle hammer loyal barely dune brave";

const TIMEOUT = 60 * 1000;

export function fioTests(get: () => { wallet: HDWallet; info: HDWalletInfo }): void {
  let wallet: FioWallet & HDWallet;

  describe("Fio", () => {
    beforeAll(async () => {
      const { wallet: w } = get();
      if (supportsFio(w)) wallet = w;
    });

    beforeEach(async () => {
      if (!wallet) return;
      await wallet.wipe();
      await wallet.loadDevice({
        mnemonic: MNEMONIC12_NOPIN_NOPASSPHRASE,
        label: "test",
        skipChecksum: true,
      });
    }, TIMEOUT);

    test("fioGetPublicKey()", async () => {
      if (!wallet) return;
      expect(
        await wallet.fioGetPublicKey({
          addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
          showDisplay: false,
          kind: FioPublicKeyKind.FIO,
        })
      ).toEqual("FIO5kJKNHwctcfUM5XZyiWSqSTM5HTzznJP9F3ZdbhaQAHEVq575o");
    });
  });
}
