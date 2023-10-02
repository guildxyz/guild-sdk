import { describe, expect, it } from "vitest";
import { actions, createSigner } from "../../../src";

const ROLE_ID = 88123;
const TEST_WALLET_SIGNER = createSigner.fromPrivateKey(
  process.env.PRIVATE_KEY!
);
let createdJobId: string;

describe("Status update action", () => {
  it("can start a status update flow", async () => {
    const result = await actions.statusUpdate.start(
      { roleIds: [ROLE_ID] },
      TEST_WALLET_SIGNER
    );
    createdJobId = result.jobId;
    expect(result.jobId).toBeTruthy();
  });

  it("can poll flow state", async () => {
    const job = await actions.statusUpdate.pollByRoleId(
      ROLE_ID,
      TEST_WALLET_SIGNER
    );
    expect(job?.id).toEqual(createdJobId);
  });

  it("can await flow", async () => {
    const job = await actions.statusUpdate.awaitByRoleId(
      ROLE_ID,
      TEST_WALLET_SIGNER
      // console.log
    );
    expect(job?.id).toEqual(createdJobId);
  });
});
