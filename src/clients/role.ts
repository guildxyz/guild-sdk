import {
  RoleCreationPayloadSchema,
  RoleUpdatePayloadSchema,
  type types,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const role = {
  get: (
    guildIdOrUrlName: number | string,
    roleId: number,
    signer?: SignerFunction
  ): Promise<types.Role> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: number | string,
    signer?: SignerFunction
  ): Promise<types.Role[]> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: number | string,
    roleCreationParams: types.Schemas["RoleCreationPayload"],
    signer: SignerFunction
  ): Promise<types.RoleCreationResponse> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles`,
      method: "POST",
      body: {
        data: roleCreationParams,
        schema: RoleCreationPayloadSchema,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: number | string,
    roleId: number,
    roleUpdateParams: types.Schemas["RoleUpdatePayload"],
    signer: SignerFunction
  ): Promise<types.Role> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "PUT",
      body: {
        data: roleUpdateParams,
        schema: RoleUpdatePayloadSchema,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: number | string,
    roleId: number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "DELETE",
      signer,
    }),
};

export type RoleClient = typeof role;
export default role;
