import { RequirementCreationPayloadSchema } from "@guildxyz/types/dist/schemas/requirement";
import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { describe, expect, test } from "vitest";
import { setProjectName } from "../src/common";
import {
  GuildAPICallFailed,
  GuildSDKValidationError,
  UndefinedProjectName,
} from "../src/error";
import { callGuildAPI, createSigner } from "../src/utils";

const WALLET = new Wallet(randomBytes(32).toString("hex"));

describe("callGuildAPI", () => {
  test("It fails if project name is not set", async () => {
    const signer = createSigner.fromEthersWallet(WALLET);

    try {
      await callGuildAPI({
        url: `/guilds/0/roles/0/requirements`,
        method: "POST",
        body: {
          schema: RequirementCreationPayloadSchema,
          data: {} as any, // Missing required "type" field
        },
        signer,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UndefinedProjectName);
      setProjectName("vitest");
    }
  });

  test("It fails with validation error correctly", async () => {
    const signer = createSigner.fromEthersWallet(WALLET);

    try {
      await callGuildAPI({
        url: `/guilds/0/roles/0/requirements`,
        method: "POST",
        body: {
          schema: RequirementCreationPayloadSchema,
          data: {} as any, // Missing required "type" field
        },
        signer,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(GuildSDKValidationError);
      expect(error.zodError).toBeTruthy();
      expect(error.zodError?.issues).toBeTruthy(); // Not checking `instanceof ZodError`, as zod is only a dev dependency, so we can't access the class
    }
  });

  test("It handles API errors (guild doesn't exist)", async () => {
    const signer = createSigner.fromEthersWallet(WALLET);

    try {
      await callGuildAPI({
        url: `/guilds/0/roles/0/requirements`,
        method: "POST",
        body: {
          schema: RequirementCreationPayloadSchema,
          data: { type: "ALLOWLIST" },
        },
        signer,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(GuildAPICallFailed);
      expect(error.endpoint).toEqual(`/guilds/0/roles/0/requirements`);
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Guild doesn't exist");
    }
  });
});
