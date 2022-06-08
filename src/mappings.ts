import {UserToken} from '../generated/schema';

import {
  Transfer as SEEDTransferEvent,
  ERC20 as SEED,
} from '../generated/SEED/ERC20';
import {
  Transfer as pSEEDTransferEvent,
  ERC20 as pSEED,
} from '../generated/pSEED/ERC20';

import {
  createSEEDTransfer,
  createpSEEDTransfer,
  createUserToken,
  getSEEDBalance,
  getpSEEDBalance,
} from './helpers';
import {BigInt} from '@graphprotocol/graph-ts';

export function handleSEED(event: SEEDTransferEvent): void {
  let fromUserToken = UserToken.load(event.params.from.toHexString());
  if (fromUserToken == null) {
    fromUserToken = createUserToken(event.params.from);
  }
  let toUserToken = UserToken.load(event.params.to.toHexString());
  if (toUserToken == null) {
    toUserToken = createUserToken(event.params.to);
  }

  let transfer = createSEEDTransfer(event);

  let seedTransfers = fromUserToken.seedTransfers;
  seedTransfers.push(transfer.id);
  fromUserToken.seedTransfers = seedTransfers;

  seedTransfers = toUserToken.seedTransfers;
  seedTransfers.push(transfer.id);
  toUserToken.seedTransfers = seedTransfers;

  let tokenInstance = SEED.bind(event.address);

  let fromBalance = getSEEDBalance(tokenInstance, event.params.from);
  if (fromBalance !== null) {
    fromUserToken.seedBalance = fromBalance as BigInt;
  }

  let toBalance = getSEEDBalance(tokenInstance, event.params.to);
  if (toBalance !== null) {
    toUserToken.seedBalance = toBalance as BigInt;
  }

  transfer.save();
  fromUserToken.save();
  toUserToken.save();
}

export function handlepSEED(event: pSEEDTransferEvent): void {
  let fromUserToken = UserToken.load(event.params.from.toHexString());
  if (fromUserToken == null) {
    fromUserToken = createUserToken(event.params.from);
  }
  let toUserToken = UserToken.load(event.params.to.toHexString());
  if (toUserToken == null) {
    toUserToken = createUserToken(event.params.to);
  }

  let transfer = createpSEEDTransfer(event);

  let pSeedTransfers = fromUserToken.pSeedTransfers;
  pSeedTransfers.push(transfer.id);
  fromUserToken.pSeedTransfers = pSeedTransfers;

  pSeedTransfers = toUserToken.pSeedTransfers;
  pSeedTransfers.push(transfer.id);
  toUserToken.pSeedTransfers = pSeedTransfers;

  let tokenInstance = pSEED.bind(event.address);

  let fromBalance = getpSEEDBalance(tokenInstance, event.params.from);
  if (fromBalance !== null) {
    fromUserToken.pSeedBalance = fromBalance as BigInt;
  }

  let toBalance = getpSEEDBalance(tokenInstance, event.params.to);
  if (toBalance !== null) {
    toUserToken.pSeedBalance = toBalance as BigInt;
  }

  transfer.save();
  fromUserToken.save();
  toUserToken.save();
}
