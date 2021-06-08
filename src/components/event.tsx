import React from 'react';

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
    MINT_AUTHORITY_SEED
} from '../constants';

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
            tickets: 0,
        };
    }

    onSliderChange = (event: object, value: number | number[]) => {
        this.setState({ tickets: value });
    };

    valuetext = (value: number) => {
        return `${value} tickets`;
    }

    buyTicket = async (event: any, amount: number) => {
        if (amount > 0) {
            const wallet = this.context.wallet;

            const currentSequenceNumber = event.sequenceNumber;
            var s = BASE_SEED + MINT_SEED + currentSequenceNumber;
            while (s.length < 32) s += '0'

            var s2 = BASE_SEED + MINT_AUTHORITY_SEED + currentSequenceNumber;
            while (s2.length < 32) s2 += '0'

            var s3 = BASE_SEED + "TICKET_WALLET_" + currentSequenceNumber;
            while (s3.length < 32) s3 += '0'

            const mint: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s)));
            const mintAuthority: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s2)));
            const ticketWallet: Keypair = Keypair.fromSeed(new Uint8Array(Buffer.from(s3)));

            await buyTicket(this.connection, event, wallet, mint, mintAuthority, ticketWallet, amount);
        } else {
            alert("you must buy at least one ticket");
        }
    }

    render() {

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
                                {this.props.event?.date.toString().substring(0, 10)}
                                <ReviewLabel>ticket supply</ReviewLabel>
                                {this.props.event?.ticketSupply}
                                <ReviewLabel>price per ticket</ReviewLabel>
                                 ◎{this.props.event?.ticketPrice}
                                <Slider
                                    defaultValue={30}
                                    getAriaValueText={this.valuetext}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={20}
                                    onChange={this.onSliderChange}
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