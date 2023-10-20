import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { setProjectName } from "../../src";
import requirementClient from "../../src/clients/requirement";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);
const GUILD_ID = "sdk-test-guild-62011a";
const ROLE_ID = 88123;
const PRE_EXISTING_REQUIREMENT_ID = 284075;

setProjectName("vitest");

describe.concurrent("Requirement client", () => {
  it("Can get a requirement", async () => {
    const role = await requirementClient.get(
      GUILD_ID,
      ROLE_ID,
      PRE_EXISTING_REQUIREMENT_ID
    );
    expect(role.type).toEqual("ALLOWLIST");
  });

  it("Can get requirements of role", async () => {
    const roles = await requirementClient.getAll(GUILD_ID, ROLE_ID);

    expect(roles).toMatchObject([{ type: "ALLOWLIST" }]);
  });

  describe("requirement create - update - delete", () => {
    let createdRequirementId: number;

    it("Can create requirement", async () => {
      const created = await requirementClient.create(
        GUILD_ID,
        ROLE_ID,
        { type: "ALLOWLIST", data: { addresses: [] } },
        TEST_WALLET_SIGNER
      );

      createdRequirementId = created.id;
      expect(created).toMatchObject({
        type: "ALLOWLIST",
        data: { addresses: [] },
        isNegated: false,
      });
    });

    it("Can update requirement", async () => {
      const created = await requirementClient.update(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId,
        { isNegated: true },
        TEST_WALLET_SIGNER
      );
      expect(created.isNegated).toEqual(true);
    });

    it("Returns edited requirement", async () => {
      const role = await requirementClient.get(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId
      );
      expect(role.isNegated).toEqual(true);
    });

    it("Can delete requirement", async () => {
      await requirementClient.delete(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId,
        TEST_WALLET_SIGNER
      );
    });

    it("Doesn't return after delete", async () => {
      try {
        await requirementClient.get(GUILD_ID, ROLE_ID, createdRequirementId);
        assert(false);
      } catch (error) {
        expect(error).toBeInstanceOf(GuildAPICallFailed);
        expect(error.statusCode).toEqual(404);
      }
    });
  });
});
