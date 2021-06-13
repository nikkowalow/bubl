import React from 'react';
import { Redirect } from 'react-router-dom';
import {
    Connection,
    Keypair
} from '@solana/web3.js';
import Slider from "@material-ui/core/Slider";

import {
    WalletContext
} from '../contexts/wallet';

import {
    Button
} from './Button/ButtonElements';

import {
    FormH1,
    FormWrapper,
    FormShape,
    ReviewLabel,
    FormContainer
} from './Form/FormElements';

import {
    buyTicket
} from '../utils/token';

import {
    BASE_SEED,
    MINT_SEED,
    MINT_AUTHORITY_SEED,
    TICKET_WALLET_SEED
} from '../constants';

import { notification, ERROR_TITLE, DANGER_TYPE } from '../constants/notifications';
import { store } from 'react-notifications-component';

interface EventProps {
    event?: any;
}

export class Event extends React.Component<EventProps, any> {

    static contextType = WalletContext;
    connection = new Connection('https://api.devnet.solana.com', 'singleGossip');

    constructor(props: any) {
        super(props);
        this.state = {
            events: [],
            tickets: 1,
            tx: false,
        };
    }

    onSliderChange = (event: object, value: number | number[]) => {
        this.setState({ tickets: value });
    };

    valueText = (value: number) => {
        return `${value} tickets`;
    }

    buyTicket = async (event: any, amount: number) => {
        const wallet = this.context.wallet;
        if (!wallet.connected) {
            store.addNotification(
                notification(
                    ERROR_TITLE,
                    "Please connect your wallet",
                    DANGER_TYPE
                )
            );
            return;
        }

        const currentSequenceNumber = event.sequenceNumber;
        const length = currentSequenceNumber.toString().length;

        var s = BASE_SEED + MINT_SEED;
        s = s.padEnd(32 - length, '0') + currentSequenceNumber;

        console.log(s);
        var s2 = BASE_SEED + MINT_AUTHORITY_SEED;
        s2 = s2.padEnd(32 - length, '0') + currentSequenceNumber;

        var s3 = BASE_SEED + TICKET_WALLET_SEED;
        s3 = s3.padEnd(32 - length, '0') + currentSequenceNumber;

        const mint: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s)));
        const mintAuthority: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s2)));
        const ticketWallet: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s3)));

        const tx = await buyTicket(this.connection, event, wallet, mint, mintAuthority, ticketWallet, amount);
        this.setState({ tx });
    }

    render() {
        if (this.state.tx) {
            return <Redirect to="/mytickets" />
        }
        return (
            <FormContainer id="Form">
                <FormWrapper>
                    <React.Fragment>
                        <FormWrapper>
                            <FormShape>
                                <FormH1>{this.props.event?.eventName}</FormH1>
                                <ReviewLabel>name</ReviewLabel>
                                {this.props.event?.eventName}
                                <ReviewLabel>desciption</ReviewLabel>
                                {this.props.event?.description}
                                <ReviewLabel>category</ReviewLabel>
                                {this.props.event?.category}
                                <ReviewLabel>address</ReviewLabel>
                                {this.props.event?.address}
                                <ReviewLabel>date and time</ReviewLabel>
                                {this.props.event?.date?.toString().substring(0, 10)}
                                <ReviewLabel>ticket supply</ReviewLabel>
                                {this.props.event?.ticketSupply}
                                <ReviewLabel>price per ticket</ReviewLabel>
                                ◎{this.props.event?.ticketPrice}
                                <Slider
                                    defaultValue={1}
                                    getAriaValueText={this.valueText}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={20}
                                    onChange={this.onSliderChange}
                                    style={{ color: "#e00077" }}
                                />
                                <Button onClick={() => this.buyTicket(this.props.event, this.state.tickets)}>
                                    Buy Ticket (s)
                                </Button>
                            </FormShape>
                        </FormWrapper>
                    </React.Fragment>
                </FormWrapper>
            </FormContainer>
        )
    }

}

export default Event;