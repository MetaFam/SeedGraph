import {Address, Bytes, BigInt} from '@graphprotocol/graph-ts';
import {Transfer, UserToken} from '../generated/schema';

import {
  Transfer as SEEDTransferEvent,
  ERC20 as SEED,
} from '../generated/SEED/ERC20';
import {
  Transfer as pSEEDTransferEvent,
  ERC20 as pSEED,
} from '../generated/pSEED/ERC20';

export function createUserToken(address: Bytes): UserToken {
  let user = new UserToken(address.toHexString());
  user.address = address.toHexString();
  user.pSeedBalance = BigInt.fromI32(0);
  user.pSeedTransfers = new Array<string>();
  user.seedBalance = BigInt.fromI32(0);
  user.seedTransfers = new Array<string>();
  return user;
}

export function createSEEDTransfer(event: SEEDTransferEvent): Transfer {
  let transfer = new Transfer(event.transaction.hash.toHexString());
  transfer.txHash = event.transaction.hash;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.amount = event.params.amount;
  transfer.token = event.address;
  transfer.timestamp = event.block.timestamp;

  return transfer;
}

export function createpSEEDTransfer(event: pSEEDTransferEvent): Transfer {
  let transfer = new Transfer(event.transaction.hash.toHexString());
  transfer.txHash = event.transaction.hash;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.amount = event.params.amount;
  transfer.token = event.address;
  transfer.timestamp = event.block.timestamp;

  return transfer;
}

export function getSEEDBalance(
  tokenInstance: SEED,
  address: Address,
): BigInt | null {
  let balance = tokenInstance.try_balanceOf(address);
  if (!balance.reverted) {
    return balance.value;
  }
  return null;
}

export function getpSEEDBalance(
  tokenInstance: pSEED,
  address: Address,
): BigInt | null {
  let balance = tokenInstance.try_balanceOf(address);
  if (!balance.reverted) {
    return balance.value;
  }
  return null;
}
