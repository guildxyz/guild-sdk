import { Schemas } from "@guildxyz/types";
import { Wallet } from "ethers";
import { assert, describe, expect, it } from "vitest";
import { GuildAPICallFailed, GuildSDKValidationError } from "../../src/error";
import { CLIENT, TEST_SIGNER } from "../common";
import { createTestGuild, omit } from "../utils";

const ALLOWLIST_ADDRESS = Wallet.createRandom().address;

const guild = await createTestGuild();
let createdRequirement: Schemas["RequirementCreateResponse"];

describe("Requirement client", () => {
  const requirementToCreate: Schemas["RequirementCreationPayload"] = {
    type: "ALLOWLIST",
    data: { addresses: [] },
  };

  it("Can create requirement", async () => {
    createdRequirement = await CLIENT.guild.role.requirement.create(
      guild.id,
      guild.roles[0].id,
      requirementToCreate,
      TEST_SIGNER
    );

    expect(createdRequirement).toMatchObject(requirementToCreate);
  });

  it("Can get a requirement", async () => {
    const role = await CLIENT.guild.role.requirement.get(
      guild.id,
      guild.roles[0].id,
      createdRequirement.id
    );
    expect(role).toMatchObject(
      omit(createdRequirement, ["deletedRequirements"])
    );
  });

  it("Can get all requirements of role", async () => {
    const roles = await CLIENT.guild.role.requirement.getAll(
      guild.id,
      guild.roles[0].id
    );

    expect(roles).toMatchObject([
      omit(createdRequirement, ["deletedRequirements"]),
    ]);
  });

  it("Can update requirement", async () => {
    const created = await CLIENT.guild.role.requirement.update(
      guild.id,
      guild.roles[0].id,
      createdRequirement.id,
      { data: { addresses: [ALLOWLIST_ADDRESS] } },
      TEST_SIGNER
    );
    expect(created.data.addresses).toEqual([ALLOWLIST_ADDRESS.toLowerCase()]);
  });

  it("Can't change requirement type", async () => {
    try {
      await CLIENT.guild.role.requirement.update(
        guild.id,
        guild.roles[0].id,
        createdRequirement.id,
        { type: "FREE" } as any,
        TEST_SIGNER
      );
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildSDKValidationError);
    }
  });

  it("Returns edited requirement", async () => {
    const role = await CLIENT.guild.role.requirement.get(
      guild.id,
      guild.roles[0].id,
      createdRequirement.id
    );

    expect(role.data.addresses).toEqual([ALLOWLIST_ADDRESS.toLowerCase()]);
  });

  // This is needed, so we can test deletion
  it("Create one more requirement", async () => {
    await CLIENT.guild.role.requirement.create(
      guild.id,
      guild.roles[0].id,
      { type: "ALLOWLIST", data: { addresses: [] } },
      TEST_SIGNER
    );
  });

  it("Can delete requirement", async () => {
    await CLIENT.guild.role.requirement.delete(
      guild.id,
      guild.roles[0].id,
      createdRequirement.id,
      TEST_SIGNER
    );
  });

  it("Doesn't return after delete", async () => {
    try {
      await CLIENT.guild.role.requirement.get(
        guild.id,
        guild.roles[0].id,
        createdRequirement.id
      );
      assert(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.statusCode).toEqual(404);
    }
  });
});
