"use client";

import { Inter } from "next/font/google";
import React from "react";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";
import "../lib/guild";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={config}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </WagmiConfig>
  );
}
