import { AuthenticationParamsSchema } from "@guildxyz/types/schemas/auth";
import { randomBytes } from "crypto";
import { Wallet, keccak256, toUtf8Bytes, verifyMessage } from "ethers";
import { assert, describe, expect, test } from "vitest";
import { createSigner, recreateMessage } from "../src/utils";

const WALLET = new Wallet(randomBytes(32).toString("hex"));
const TEST_PAYLOAD = { someKey: "someValue" };
const TEST_MSG = "Some test message";

describe.concurrent("Authentication", () => {
  describe.concurrent("EOA Wallet", () => {
    test("Can sign simple message", async () => {
      const signer = createSigner.fromEthersWallet(WALLET);
      const { params, sig, payload } = await signer();

      expect(() => AuthenticationParamsSchema.parse(params)).not.toThrow();
      expect(payload).toEqual("{}");
      assert(sig.startsWith("0x"));
      expect(sig).toHaveLength(132);
      expect(verifyMessage(recreateMessage(params), sig)).toEqual(
        WALLET.address
      );
    });

    test("Can sign message with some payload", async () => {
      const signer = createSigner.fromEthersWallet(WALLET);
      const { params, sig, payload } = await signer(TEST_PAYLOAD);

      expect(() => AuthenticationParamsSchema.parse(params)).not.toThrow();
      expect(params).toMatchObject({
        hash: keccak256(toUtf8Bytes(JSON.stringify(TEST_PAYLOAD))),
      });
      expect(payload).toEqual(JSON.stringify(TEST_PAYLOAD));
      assert(sig.startsWith("0x"));
      expect(sig).toHaveLength(132);
      expect(verifyMessage(recreateMessage(params), sig)).toEqual(
        WALLET.address
      );
    });

    test("Can sign message with some payload", async () => {
      const signer = createSigner.fromEthersWallet(WALLET, { msg: TEST_MSG });
      const { params, sig, payload } = await signer();

      expect(() => AuthenticationParamsSchema.parse(params)).not.toThrow();
      expect(params).toMatchObject({ msg: TEST_MSG });
      expect(payload).toEqual("{}");
      assert(sig.startsWith("0x"));
      expect(sig).toHaveLength(132);
      expect(verifyMessage(recreateMessage(params), sig)).toEqual(
        WALLET.address
      );
    });
  });
});
