import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    SYSVAR_RENT_PUBKEY,
    Keypair,
} from '@solana/web3.js';

import {
    signAndSendTransaction,
} from './utils';

import * as solana from '../configs/solana.json';

import { 
    fetchData 
} from './createEvent';

import {
    LAYOUT,
    MINT_LAYOUT,
    ACCOUNT_LAYOUT
} from './layouts';
import { store } from 'react-notifications-component';
import { notification, DANGER_TYPE, SUCCESS_TYPE } from '../constants/notifications';

export const TOKEN_PROGRAM_ID = new PublicKey(solana.programs.TOKEN_PROGRAM);

export function mintTo({ mint, destination, amount, mintAuthority }) {
    let keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: mintAuthority, isSigner: true, isWritable: false },
    ];
    return new TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            mintTo: {
                amount,
            },
        }),
        programId: TOKEN_PROGRAM_ID,
    });
}

export function burn({ mint, source, amount }) {
    let keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: source, isSigner: false, isWritable: true },
    ];
    return new TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            burn: {
                amount,
            },
        }),
        programId: TOKEN_PROGRAM_ID,
    });
}

const instructionMaxSpan = Math.max(
    ...Object.values(LAYOUT.registry).map((r: any) => r.span),
);

function encodeTokenInstructionData(instruction) {
    let b = Buffer.alloc(instructionMaxSpan);
    let span = LAYOUT.encode(instruction, b);
    return b.slice(0, span);
}

export function initializeKeypair({ account, mint, owner }) {
    let keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            initializeKeypair: {},
        }),
        programId: TOKEN_PROGRAM_ID,
    });
}

export function initializeMint({
    mint,
    decimals,
    mintAuthority,
    freezeAuthority,
}) {
    let keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new TransactionInstruction({
        keys,
        data: encodeTokenInstructionData({
            initializeMint: {
                decimals,
                mintAuthority: mintAuthority.toBuffer(),
                freezeAuthorityOption: !!freezeAuthority,
                freezeAuthority: freezeAuthority.toBuffer(),
            },
        }),
        programId: TOKEN_PROGRAM_ID,
    });
}

export async function createAndInitializeMint({
    connection,
    owner,
    mintAuthority,
    mint,
    amount,
    decimals,
    ticketWallet,
    first
}) {
    let transaction = new Transaction();
    let signers: Keypair[] = [];
    // only if you are minting 
    // if(owner.publicKey != mintAuthority.publicKey) 
    //     signers.push(mintAuthority);
    if(first) {
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: owner.publicKey,
                newAccountPubkey: mint.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(
                    MINT_LAYOUT.span,
                ),
                space: MINT_LAYOUT.span,
                programId: TOKEN_PROGRAM_ID,
            }),
        );
        transaction.add(
            initializeMint({
                mint: mint.publicKey,
                decimals,
                mintAuthority: mintAuthority.publicKey,
                freezeAuthority: owner.publicKey
            }),
        );
        signers.push(mint);
    }

    if (amount > 0) {
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: owner.publicKey,
                newAccountPubkey: ticketWallet.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(
                    ACCOUNT_LAYOUT.span,
                ),
                space: ACCOUNT_LAYOUT.span,
                programId: TOKEN_PROGRAM_ID,
            }),
        );
        signers.push(ticketWallet);
        transaction.add(
            initializeKeypair({
                account: ticketWallet.publicKey,
                mint: mint.publicKey,
                owner: owner.publicKey,
            }),
        );
    }
    return await signAndSendTransaction(connection, transaction, owner, signers);
}

export const createToken = async (connection: Connection, owner: any, mint: Keypair, mintAuthority: Keypair, ticketWallet: Keypair, ticketSupply?: number) => {
    await createAndInitializeMint({
        connection,
        owner,
        mintAuthority,
        mint,
        amount: ticketSupply,
        decimals: 0,
        ticketWallet,
        first: true
    });
    return {mint: mint, mintAuthority: mintAuthority};
}

export const buyTicket = async(connection: Connection, event: any, owner: any, mint: Keypair, mintAuthority: Keypair, originalTicketWallet: Keypair, amount: number): Promise<boolean> => {

    const newTicketWallet: Keypair = Keypair.generate();
    let signers: Keypair[] = [];

    const hostPubkey = new PublicKey(event.host);
    const eventPubkey = new PublicKey(event.publicKey);

    const ticketPrice = (await fetchData(eventPubkey)).ticketPrice * LAMPORTS_PER_SOL;
    const totalPrice = amount * ticketPrice;

    const userBalance = await connection.getBalance(owner.publicKey);
    let transaction = new Transaction();

    if(userBalance < totalPrice) {
        store.addNotification(
            notification(
                "Insufficient balance",
                `${totalPrice/ LAMPORTS_PER_SOL} SOL required but you only have ${userBalance / LAMPORTS_PER_SOL} SOL`,
                DANGER_TYPE
            )
        );
        return false;
    }

    transaction.add(SystemProgram.transfer({
            fromPubkey: owner.publicKey,
            lamports: totalPrice, 
            toPubkey: hostPubkey
    }));

    const ticketsInCirculation = (await connection.getTokenSupply(mint.publicKey)).value.amount
    const ticketsLeft = (event.ticketSupply - Number(ticketsInCirculation));

    if(amount <= ticketsLeft) {
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: owner.publicKey,
                newAccountPubkey: newTicketWallet.publicKey,
                lamports: await connection.getMinimumBalanceForRentExemption(
                    ACCOUNT_LAYOUT.span,
                ),
                space: ACCOUNT_LAYOUT.span,
                programId: TOKEN_PROGRAM_ID,
            }),
        );
        transaction.add(
            initializeKeypair({
                account: newTicketWallet.publicKey,
                mint: mint.publicKey,
                owner: owner.publicKey,
            }),
        );
        transaction.add(
            mintTo({
                mint: mint.publicKey,
                destination: newTicketWallet.publicKey,
                amount: amount,
                mintAuthority: mintAuthority.publicKey,
            }),
        )

        signers.push(mintAuthority);
        signers.push(newTicketWallet);

        const tx = await signAndSendTransaction(connection, transaction, owner, signers);
        store.addNotification(
            notification(
                "Success",
                `${amount} tickets bought for ${totalPrice / LAMPORTS_PER_SOL} SOL`,
                SUCCESS_TYPE
            )
        )
        return tx ? true : false;
    } else {
        store.addNotification(
            notification(
                "Low ticket supply",
                `you requested ${amount} ticket(s) but there are ${ticketsLeft} left in circulation`,
                DANGER_TYPE
            )
        );
        return false;
    }
}




