import {User} from '../generated/schema';

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
  createUser,
  getSEEDBalance,
  getpSEEDBalance,
} from './helpers';
import {BigInt} from '@graphprotocol/graph-ts';

export function handleSEED(event: SEEDTransferEvent): void {
  let fromUser = User.load(event.params.from.toHexString());
  if (fromUser == null) {
    fromUser = createUser(event.params.from);
  }
  let toUser = User.load(event.params.to.toHexString());
  if (toUser == null) {
    toUser = createUser(event.params.to);
  }

  let transfer = createSEEDTransfer(event);

  let seedTransfers = fromUser.seedTransfers;
  seedTransfers.push(transfer.id);
  fromUser.seedTransfers = seedTransfers;

  seedTransfers = toUser.seedTransfers;
  seedTransfers.push(transfer.id);
  toUser.seedTransfers = seedTransfers;

  let tokenInstance = SEED.bind(event.address);

  let fromBalance = getSEEDBalance(tokenInstance, event.params.from);
  if (fromBalance != null) {
    fromUser.seedBalance = fromBalance as BigInt;
  }

  let toBalance = getSEEDBalance(tokenInstance, event.params.to);
  if (toBalance != null) {
    toUser.seedBalance = toBalance as BigInt;
  }

  transfer.save();
  fromUser.save();
  toUser.save();
}

export function handlepSEED(event: pSEEDTransferEvent): void {
  let fromUser = User.load(event.params.from.toHexString());
  if (fromUser == null) {
    fromUser = createUser(event.params.from);
  }
  let toUser = User.load(event.params.to.toHexString());
  if (toUser == null) {
    toUser = createUser(event.params.to);
  }

  let transfer = createpSEEDTransfer(event);

  let pSeedTransfers = fromUser.pSeedTransfers;
  pSeedTransfers.push(transfer.id);
  fromUser.pSeedTransfers = pSeedTransfers;

  pSeedTransfers = toUser.pSeedTransfers;
  pSeedTransfers.push(transfer.id);
  toUser.pSeedTransfers = pSeedTransfers;

  let tokenInstance = pSEED.bind(event.address);

  let fromBalance = getpSEEDBalance(tokenInstance, event.params.from);
  if (fromBalance != null) {
    fromUser.pSeedBalance = fromBalance as BigInt;
  }

  let toBalance = getpSEEDBalance(tokenInstance, event.params.to);
  if (toBalance != null) {
    toUser.pSeedBalance = toBalance as BigInt;
  }

  transfer.save();
  fromUser.save();
  toUser.save();
}
