const stringify = require("fast-json-stable-stringify");
const { ethers } = require("ethers");
const { randomBytes } = require("crypto");

class guildAuth {
  constructor(mnemonic) {
    if (mnemonic === undefined) {
      this.wallet = ethers.Wallet.createRandom();
    } else {
      this.wallet = new ethers.Wallet.fromMnemonic(mnemonic);
    }
  }

  static createRandomWallet() {
    return ethers.Wallet.createRandom();
  }

  static createRandomMnemonic() {
    const randomWallet = ethers.Wallet.createRandom();
    return randomWallet.mnemonic.phrase;
  }

  getMnemonic() {
    return this.wallet.mnemonic.phrase;
  }

  getAddress() {
    return this.wallet.address;
  }

  generateNonce() {
    const random = randomBytes(32).toString("base64");
    const nonce = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`${this.wallet.address.toLowerCase()}${random}`)
    );
    return { random, nonce };
  }

  async signMessage(nonce, random, hash, timestamp) {
    return await this.wallet.signMessage(
      `Please sign this message to verify your request!\nNonce: ${nonce}\nRandom: ${random}\n${
        hash ? `Hash: ${hash}\n` : ""
      }Timestamp: ${timestamp}`
    );
  }

  async prepareRequest(payload) {
    let hash;
    if (payload !== undefined) {
      hash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(stringify(payload))
      );
    }

    const { random, nonce } = this.generateNonce();
    const timestamp = new Date().getTime().toString();
    const addressSignedMessage = await this.signMessage(
      nonce,
      random,
      hash,
      timestamp
    );
    const body = {
      payload: payload ? payload : {},
      validation: {
        address: this.wallet.address.toLowerCase(),
        addressSignedMessage,
        nonce,
        random,
        hash,
        timestamp,
      },
    };
    return stringify(body);
  }
}

module.exports = guildAuth;
