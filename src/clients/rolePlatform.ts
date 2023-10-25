import {
  RolePlatformClaimPayloadSchema,
  RoleRewardCreationPayloadSchema,
  RoleRewardUpdatePayloadSchema,
  type types,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const rolePlatform = {
  get: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    signer?: SignerFunction
  ): Promise<types.RoleReward> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    roleId: number,
    signer?: SignerFunction
  ): Promise<types.RoleReward[]> =>
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
  ): Promise<types.RolePlatformClaimResponse> =>
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
    rolePlatformCreationParams: types.Schemas["RoleRewardCreationPayload"],
    signer: SignerFunction
  ): Promise<types.RoleReward> =>
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
    rolePlatformUpdateParams: types.Schemas["RoleRewardUpdatePayload"],
    signer: SignerFunction
  ): Promise<types.RoleReward> =>
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

export type RolePlatformClient = typeof rolePlatform;
export default rolePlatform;
