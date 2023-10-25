import {
  RolePlatformClaimResponse,
  RoleReward,
  Schemas,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const rolePlatform = {
  get: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<RoleReward>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    roleId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<RoleReward[]>({
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
  ) =>
    callGuildAPI<RolePlatformClaimResponse>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      method: "POST",
      body: {
        data: { args },
        schema: "RolePlatformClaimPayloadSchema",
      },
      signer,
    }),

  create: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformCreationParams: Schemas["RoleRewardCreationPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<RoleReward>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms`,
      method: "POST",
      body: {
        data: rolePlatformCreationParams,
        schema: "RoleRewardCreationPayloadSchema",
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    rolePlatformUpdateParams: Schemas["RoleRewardUpdatePayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<RoleReward>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "PUT",
      body: {
        data: rolePlatformUpdateParams,
        schema: "RoleRewardUpdatePayloadSchema",
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    roleId: number,
    rolePlatformId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<void>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/role-platforms/${rolePlatformId}`,
      method: "DELETE",
      signer,
    }),
};

export type RolePlatformClient = typeof rolePlatform;
export default rolePlatform;
