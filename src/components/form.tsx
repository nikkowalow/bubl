import React from 'react';
import 'react-calendar/dist/Calendar.css';
import {
    PrevButton,
    NextButton,
    FormWrapper,
    FormShape,
    FormH2,
    SmallInput,
    LargeInput,
    FormLabel,
    NavButtonContainer,
    EventType,
    EventTypeContainer,
    TicketSupplyContainer,
    TicketInput,
    CalendarContainer,
    ReviewLabel,
} from './Form/FormElements';

import {
    NavLinks
} from './Navbar/NavbarElements';

import Calendar from 'react-calendar';
import {
    WalletContext
} from '../contexts/wallet';
import { Redirect, Link } from 'react-router-dom'
import { createEvent } from '../utils/createEvent';
import { Map } from './map'
import 'date-fns';
import { NUM_STEPS_FOR_FORM } from '../constants';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { store } from 'react-notifications-component';
import { notification, SUCCESS_TITLE, SUCCESS_TYPE } from '../constants/notifications';

interface EventData {

}
const eventTypes = ['sports, fitness', 'music, art, fashion', 'food', 'movies & TV', 'work related', 'other'];
const location = {
    address: '',
    lat: 0.0,
    lng: 0.0,
}
export class Form extends React.Component {

    initialFormData: EventData = {};
    static contextType = WalletContext;

    state = {
        currentStep: 1,
        category: '',
        ticketSupply: 0,
        ticketPrice: 0,
        date: null,
        eventCreated: false
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async event => {
        const wallet = this.context;
        event.preventDefault()
        const eventStatus = await createEvent(wallet.wallet, this.state);
        if (eventStatus) {
            store.addNotification(
                notification(
                    SUCCESS_TITLE,
                    "Event has been created",
                    SUCCESS_TYPE
                )
            );
        } else {
            store.addNotification(
                notification(
                    "Error",
                    "Event creation failed",
                    "danger"
                )
            );
        }

        this.setState({ eventCreated: true });
    }

    goNext = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep >= NUM_STEPS_FOR_FORM ? 3 : currentStep + 1
        this.setState({
            currentStep
        });

    }

