import type { Role, RoleCreationResponse, Schemas } from "@guildxyz/types";
import {
  RoleCreationPayloadSchema,
  RoleUpdatePayloadSchema,
} from "@guildxyz/types/schemas/role";
import { callGuildAPI, type SignerFunction } from "../utils";

const role = {
  get: (
    guildIdOrUrlName: number | string,
    roleId: number,
    signer?: SignerFunction
  ): Promise<Role> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: number | string,
    signer?: SignerFunction
  ): Promise<Role[]> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: number | string,
    roleCreationParams: Schemas["RoleCreationPayload"],
    signer: SignerFunction
  ): Promise<RoleCreationResponse> =>
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
    roleUpdateParams: Schemas["RoleUpdatePayload"],
    signer: SignerFunction
  ): Promise<Role> =>
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

export default role;
