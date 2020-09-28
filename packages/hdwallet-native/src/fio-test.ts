const fio = require("@mcchadwick/fiosdk");

import { bip32ToAddressNList, addressNListToBIP32 } from "@mcchadwick/hdwallet-core";

import { HDWalletInfo } from "@mcchadwick/hdwallet-core/src/wallet";

const { FioJS, Ecc } = require("@fioprotocol/fiojs");
const fetchlib = require("node-fetch");

const fetchJson = async (uri, opts = {}) => {
  return fetchlib(uri, opts);
};

//const mnemonic = "valley alien library bread worry brother bundle hammer loyal barely dune brave";
const mnemonic = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle";
//const mnemonic =
//  "zoo shoot cat cheap convince unknown hello another eagle soccer brown become layer hold lens soup noodle crucial song rebuild menu display tunnel try";
//const baseUrl = "https://testnet.fioprotocol.io:443/v1/";
const baseUrl = "https://fio.eu.eosamsterdam.net/v1/";

//const payeePubKey = "FIO5VE6Dgy9FUmd1mFotXwF88HkQN1KysCWLPqpVnDMjRvGRi1YrM";
//const payeePubKey = "FIO7utjwtj3rTteGAKZZPSNJpRaLr1H6cvoMAUsmboXou7RQAb5ot";
const payeePubKey = "FIO7MpYCsLfjPGgXg8Sv7usGAw6RnFV3W6HTz1UP6HvodNXSAZiDp";
async function fioGetAddress(seed: string): Promise<string> {
  const privateKeyRes = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic);
  console.log("privateKeyRes: ", privateKeyRes);
  const publicKeyRes = await fio.FIOSDK.derivedPublicKey(privateKeyRes.fioKey);
  console.log("publicKeyRes: ", publicKeyRes);
  return "Public Key: ${publicKeyRes.publicKey}\nPrivate Key: ${privateKeyRes.privateKey}";
}

// async function fioGetBalance(pubKey: string): Promise<fio.FIOSDK.BalanceResponse> {

// }

async function fioPrepareTransaction() {
  const privateKey = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic);
  console.log(privateKey);
  const publicKey = fio.FIOSDK.derivedPublicKey(privateKey.fioKey);
  console.log(publicKey);

  const fioSdk = new fio.FIOSDK(privateKey.fioKey, publicKey.publicKey, baseUrl, fetchJson);

  const account = "fio.token";
  const action = "trnsfiopubky";
  const data = {
    payee_public_key: payeePubKey,
    amount: "1000000000",
    max_fee: 800000000000,
    tpid: "",
  };

  const res = await fioSdk.prepareTransaction(account, action, data);

  console.log(JSON.stringify(res, null, 2));
}

async function fioInitialize(mnemonic: string): Promise<any> {
  const path = addressNListToBIP32(bip32ToAddressNList("m/44'/235'/0'/0/0"));
  const privateKeyRes = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic, path);
  const privateKey = privateKeyRes.fioKey;
  console.log("privateKey", privateKey);
  const publicKeyRes = await fio.FIOSDK.derivedPublicKey(privateKey);
  const publicKey = publicKeyRes.publicKey;
  console.log("publicKey", publicKey);
  return await new fio.FIOSDK(privateKey, publicKey, baseUrl, fetchJson);
}

//console.log(fioGetAddress(mnemonic))
//fioPrepareTransaction();
fioInitialize(mnemonic)
