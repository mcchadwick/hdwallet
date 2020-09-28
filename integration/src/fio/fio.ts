import { bip32ToAddressNList, HDWallet, FioWallet, supportsFio } from "@shapeshiftoss/hdwallet-core";

import { HDWalletInfo } from "@shapeshiftoss/hdwallet-core/src/wallet";

import { toHexString } from "@shapeshiftoss/hdwallet-core";

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

    test.only(
      "fioGetAddress()",
      async () => {
        if (!wallet) return;
        expect(
          await wallet.fioGetAddress({
            addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
            showDisplay: false,
          })
        ).toEqual("FIO6iLE1J4zb2SyDGTH9d6UL9Qm6hhqRce27QvP8AKxVLASGhtm7z");
      },
      TIMEOUT
    );

    test.only(
      "fioSignTx()",
      async () => {
        if (!wallet) return;
        let res = await wallet.fioSignTx({
          actions: [
            {
              account: "fio.token",
              name: "trnsfiopubky",
              data: {
                payee_public_key: "FIO7MpYCsLfjPGgXg8Sv7usGAw6RnFV3W6HTz1UP6HvodNXSAZiDp",
                amount: "1000000000",
                max_fee: 800000000000,
                tpid: "",
              },
            },
          ],
        });
        console.log(res);
        expect(res).toHaveProperty("signature");
        expect(res).toHaveProperty("serialized");
      },
      TIMEOUT
    );
  });
}

/*** KK TESTS ***/

//     test(
//       "fioGetAccountPaths()",
//       () => {
//         if (!wallet) return;
//         let paths = wallet.fioGetAccountPaths({ accountIdx: 0 });
//         expect(paths.length > 0).toBe(true);
//         expect(paths[0].addressNList[0] > 0x80000000).toBe(true);
//         paths.forEach((path) => {
//           let curAddr = path.addressNList.join();
//           let nextAddr = wallet.fioNextAccountPath(path).addressNList.join();
//           expect(nextAddr === undefined || nextAddr !== curAddr).toBeTruthy();
//         });
//       },
//       TIMEOUT
//     );

//     test(
//       "fioGetPublicKey()",
//       async () => {
//         if (!wallet) return;
//         expect(
//           await wallet.fioGetPublicKey({
//             addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
//             showDisplay: false,
//             kind: FioPublicKeyKind.FIO,
//           })
//         ).toEqual("FIO5kJKNHwctcfUM5XZyiWSqSTM5HTzznJP9F3ZdbhaQAHEVq575o");
//       },
//       TIMEOUT
//     );

//     test(
//       "kk integration fioSignTx()",
//       async () => {
//         if (!wallet) return;
//         let txData = tx01_unsigned as any;
//         let res = await wallet.fioSignTx({
//           addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
//           chain_id: txData.chain_id as string,
//           tx: txData.transaction as FioTx,
//         });
//         expect(res.signature).toEqual(31);
//         expect(res.serialized).toEqual("");
//       },
//       TIMEOUT
//     );

//     test(
//       "confirmed on chain fioSignTx()",
//       async () => {
//         if (!wallet) return;
//         let txData = tx02_unsigned as any;
//         let res = await wallet.fioSignTx({
//           addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
//           chain_id: txData.chain_id as string,
//           tx: txData.transaction as FioTx,
//         });
//         expect(res.signature).toEqual(31);
//         expect(res.serialized).toEqual("");
//       },
//       TIMEOUT
//     );
//   });
// }
