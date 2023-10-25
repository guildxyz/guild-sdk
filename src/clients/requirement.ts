import {
  RequirementCreationPayloadSchema,
  RequirementUpdatePayloadSchema,
  type types,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const requirement = {
  get: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    signer?: SignerFunction
  ): Promise<types.Requirement> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    roleId: number,
    signer?: SignerFunction
  ): Promise<types.Requirement[]> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementCreationParams: types.Schemas["RequirementCreationPayload"],
    signer: SignerFunction
  ): Promise<types.Requirement> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements`,
      method: "POST",
      body: {
        data: requirementCreationParams,
        schema: RequirementCreationPayloadSchema,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    requirementUpdateParams: types.Schemas["RequirementUpdatePayload"],
    signer: SignerFunction
  ): Promise<types.Requirement> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "PUT",
      body: {
        data: requirementUpdateParams,
        schema: RequirementUpdatePayloadSchema,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "DELETE",
      signer,
    }),
};

export type RequirementClient = typeof requirement;
export default requirement;
