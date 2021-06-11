import { ButtonProps } from "antd/lib/button";
import React from "react";
import { useWallet } from "../contexts/wallet";

export interface ConnectButtonProps
    extends ButtonProps,
    React.RefAttributes<HTMLElement> {
    allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
    const { connected, connect, disconnect, select, provider } = useWallet();

    const button = !connected ?
        <button key="connect-button" className="connect-button" onClick={connect}>
            connect wallet
        </button>
        :
        <button key="disconnect-button" className="disconnect-button" onClick={disconnect}>
            disconnect wallet
        </button>

    return (
        <div>
            {button}
        </div>
    );
};
