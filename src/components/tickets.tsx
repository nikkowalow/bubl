import React from 'react';
import {
    getTickets,
} from '../utils/tickets';

import {
    CardsContainer,
    CardsH1,
    CardsWrapper,
    CardsRectangle,
    CardsH2,
    CardsP
} from './Cards/CardsElements';

import {
    WalletContext
} from '../contexts/wallet';

import {
    Connection,
} from '@solana/web3.js'

import {
    Button
} from './Button/ButtonElements';

import {
    CLUSTER
} from '../constants';

var QRCode = require('qrcode.react');
const connection: Connection = new Connection(CLUSTER, 'singleGossip');

export class Tickets extends React.Component<{}, any> {

    static contextType = WalletContext;

    constructor(props: any) {
        super(props);
        this.state = { tickets: [] };
    }

    async componentDidMount() {
        const wallet = this.context;
        var response: any;
        if (wallet.wallet?.publicKey) {
            response = await getTickets(wallet.wallet.publicKey);
        }
        this.setState({ tickets: response });
    }

    trimPubkey(pubkey: string): string {
        const trimmedPubkey = pubkey.substring(0, 8) + '......' + pubkey.substring(pubkey.length - 8);
        return trimmedPubkey;
    }

    async viewTicketInfo(ticketWallet: any) {
        const accountInfo = await connection.getAccountInfo(ticketWallet.pubkey);
        var info: any;
        if (accountInfo) {
            info = accountInfo.data;
        }
    }

    render() {
        const tickets = (this.state.tickets != null) ? this.state.tickets.map((ticket: any) => (ticket ?
            <CardsRectangle>
                <CardsH1>
                    <QRCode value={ticket.pubkey.toString()} />
                </CardsH1>
                <CardsH1>Ticket</CardsH1>
                <CardsH2 style={{ padding: "8%" }}>x{ticket.amount}</CardsH2>
            </CardsRectangle> : null
        )) : null;

        return (
            <div>
                <CardsContainer id="Cards" >
                    <CardsH1>My Tickets</CardsH1>
                    <CardsWrapper>
                        {tickets}
                    </CardsWrapper>
                </CardsContainer>
            </div>
        )
    }
}

export default Tickets;