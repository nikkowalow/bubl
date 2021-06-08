import {
    Keypair,
    PublicKey
} from '@solana/web3.js';

import * as solana from '../configs/solana.json';

export const PAYER_KEYPAIR: Keypair = Keypair.fromSecretKey(new Uint8Array([15, 126, 13, 230, 54, 171, 219, 210, 214, 246, 6, 29, 72, 168, 147, 160, 213, 4, 158, 170, 182, 34, 57, 50, 230, 39, 23, 132, 41, 158, 163, 166, 209, 220, 167, 27, 108, 52, 124, 214, 89, 216, 68, 139, 154, 35, 104, 236, 16, 138, 116, 204, 6, 34, 234, 3, 159, 117, 63, 141, 170, 174, 174, 68]));
export const DATA_UPLOAD_PUBKEY: PublicKey = new PublicKey(solana.programs.DATA_UPLOAD_PROGRAM);
export const TOKEN_PROGRAM_PUBKEY: PublicKey = new PublicKey(solana.programs.TOKEN_PROGRAM);


export const BASE_SEED: string = "bubl.test_";
export const EVENT_SEED: string = "event_";
export const MINT_SEED: string = "mint_";
export const MINT_AUTHORITY_SEED: string = "mintAuthority_";
export const TICKET_WALLET_SEED: string = "ticket_wallet_";

export const CLUSTER: string = solana.endpoints.DEVNET_CLUSTER;


export const DATE_LENGTH = 10;
export const NUM_STEPS_FOR_FORM = 7;
