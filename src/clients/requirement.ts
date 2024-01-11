import {
  Requirement,
  RequirementUpdatePayload,
  Schemas,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const requirement = {
  get: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<Requirement>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "GET",
      signer,
    }),

  getAll: (
    guildIdOrUrlName: string | number,
    roleId: number,
    signer?: SignerFunction
  ) =>
    callGuildAPI<Requirement[]>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements`,
      method: "GET",
      signer,
    }),

  create: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementCreationParams: Schemas["RequirementCreationPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<Schemas["RequirementCreateResponse"]>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements`,
      method: "POST",
      body: {
        data: requirementCreationParams,
        schema: "RequirementCreationPayloadSchema",
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    requirementUpdateParams: RequirementUpdatePayload,
    signer: SignerFunction
  ) =>
    callGuildAPI<Requirement>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "PUT",
      body: {
        data: requirementUpdateParams,
        schema: "RequirementUpdatePayloadSchema",
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    roleId: number,
    requirementId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<Requirement>({
      url: `/guilds/${guildIdOrUrlName}/roles/${roleId}/requirements/${requirementId}`,
      method: "DELETE",
      signer,
    }),
};

export default requirement;
