import { HDWallet, HDWalletInfo } from "@shapeshiftoss/hdwallet-core";

import { fioTests as tests } from "./fio";

export function fioTests(get: () => { wallet: HDWallet; info: HDWalletInfo }): void {
  tests(get);
}
