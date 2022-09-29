
// importfunctionalities
import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

// create types
type DisplayEncoding = "utf8" | "hex";
var walletAddress = "";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

// create a provider interface (hint: think of this as an object) to store the Phantom Provider
interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

/**
 * @description gets Phantom provider, if it exists
 */
const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

function App() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

  // create state variable for the wallet key
  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
    undefined
  );

  // this is the function that runs whenever the component updates (e.g. render, refresh)
  useEffect(() => {
    const provider = getProvider();

    // if the phantom provider exists, set this as the provider
    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  /**
   * @description prompts user to connect wallet if it exists.
     * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    // checks if phantom wallet exists
    if (solana) {
      try {
        // connects wallet and returns response which includes the wallet public key
        const response = await solana.connect();
        console.log('wallet account ', response.publicKey.toString());
        // update walletKey to be the public key
        setWalletKey(response.publicKey.toString());
        walletAddress = response.publicKey.toString();
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    // checks if phantom wallet exists
    if (solana) {
      try {
        // connects wallet and returns response which includes the wallet public key
        const response = await solana.connect();
        console.log('wallet account ', response.publicKey.toString());
        // update walletKey to be the public key
        setWalletKey(undefined);
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  // HTML code for the app
  return (
    <div className="App" id="Header">
      <header className="App-header"
        style={{
          width: "100%",
          fontSize: "16px",
          padding: "10px",
          //fontWeight: "bold",
        }}>
        <h2>Connect to Phantom Wallet</h2>
      </header><body>
        {/* The connect button allows the user to connect their wallet. It appears on middle of the Body.*/}
        <div id="Button1">
          {provider && !walletKey && (
            <button className="App-button"
              style={{
                display: "flex",
                width: "max-content",
                margin: "auto",
              }}
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
            // The disconnect button allows the user to disconnect their wallet. It appears on top-right of the Body.
          )}</div><div id="Button2">
          {provider && walletKey && (
            <p><button className="App-button"
              style={{
                float: "right",
                border: "solid purple",
                backgroundColor: "pink",
              }}
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button><br />
              <p style={{
                width: "max-content",
                margin: "auto",
              }}>Connected account.</p><br />
              <p style={{
                width: "max-content",
                margin: "auto",
              }}>Wallet Address: <b>{walletAddress}</b></p></p>
          )}</div>

        {!provider && (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}</body>
    </div>
  );
}

export default App;
