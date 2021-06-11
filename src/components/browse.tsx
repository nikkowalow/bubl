import React from 'react';
import bublLogo from '../images/bublLogo.png';
import {
    fetchEvents
} from '../utils/createEvent';

import {
    CardsContainer,
    CardsH1,
    CardsWrapper,
    CardsRectangle,
    CardsIcon,
    CardsH2,
    CardsP
} from './Cards/CardsElements';

import {
    NavLinks
} from './Navbar/NavbarElements';

import {
    DATE_LENGTH
} from '../constants';

interface BrowseProps {
    onEventSelect: (event: any) => void;
}

export class Browse extends React.Component<BrowseProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            events: [],
        };
    }

    async componentDidMount() {
        const response = await fetchEvents();
        this.setState({ events: response });
    }

    render() {
        const events = this.state.events.map((event: any) => (
            event ?
                <NavLinks to="event" onClick={() => this.props.onEventSelect(event)}>
                    <CardsRectangle>
                        <CardsIcon src={bublLogo} />
                        <CardsH2>{event.eventName}</CardsH2>
                        {/* <CardsP>
                            {event.description}
                        </CardsP> */}
                        <CardsP>
                            {(event.date?.toString())?.substring(0, DATE_LENGTH)}
                        </CardsP>
                        <CardsP>
                            {event.address}
                        </CardsP>
                        {/* <CardsP>
                            Category: {event.category}
                        </CardsP> */}
                        <CardsP>
                            {event.ticketSupply} total tickets
                        </CardsP>
                        <CardsP>
                            ◎{event.ticketPrice} per ticket
                        </CardsP>
                    </CardsRectangle>
                </NavLinks> : null
        ));

        return (
            <div>
                <CardsContainer id="Cards" >
                    <CardsH1>Events</CardsH1>
                    <CardsWrapper>
                        {events}
                    </CardsWrapper>
                </CardsContainer>
            </div>
        );
    }
}

export default Browse;