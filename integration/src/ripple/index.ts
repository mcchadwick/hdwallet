import { HDWallet, HDWalletInfo } from "@mcchadwick/hdwallet-core";

import { rippleTests as tests } from "./ripple";

export function rippleTests(
  get: () => { wallet: HDWallet; info: HDWalletInfo }
): void {
  tests(get);
}
