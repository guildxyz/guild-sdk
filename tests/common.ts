import { ethers } from "ethers";

const testWallet = ethers.Wallet.fromMnemonic(process.env.TEST_WALLET_MNEMONIC);

// eslint-disable-next-line import/prefer-default-export
export { testWallet };
