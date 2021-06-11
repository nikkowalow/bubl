import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './home';
import { ConnectionProvider } from '../contexts/connection';
import { WalletProvider } from '../contexts/wallet';
import { Browse } from './browse';
import { Navigation } from './navigation';
import { Host } from './host';
import { Tickets } from './tickets';
import { Event } from './event';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
interface EventInfo {

}
export class MainView extends React.Component<{}, any> {

    constructor(props) {
        super(props)
        this.state = {
            event: null,
        };
    }

    onEventSelect = (event: EventInfo) => {
        this.setState({ event });
    }

    render() {
        return (
            <Router >
                <ConnectionProvider>
                    <WalletProvider>
                        <ReactNotification />
                        <Navigation />
                        <Route path="/" component={Home} exact />
                        <Route path="/browse">
                            <Browse onEventSelect={this.onEventSelect} />
                        </Route>
                        <Route path="/host">
                            <Host />
                        </Route>
                        <Route path="/myTickets">
                            <Tickets />
                        </Route>
                        <Route path="/event">
                            <Event event={this.state.event} />
                        </Route>
                    </WalletProvider >
                </ConnectionProvider >
            </Router >
        );
    }
}
