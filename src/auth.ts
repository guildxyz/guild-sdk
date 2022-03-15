import { randomBytes } from "crypto";
import { ethers } from "ethers";
import stringify from "fast-json-stable-stringify";
import { RequestWithAuth } from "./types";

const prepareRequest = async (wallet: ethers.Wallet, payload?: object) => {
  let hash: string;
  let hashText: string;
  if (payload !== undefined) {
    hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(stringify(payload)));
    hashText = `Hash: ${hash}\n`;
  } else {
    hashText = "";
  }

  const random = randomBytes(32).toString("base64");
  const nonce = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${wallet.address.toLowerCase()}${random}`)
  );
  const timestamp = new Date().getTime().toString();
  const addressSignedMessage = await wallet.signMessage(
    `Please sign this message to verify your request!\nNonce: ${nonce}\nRandom: ${random}\n${hashText}Timestamp: ${timestamp}`
  );
  const body: RequestWithAuth<object> = {
    payload: payload || {},
    validation: {
      address: wallet.address.toLowerCase(),
      addressSignedMessage,
      nonce,
      random,
      hash,
      timestamp,
    },
  };
  return stringify(body);
};

export default prepareRequest;
