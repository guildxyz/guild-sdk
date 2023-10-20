import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { setProjectName } from "../../src";
import roleClient from "../../src/clients/role";
import { GuildAPICallFailed } from "../../src/error";
import { createSigner } from "../../src/utils";

const TEST_WALLET_SIGNER = createSigner.fromEthersWallet(
  new Wallet(process.env.PRIVATE_KEY!)
);
const GUILD_ID = "sdk-test-guild-62011a";

setProjectName("vitest");

describe("role create - update - delete", () => {
  let createdRoleId: number;

  it("Can create role", async () => {
    const created = await roleClient.create(
      GUILD_ID,
      { name: "SDK Role Creation test", requirements: [{ type: "FREE" }] },
      TEST_WALLET_SIGNER
    );

    createdRoleId = created.id;
    expect(created).toMatchObject({
      name: "SDK Role Creation test",
      requirements: [{ type: "FREE" }],
    });
  });

  it("Can get created role", async () => {
    const role = await roleClient.get(GUILD_ID, createdRoleId);
    expect(role.name).toEqual("SDK Role Creation test");
  });

  it("Can update role", async () => {
    const created = await roleClient.update(
      GUILD_ID,
      createdRoleId,
      { description: "EDITED" },
      TEST_WALLET_SIGNER
    );
    expect(created.description).toEqual("EDITED");
  });

  it("Returns edited role", async () => {
    const role = await roleClient.get(GUILD_ID, createdRoleId);
    expect(role.description).toEqual("EDITED");
  });

  it("Can delete role", async () => {
    await roleClient.delete(GUILD_ID, createdRoleId, TEST_WALLET_SIGNER);
  });

  it("Doesn't return after delete", async () => {
    try {
      await roleClient.get(GUILD_ID, createdRoleId);
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
