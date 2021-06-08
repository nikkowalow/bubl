import type { PublicKey } from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";
import { Transaction, Connection } from "@solana/web3.js";
import { Button, Modal } from "antd";
import EventEmitter from "eventemitter3";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useConnectionConfig } from "./connection";
import { useLocalStorageState } from "./../utils/utils";
import { PhantomWalletAdapter } from "./wallets/Phantom";
import * as solana from '../configs/solana.json';

const ASSETS_URL =
    "https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/";
export const WALLET_PROVIDERS = [
    {
        name: "Sollet",
        url: "https://www.sollet.io",
        icon: `${ASSETS_URL}sollet.svg`,
    },
    {
        name: "Solflare",
        url: "https://solflare.com/access-wallet",
        icon: `${ASSETS_URL}solflare.svg`,
    },
    {
        name: "MathWallet",
        url: "https://mathwallet.org",
        icon: `${ASSETS_URL}mathwallet.svg`,
    },
    {
        name: "Phantom",
        url: "https://phantom.app/",
        icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
        adapter: PhantomWalletAdapter,
    },
];

export interface WalletAdapter extends EventEmitter {
    publicKey: PublicKey | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    connect: () => any;
    disconnect: () => any;
}

export const WalletContext = React.createContext<{
    wallet: WalletAdapter | undefined;
    connected: boolean;
    select: () => void;
    provider: typeof WALLET_PROVIDERS[number] | undefined;
    connection: Connection;
}>({
    wallet: undefined,
    connected: false,
    select() { },
    provider: undefined,
    connection: new Connection(solana.endpoints.DEVNET_CLUSTER, 'singleGossip'),
});

export function WalletProvider({ children = null as any }) {
    const { endpoint, connection } = useConnectionConfig();

    const [autoConnect, setAutoConnect] = useState(false);
    const [providerUrl, setProviderUrl] = useLocalStorageState("walletProvider");
    const provider = useMemo(
        () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
        [providerUrl]
    );

    const wallet = useMemo(
        function () {
            if (provider) {
                return new (provider.adapter || Wallet)(
                    providerUrl,
                    endpoint
                ) as WalletAdapter;
            }
        },
        [provider, providerUrl, endpoint]
    );

    setProviderUrl(WALLET_PROVIDERS[0].url);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (wallet) {
            wallet.on("connect", () => {
                if (wallet.publicKey) {
                    setConnected(true);
                    const walletPublicKey = wallet.publicKey.toBase58();
                    const keyToDisplay =
                        walletPublicKey.length > 20
                            ? `${walletPublicKey.substring(
                                0,
                                7
                            )}.....${walletPublicKey.substring(
                                walletPublicKey.length - 7,
                                walletPublicKey.length
                            )}`
                            : walletPublicKey;
                }
            });

            wallet.on("disconnect", () => {
                setConnected(false);
            });
        }

        return () => {
            setConnected(false);
            if (wallet) {
                wallet.disconnect();
            }
        };
    }, [wallet]);

    useEffect(() => {
        if (wallet && autoConnect) {
            wallet.connect();
            setAutoConnect(false);
        }

        return () => { };
    }, [wallet, autoConnect]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const select = useCallback(() => setIsModalVisible(true), []);
    const close = useCallback(() => setIsModalVisible(false), []);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                connected,
                select,
                provider,
                connection,
            }}
        >
            {children}
            <Modal
                title="Select Wallet"
                okText="Connect"
                visible={isModalVisible}
                okButtonProps={{ style: { display: "none" } }}
                onCancel={close}
                width={400}
            >
                {WALLET_PROVIDERS.map((provider) => {
                    const onClick = function () {
                        setProviderUrl(provider.url);
                        setAutoConnect(true);
                        close();
                    };

                    return (
                        <Button

                            size="large"
                            type={providerUrl === provider.url ? "primary" : "ghost"}
                            onClick={onClick}
                            icon={
                                <img
                                    alt={`${provider.name}`}
                                    width={20}
                                    height={20}
                                    src={provider.icon}
                                    style={{ marginRight: 8, padding: 0 }}
                                />
                            }
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                marginBottom: 8,
                            }}
                        >
                            {provider.name}
                        </Button>
                    );
                })}
            </Modal>
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const { wallet, connected, provider, select, connection } = useContext(WalletContext);
    return {
        wallet,
        connected,
        provider,
        select,
        publicKey: wallet?.publicKey,
        connect() {
            wallet ? wallet.connect() : select();
        },
        disconnect() {
            wallet?.disconnect();
        },
        connection
    };
}
