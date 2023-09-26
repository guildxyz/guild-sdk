"use client";
import { createSigner, user } from "@guildxyz/sdk";
import { useState } from "react";
import { polygon } from "viem/chains";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import "../lib/guild";

export default function Home() {
  const { address } = useAccount();

  const { connect: connectInjected } = useConnect({
    connector: new InjectedConnector(),
  });
  const { connect: connectWalletConnect } = useConnect({
    connector: new WalletConnectConnector({
      options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
    }),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false);

  return (
    <>
      {address ? (
        <div>
          Connected to {address}
          <input
            type="checkbox"
            // value={isSmartContractWallet ? "true" : "false"}
            checked={isSmartContractWallet}
            onChange={(event) => {
              setIsSmartContractWallet(event.target.checked);
            }}
          />
          <button onClick={() => disconnect()}>Disconnect</button>
          <button
            onClick={() =>
              user
                .getProfile(
                  address,
                  createSigner.custom(
                    (message) => signMessageAsync({ message }),
                    address,
                    {
                      chainIdOfSmartContractWallet: isSmartContractWallet
                        ? polygon.id
                        : undefined,
                    }
                  )
                )
                .then(console.log)
            }
          >
            Call Guild API
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => connectInjected()}>Connect Injected</button>
          <button onClick={() => connectWalletConnect()}>
            Connect WalletConnect
          </button>
        </>
      )}
    </>
  );
}
