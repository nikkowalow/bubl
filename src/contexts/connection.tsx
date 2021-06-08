
import {
    Keypair,
    clusterApiUrl,
    Connection,
} from "@solana/web3.js";
import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { WalletAdapter } from "./wallet";
import * as solanaConfig from '../configs/solana.json';

export type ENV =
    | "mainnet-beta"
    | "testnet"
    | "devnet"
    | "localnet";

export const ENDPOINTS = [
    { name: "devnet" as ENV, endpoint: clusterApiUrl("devnet") }
];

export const CLUSTER = solanaConfig.endpoints.DEVNET_CLUSTER;

interface ConnectionConfig {
    connection: Connection;
    sendConnection: Connection;
    endpoint: string;
    env: ENV;
    setEndpoint: (val: string) => void;
}
export function useLocalStorageState(key: string, defaultState?: string) {
    const [state, setState] = useState(() => {
        // NOTE: Not sure if this is ok
        const storedState = localStorage.getItem(key);
        if (storedState) {
            return JSON.parse(storedState);
        }
        return defaultState;
    });

    const setLocalStorageState = useCallback(
        (newState) => {
            const changed = state !== newState;
            if (!changed) {
                return;
            }
            setState(newState);
            if (newState === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(newState));
            }
        },
        [state, key]
    );

    return [state, setLocalStorageState];
}


export const ConnectionContext = React.createContext<ConnectionConfig>({
    endpoint: CLUSTER,
    setEndpoint: () => { },
    connection: new Connection(CLUSTER, 'recent'),
    sendConnection: new Connection(CLUSTER, 'recent'),
    env: ENDPOINTS[0].name,
});

export function ConnectionProvider({ children = undefined as any }) {
    const [endpoint, setEndpoint] = useLocalStorageState(
        "connectionEndpts",
        ENDPOINTS[0].endpoint
    );


    const connection = useMemo(() => new Connection(ENDPOINTS[0].endpoint, 'recent'), [
        endpoint,
    ]);
    const sendConnection = useMemo(() => new Connection(ENDPOINTS[0].endpoint, 'recent'), [
        endpoint,
    ]);

    const env =
        ENDPOINTS.find((end) => end.endpoint === endpoint)?.name ||
        ENDPOINTS[0].name;


    useEffect(() => {
        const id = connection.onAccountChange(Keypair.generate().publicKey, () => { });
        return () => {
            connection.removeAccountChangeListener(id);
        };
    }, [connection]);

    useEffect(() => {
        const id = connection.onSlotChange(() => null);
        return () => {
            connection.removeSlotChangeListener(id);
        };
    }, [connection]);

    useEffect(() => {
        const id = sendConnection.onAccountChange(
            Keypair.generate().publicKey,
            () => { }
        );
        return () => {
            sendConnection.removeAccountChangeListener(id);
        };
    }, [sendConnection]);

    useEffect(() => {
        const id = sendConnection.onSlotChange(() => null);
        return () => {
            sendConnection.removeSlotChangeListener(id);
        };
    }, [sendConnection]);

    return (
        <ConnectionContext.Provider
            value={{
                endpoint,
                setEndpoint,
                connection,
                sendConnection,
                env,
            }} >
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext).connection as Connection;
}

export function useSendConnection() {
    return useContext(ConnectionContext)?.sendConnection;
}

export function useConnectionConfig() {
    const context = useContext(ConnectionContext);
    return {
        endpoint: context.endpoint,
        setEndpoint: context.setEndpoint,
        env: context.env,
        connection: context.connection
    };
}