    goPrev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
            return (
                <PrevButton onClick={this.goPrev}>
                    Previous
                </PrevButton>
            )
        }
        return null;
    }

    nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < NUM_STEPS_FOR_FORM) {
            return (

                <NextButton onClick={this.goNext}>
                    Next
                </NextButton>
            )
        }
        return null;
    }

    submitButton() {
        let currentStep = this.state.currentStep;
        if (currentStep >= NUM_STEPS_FOR_FORM) {
            return (
                <NextButton style={{ backgroundColor: "green" }} onClick={this.handleSubmit}>
                    Submit
                </NextButton>
            )
        }
        return null;
    }

    decrementTicketSupply = () => {
        let ticketSupply = this.state.ticketSupply
        if (ticketSupply > 0) {
            ticketSupply--;
            this.setState({ ticketSupply })
        }
    }

    incrementTicketSupply = () => {
        let ticketSupply = this.state.ticketSupply;
        ticketSupply++;
        this.setState({ ticketSupply })
    }

    decrementTicketPrice = () => {
        let ticketPrice = this.state.ticketPrice
        if (ticketPrice > 0) {
            ticketPrice--;
            this.setState({ ticketPrice })
        }
    }

    incrementTicketPrice = () => {
        let ticketPrice = this.state.ticketPrice;
        ticketPrice++;
        this.setState({ ticketPrice })
    }

    onCategoryChange = (type: string) => {
        this.setState({ category: type });
    }

    onDateChange = (date) => {
        this.setState({ date });
    }



    Step1(props: any) {
        if (props.currentStep !== 1)
            return null;
        navigator.geolocation.getCurrentPosition(function (position) {
            location.lat = position.coords.latitude;
            location.lng = position.coords.longitude;
        });
        return (
            <>
                <FormH2>which best describes your event?</FormH2>
                <EventTypeContainer>
                    {eventTypes.map(type =>
                        <EventType onClick={() => props.onCategoryChange(type)} id={type} name="category">{type}</EventType>
                    )}
                </EventTypeContainer>
            </>
        );
    }

    Step2(props: any) {
        if (props.currentStep !== 2)
            return null;
        return (
            <>
                <FormH2>where will your event be located?</FormH2>
                <Map location={location} zoomLevel={12} />
                <FormLabel>address of event</FormLabel>
                <SmallInput onChange={props.handleChange} name="address" value={props.state.address}></SmallInput>
            </>
        );
    }

    Step3(props: any) {
        if (props.currentStep !== 3)
            return null;
        return (
            <>
                <FormH2>when will your event take place?</FormH2>
                <CalendarContainer>
                    <Calendar
                        className="calendar"
                        onChange={props.onDateChange}
                        value={props.state.date}
                        showNavigation={true}
                    />
                </CalendarContainer>
            </>
        );
    }

    Step4(props: any) {
        if (props.currentStep !== 4)
            return null;
        return (
            <>
                <FormH2>how many tickets would you like to mint?</FormH2>
                <TicketSupplyContainer>
                    <Fab aria-label="add" style={{ backgroundColor: "white", color: "black", marginLeft: "30%" }}>
                        <RemoveIcon onClick={() => props.decrementTicketSupply()} />
                    </Fab>
                    <TicketInput
                        type="number"
                        name="ticketSupply"
                        onChange={props.handleChange}
                        value={props.state.ticketSupply}
                    />
                    <Fab aria-label="add" style={{ backgroundColor: "white", color: "black" }}>
                        <AddIcon onClick={() => props.incrementTicketSupply()} />
                    </Fab>
                </TicketSupplyContainer>
            </>
        );
    }

    Step5(props: any) {
        if (props.currentStep !== 5)
            return null
        return (
            <>
                <FormH2>how much will your tickets cost? (SOL)</FormH2>
                <TicketSupplyContainer>
                    <Fab aria-label="add" style={{ backgroundColor: "white", color: "black", marginLeft: "30%" }}>
                        <RemoveIcon onClick={() => props.decrementTicketPrice()} />
                    </Fab>
                    <TicketInput
                        type="number"
                        name="ticketPrice"
                        onChange={props.handleChange}
                        value={props.state.ticketPrice}
                    />
                    <Fab aria-label="add" style={{ backgroundColor: "white", color: "black" }}>
                        <AddIcon onClick={() => props.incrementTicketPrice()} />
                    </Fab>
                </TicketSupplyContainer>
            </>
        );
    }

    Step6(props: any) {
        if (props.currentStep !== 6)
            return null;
        return (
            <>
                <FormH2>basic info</FormH2>
                <FormLabel>name of your event</FormLabel>
                <SmallInput onChange={props.handleChange} name="eventName" value={props.state.eventName}></SmallInput>
                <FormLabel>short description</FormLabel>
                <LargeInput onChange={props.handleChange} name="description" value={props.state.description}></LargeInput>
            </>
        );
    }

    Step7(props: any) {
        if (props.currentStep !== 7)
            return null
        return (
            <>
                <FormH2>review your info and submit</FormH2>
                <ReviewLabel>name</ReviewLabel>
                {props.state.eventName}
                <ReviewLabel>desciption</ReviewLabel>
                {props.state.description}
                <ReviewLabel>category</ReviewLabel>
                {props.state.category}
                <ReviewLabel>address</ReviewLabel>
                {props.state.address}
                <ReviewLabel>date and time</ReviewLabel>
                {props.state.date?.toString()}
                <ReviewLabel>ticket supply</ReviewLabel>
                {props.state.ticketSupply}
                <ReviewLabel>price per ticket</ReviewLabel>
                ◎{props.state.ticketPrice}
            </>
        );
    }

    render() {
        if (this.state.eventCreated) {
            return <Redirect to={"/browse"} />;
        }
        return (
            <React.Fragment>
                {/* <FormWrapper> */}
                <FormShape>
                    <this.Step1
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                        onCategoryChange={this.onCategoryChange}
                    />
                    <this.Step2
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                    />
                    <this.Step3
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                        onDateChange={this.onDateChange}
                    />
                    <this.Step4
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                        decrementTicketSupply={this.decrementTicketSupply}
                        incrementTicketSupply={this.incrementTicketSupply}
                    />
                    <this.Step5
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                        decrementTicketPrice={this.decrementTicketPrice}
                        incrementTicketPrice={this.incrementTicketPrice}
                    />
                    <this.Step6
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                    />
                    <this.Step7
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        state={this.state}
                    />
                    <NavButtonContainer>
                        {this.previousButton()}
                        {this.nextButton()}
                        {this.submitButton()}
                    </NavButtonContainer>
                </FormShape>
                {/* </FormWrapper> */}
            </React.Fragment>
        );
    }
}