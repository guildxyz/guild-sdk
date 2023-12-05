import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { createGuildClient } from "../../src";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);
const GUILD_ID = "sdk-test-guild-62011a";
const ROLE_ID = 88123;
const PRE_EXISTING_REQUIREMENT_ID = 284075;

const { guild } = createGuildClient("vitest");

describe.concurrent("Requirement client", () => {
  it("Can get a requirement", async () => {
    const role = await guild.role.requirement.get(
      GUILD_ID,
      ROLE_ID,
      PRE_EXISTING_REQUIREMENT_ID
    );
    expect(role.type).toEqual("ALLOWLIST");
  });

  it("Can get requirements of role", async () => {
    const roles = await guild.role.requirement.getAll(GUILD_ID, ROLE_ID);

    expect(roles).toMatchObject([{ type: "ALLOWLIST" }]);
  });

  describe("requirement create - update - delete", () => {
    let createdRequirementId: number;

    it("Can create requirement", async () => {
      const created = await guild.role.requirement.create(
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
      const created = await guild.role.requirement.update(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId,
        { isNegated: true },
        TEST_WALLET_SIGNER
      );
      expect(created.isNegated).toEqual(true);
    });

    it("Returns edited requirement", async () => {
      const role = await guild.role.requirement.get(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId
      );
      expect(role.isNegated).toEqual(true);
    });

    it("Can delete requirement", async () => {
      await guild.role.requirement.delete(
        GUILD_ID,
        ROLE_ID,
        createdRequirementId,
        TEST_WALLET_SIGNER
      );
    });

    it("Doesn't return after delete", async () => {
      try {
        await guild.role.requirement.get(
          GUILD_ID,
          ROLE_ID,
          createdRequirementId
        );
        assert(false);
      } catch (error) {
        expect(error).toBeInstanceOf(GuildAPICallFailed);
        expect(error.statusCode).toEqual(404);
      }
    });
  });
});
