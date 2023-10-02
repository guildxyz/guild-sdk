import { Wallet } from "ethers";
import { beforeAll, describe, expect, it } from "vitest";
import { user } from "../src/client";
import { setApiBaseUrl, setApiKey, setServiceName } from "../src/common";
import { createSigner } from "../src/utils";

const TEST_WALLET_ADDRESS = new Wallet(process.env.PRIVATE_KEY!).address;

beforeAll(() => {
  setApiKey(process.env.API_KEY!);
  setServiceName(process.env.SERVICE_NAME!);
  setApiBaseUrl("http://localhost:8989/v2");
});

describe("api key privileged request", () => {
  it("Can make a privileged request", async () => {
    const addresses = await user.address.getAll(
      TEST_WALLET_ADDRESS,
      createSigner.apiKeySigner()
    );

    expect(addresses.length).toBeGreaterThan(0);
  });
});
