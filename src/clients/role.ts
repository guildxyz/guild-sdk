import { Role, RoleCreationResponse, Schemas } from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const role = {
  get: (
    guildIdOrUrlName: number | string,
    roleId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<Role>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "GET",
      signer,
    }),

  getAll: (guildIdOrUrlName: number | string, signer?: SignerFunction) =>
    callGuildAPI<Role[]>({
      url: `/guilds/${guildIdOrUrlName}/roles`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: number | string,
    roleCreationParams: Schemas["RoleCreationPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<RoleCreationResponse>({
      url: `/guilds/${guildIdOrUrlName}/roles`,
      method: "POST",
      body: {
        data: roleCreationParams,
        schema: "RoleCreationPayloadSchema",
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: number | string,
    roleId: number,
    roleUpdateParams: Schemas["RoleUpdatePayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<Role>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "PUT",
      body: {
        data: roleUpdateParams,
        schema: "RoleUpdatePayloadSchema",
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: number | string,
    roleId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<void>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "DELETE",
      signer,
    }),
};

export type RoleClient = typeof role;
export default role;
