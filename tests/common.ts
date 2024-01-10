import { Wallet } from "ethers";
import { createGuildClient, createSigner } from "../src";

export const CLIENT = createGuildClient("vitest");
export const TEST_WALLET = new Wallet(process.env.PRIVATE_KEY!);
export const TEST_ADDRESS = TEST_WALLET.address.toLowerCase();
export const TEST_SIGNER = createSigner.fromEthersWallet(TEST_WALLET);
export const TEST_USER = await CLIENT.user.getProfile(
  TEST_ADDRESS,
  TEST_SIGNER
);
