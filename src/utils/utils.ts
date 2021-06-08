import {LAYOUT} from './layouts';
import {
  Keypair,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Connection,
  PublicKey,
  Transaction,
  AccountInfo,
  Account
} from '@solana/web3.js';


import { useCallback, useState } from "react";
import { MintInfo } from "@solana/spl-token";

import { AccountInfo as TokenAccountInfo, Token } from "@solana/spl-token";


import BN from "bn.js";
import { TokenInfo } from "@solana/spl-token-registry";

import {TOKEN_PROGRAM_ID} from './token';

export const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r: any) => r.span),
);

export function encodeTokenInstructionData(instruction) {
  let b = Buffer.alloc(instructionMaxSpan);
  let span = LAYOUT.encode(instruction, b);
  return b.slice(0, span);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function newKeypairWithLamports(
    connection: Connection,
    lamports: number,
): Promise<Keypair> {
    const account = Keypair.generate();
    let retries = 10;
    for (; ;) {
        await connection.requestAirdrop(account.publicKey, lamports);
        await sleep(500);
        if (lamports == (await connection.getBalance(account.publicKey))) {
            return account;
        }
        if (--retries <= 0) {
            break;
        }
    }
    throw new Error(`Airdrop of ${lamports} failed`);
}


export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction,
  wallet: any,
  signers: Keypair[],
  skipPreflight = false,
) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
    transaction.setSigners(
    wallet.publicKey,
    ...signers.map((s) => s.publicKey),
  );
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  if(wallet instanceof Keypair || wallet instanceof Account) {
    transaction.partialSign(wallet);
  } else {
    await wallet.signTransaction(transaction);
  }
  const rawTransaction = transaction.serialize();
  let tx =  await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: 'single',
  });
  return tx;    
}


export async function getWalletBalance(connection: Connection, publicKey: PublicKey): Promise<Number> {
    return await connection.getBalance(publicKey);
}

export const TEN = new BN(10);
export const WAD = TEN.pow(new BN(18));
export const ZERO = new BN(0);

export type KnownTokenMap = Map<string, TokenInfo>;

export const formatPriceNumber = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
  info: TokenAccountInfo;
}


export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getTokenIcon(
  map: KnownTokenMap,
  mintAddress?: string | PublicKey
): string | undefined {
  const address =
    typeof mintAddress === "string" ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
}

export function isKnownMint(map: KnownTokenMap, mintAddress: string) {
  return !!map.get(mintAddress);
}

export const STABLE_COINS = new Set(["USDC", "wUSDC", "USDT"]);

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export function toLamports(
  account?: TokenAccount | number,
  mint?: MintInfo
): number {
  if (!account) {
    return 0;
  }

  const amount =
    typeof account === "number" ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  return Math.floor(amount * precision);
}

export function wadToLamports(amount?: BN): BN {
  return amount?.div(WAD) || ZERO;
}

export function fromLamports(
  account?: TokenAccount | number | BN,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const amount = Math.floor(
    typeof account === "number"
      ? account
      : BN.isBN(account)
      ? account.toNumber()
      : account.info.amount.toNumber()
  );

  const precision = Math.pow(10, mint?.decimals || 0);
  return (amount / precision) * rate;
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const abbreviateNumber = (number: number, precision: number) => {
  let tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  let suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    let scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (
  val: number,
  precision: number = 6,
  abbr: boolean = true
) => (abbr ? abbreviateNumber(val, precision) : val.toFixed(precision));

export function formatTokenAmount(
  account?: TokenAccount,
  mint?: MintInfo,
  rate: number = 1.0,
  prefix = "",
  suffix = "",
  precision = 6,
  abbr = false
): string {
  if (!account) {
    return "";
  }

  return `${[prefix]}${formatAmount(
    fromLamports(account, mint, rate),
    precision,
    abbr
  )}${suffix}`;
}

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const isSmallNumber = (val: number) => {
  return val < 0.001 && val > 0;
};

export const formatNumber = {
  format: (val?: number, useSmall?: boolean) => {
    if (!val) {
      return "--";
    }
    if (useSmall && isSmallNumber(val)) {
      return 0.001;
    }

    return numberFormatter.format(val);
  },
};

export const feeFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 9,
});

export const formatPct = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function convert(
  account?: TokenAccount | number,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const amount =
    typeof account === "number" ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  let result = (amount / precision) * rate;

  return result;
}
