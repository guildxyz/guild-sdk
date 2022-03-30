import { randomBytes } from "crypto";
import { isAddress, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import stringify from "fast-json-stable-stringify";
import { PreparedBody, SignerFunction } from "./types";

const prepareBodyWithSign = async (
  signerAddress: string,
  sign: SignerFunction,
  payload?: object
): Promise<string> => {
  if (!isAddress(signerAddress))
    throw new Error(`Invalid address: ${signerAddress} !`);

  const random = randomBytes(32).toString("base64");
  const nonce = keccak256(
    toUtf8Bytes(`${signerAddress.toLowerCase()}${random}`)
  );

  const hash =
    Object.keys(payload || {})?.length > 0
      ? keccak256(toUtf8Bytes(stringify(payload)))
      : "";
  const timestamp = new Date().getTime().toString();

  const signableMessage = `Please sign this message to verify your request!\nNonce: ${nonce}\nRandom: ${random}\n${
    hash ? `Hash: ${hash}\n` : ""
  }Timestamp: ${timestamp}`;

  const addressSignedMessage: string = await sign(signableMessage);
  const body: PreparedBody = {
    payload: payload || {},
    validation: {
      address: signerAddress.toLowerCase(),
      addressSignedMessage,
      nonce,
      random,
      hash,
      timestamp,
    },
  };

  return stringify(body);
};

// eslint-disable-next-line import/prefer-default-export
export { prepareBodyWithSign };
