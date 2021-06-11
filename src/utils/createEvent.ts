import * as solanaConfig from '../configs/solana.json';
import BufferLayout from 'buffer-layout';

import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
    Account
} from '@solana/web3.js';

import {
    createToken
} from './token';

import {
    PAYER_KEYPAIR,
    DATA_UPLOAD_PUBKEY,
    BASE_SEED,
    EVENT_SEED,
    MINT_SEED,
    MINT_AUTHORITY_SEED,
    TICKET_WALLET_SEED,
    CLUSTER
} from '../constants';

const programId: PublicKey = DATA_UPLOAD_PUBKEY;
const sequenceProgramId: PublicKey = new PublicKey(solanaConfig.programs.SEQUENCE_INCREMENTATION_PROGRAM);
let connection: Connection = new Connection(CLUSTER, 'singleGossip');
var sequencePubkey: PublicKey = new PublicKey(solanaConfig.accounts.SEQUENCE_NUMBER_ACCOUNT);

export async function setEventData(data: any) {
    const span = JSON.stringify(data).length;
    return createBuffer(span);
}

export async function establishConnection(): Promise<void> {
    connection = new Connection(CLUSTER, 'singleGossip');
}

export function createBuffer(span: number) {
    return BufferLayout.struct([
        BufferLayout.blob(span, 'metadata'),
    ]);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function assignFunder(span:number): Promise<void> {
    if (!PAYER_KEYPAIR) {
        let fees = 0;
        const { feeCalculator } = await connection.getRecentBlockhash();
        const NUM_RETRIES = 500;
        fees += await connection.getMinimumBalanceForRentExemption(span);
        fees += LAMPORTS_PER_SOL;
        fees += feeCalculator.lamportsPerSignature * 100;
    }
}

export async function createSequenceKeypair() {
    const sequenceKeypair = new Keypair();
    sequencePubkey = sequenceKeypair.publicKey;
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
        fromPubkey: PAYER_KEYPAIR.publicKey,
        newAccountPubkey: sequencePubkey,
        lamports: LAMPORTS_PER_SOL,
        space: 10,
        programId: sequenceProgramId,
        }),
    );
    await sendAndConfirmTransaction(
        connection,
        transaction,
        [PAYER_KEYPAIR, sequenceKeypair],
        {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
        },
    );
}

export async function fundKeypair(sender: Keypair, receiver: Account, span: number) {
    let transaction = new Transaction();
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            lamports: await calculateFees(span), 
            toPubkey: receiver.publicKey
        })
    );
    await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender],
        {
            commitment: 'singleGossip',
            preflightCommitment: 'singleGossip',
        },
    );
    return receiver;
}

export async function calculateFees(span: number): Promise<number> {
    let fees = 0;
    const { feeCalculator } = await connection.getRecentBlockhash();
    fees += await connection.getMinimumBalanceForRentExemption(span);
    fees += feeCalculator.lamportsPerSignature * 100;
    return fees;
}



export async function createEventKeypair(eventAccount: Account, space: number): Promise<void> {
    
    const currentSequenceNumber = await fetchCurrentSequenceNumber();
    const lamports = await connection.getMinimumBalanceForRentExemption(space);
    
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: PAYER_KEYPAIR.publicKey,
            newAccountPubkey: eventAccount.publicKey,
            lamports,
            space,
            programId,
        }),
    );

    await sendAndConfirmTransaction(
        connection,
        transaction,
        [PAYER_KEYPAIR, eventAccount],
        {
            commitment: 'singleGossip',
            preflightCommitment: 'singleGossip',
        },
    );
}

export async function incrementSequenceNumber(): Promise<void> {
  const instruction = new TransactionInstruction({
    keys: [{pubkey: sequencePubkey, isSigner: false, isWritable: true}],
    programId: sequenceProgramId,
    data: Buffer.alloc(0),
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [PAYER_KEYPAIR],
    {
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip',
    },
  );
}

export async function uploadData(dataReceiverPubkey: PublicKey, payer: Keypair, data: any): Promise<void> {
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: dataReceiverPubkey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from(JSON.stringify(data)),
    });
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [payer],
        {
            commitment: 'singleGossip',
            preflightCommitment: 'singleGossip',
        },
    );
}

export async function fetchData(pubkey: PublicKey, print?: boolean): Promise<any> {
    const accountInfo = await connection.getAccountInfo(pubkey);
    if (accountInfo === null) 
        throw 'Error: cannot find the greeted account';
    let data = accountInfo.data;
    if(data.toString().substring(0,1) == "{") {
        const parsedData = JSON.parse(data.toString());
        parsedData.publicKey = pubkey; 
        return parsedData;
    }
}

export async function fetchCurrentSequenceNumber() {
    const accountInfo = await connection.getAccountInfo(sequencePubkey);
    if (accountInfo != null) {
        var data = accountInfo.data;
        var result = [0];
        var i = 0;
        while(data[i] != 0) {
            result[i] = data[i];
            i++
        }
        return result;
    }
}

export async function fetchEvents(): Promise<any[]> {
    var accounts = await connection.getProgramAccounts(programId);
    let events: any[] = [];
    let i = 0;
    for (let [key, value] of Object.entries(accounts)) {
        events[i++] = await fetchData(value.pubkey, false);
    }
    return events;
}

export async function createEvent(wallet: any, data: any): Promise<boolean> {

    await establishConnection();
    await incrementSequenceNumber();

    const currentSequenceNumber = (await fetchCurrentSequenceNumber())?.[0];

    if(currentSequenceNumber == null) return false;
    const length = currentSequenceNumber.toString().length;

    var mintSeed = BASE_SEED + MINT_SEED;
    mintSeed = mintSeed.padEnd(32 - length, '0') + currentSequenceNumber;
    var mintAuthoritySeed = BASE_SEED + MINT_AUTHORITY_SEED;
    mintAuthoritySeed = mintAuthoritySeed.padEnd(32 - length, '0') + currentSequenceNumber;
    var ticketWalletSeed = BASE_SEED + TICKET_WALLET_SEED;
    ticketWalletSeed = ticketWalletSeed.padEnd(32 - length, '0') + currentSequenceNumber;

    const eventAccount: Account = new Account();

    data.host = wallet._publicKey.toString(); 
    data.sequenceNumber = currentSequenceNumber;
    data.eventAccount = eventAccount.secretKey;

    await createEventKeypair(eventAccount, (await setEventData(data)).span);
    await uploadData(eventAccount.publicKey, PAYER_KEYPAIR, data);
    await createToken(
        connection, 
        wallet, 
        Keypair.fromSeed(new Uint8Array(Buffer.from(mintSeed))), 
        Keypair.fromSeed(new Uint8Array(Buffer.from(mintAuthoritySeed))), 
        Keypair.fromSeed(new Uint8Array(Buffer.from(ticketWalletSeed))), 
        data.ticketSupply
    );
    return true;
}
