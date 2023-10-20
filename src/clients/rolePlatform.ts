import type {
  RolePlatformClaimResponse,
  RoleReward,
  Schemas,
} from "@guildxyz/types";
import {
  RolePlatformClaimPayloadSchema,
  RoleRewardCreationPayloadSchema,
  RoleRewardUpdatePayloadSchema,
} from "@guildxyz/types/schemas/roleReward";
import { callGuildAPI, type SignerFunction } from "../utils";

const rolePlatform = {
  get: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    signer?: SignerFunction
  ): Promise<RoleReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    roleId: number,
    signer?: SignerFunction
  ): Promise<RoleReward[]> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms`,
      method: "GET",
      signer,
    }),

  claim: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    args: string[],
    signer: SignerFunction
  ): Promise<RolePlatformClaimResponse> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      method: "POST",
      body: {
        data: { args },
        schema: RolePlatformClaimPayloadSchema,
      },
      signer,
    }),

  create: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformCreationParams: Schemas["RoleRewardCreationPayload"],
    signer: SignerFunction
  ): Promise<RoleReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms`,
      method: "POST",
      body: {
        data: rolePlatformCreationParams,
        schema: RoleRewardCreationPayloadSchema,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    rolePlatformUpdateParams: Schemas["RoleRewardUpdatePayload"],
    signer: SignerFunction
  ): Promise<RoleReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "PUT",
      body: {
        data: rolePlatformUpdateParams,
        schema: RoleRewardUpdatePayloadSchema,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "DELETE",
      signer,
    }),
};

export default rolePlatform;
