import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

import { 
    TOKEN_PROGRAM_PUBKEY
} from '../constants';

import {
    CLUSTER
} from '../constants';
const programId: PublicKey = TOKEN_PROGRAM_PUBKEY;
const connection: Connection = new Connection(CLUSTER, 'singleGossip');

export async function getTickets(owner: PublicKey) {
    const tickets = (await connection.getParsedTokenAccountsByOwner(owner, {programId})).value;
    var ticketInfo = [{}];
    var i = 0;
    for (var key of Object.keys(tickets)) {
        const ticketPubkey = tickets[key].pubkey; 
        ticketInfo[i++] = {pubkey: ticketPubkey, amount: await getTicketBalance(ticketPubkey)};
    } 
    return ticketInfo;
}

export async function getTicketBalance(ticketPubkey: PublicKey) {
    return (await connection.getTokenAccountBalance(ticketPubkey)).value.uiAmountString;
}