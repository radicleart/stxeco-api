import { getAddressInfo } from './rpc_wallet.js'
import fetch from 'node-fetch';
import { BASE_URL, OPTIONS, handleError } from '../../routes/bitcoin/BitcoinRPCController.js'

export async function startScantxoutset(address:string) {
  const addressInfo:any = await getAddressInfo(address);
  let dataString = `{"jsonrpc":"1.0","id":"curltext","method":"scantxoutset","params":["start", ["raw(${addressInfo.scriptPubKey})"]]}`;
  OPTIONS.body = dataString;
  fetch(BASE_URL, OPTIONS);

  dataString = `{"jsonrpc":"1.0","id":"curltext","method":"scantxoutset","params":["status"]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'scantxoutset not found');
  const result = await response.json();
  return result.result;
}

export async function getBlockChainInfo() {
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'Receive by address error: ');
  const result = await response.json();
  return result.result;
}

export async function getBlockHeader(hash:string, verbosity:boolean) {
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockheader","params":["${hash}", ${verbosity}]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'getBlockHeader error: ');
  const result = await response.json();
  return result.result;
}

export async function getBlock(hash:string, verbosity:number) {
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${hash}", ${verbosity}]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'getBlock error: ');
  const result = await response.json();
  return result.result;
}

export async function getTxOutProof(txs:Array<string>, blockhash:string) {
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"gettxoutproof","params":["${txs}", ${blockhash}]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'getTxOutProof error: ');
  const result = await response.json();
  return result.result;
}

export async function getBlockCount() {
  const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockcount","params":[]}`;
  OPTIONS.body = dataString;
  const response = await fetch(BASE_URL, OPTIONS);
  await handleError(response, 'Receive by address error: ');
  const result = await response.json();
  return { count: result.result };
}
