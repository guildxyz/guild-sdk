import { GuildAdmin, Schemas } from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";

const guildAdmin = {
  get: (guildIdOrUrlName: string | number, userId: number) =>
    callGuildAPI<GuildAdmin>({
      url: `/guilds/${guildIdOrUrlName}/admins/${userId}`,
      method: "GET",
    }),

  getAll: (guildIdOrUrlName: string | number) =>
    callGuildAPI<GuildAdmin[]>({
      url: `/guilds/${guildIdOrUrlName}/admins`,
      method: "GET",
    }),

  create: (
    guildIdOrUrlName: string | number,
    guildAdminCreationParams: Schemas["GuildAdminCreationPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<GuildAdmin>({
      url: `/guilds/${guildIdOrUrlName}/admins`,
      method: "POST",
      body: {
        schema: "GuildAdminCreationPayloadSchema",
        data: guildAdminCreationParams,
      },
      signer,
    }),

  update: (
    guildIdOrUrlName: string | number,
    adminUserId: number,
    guildAdminUpdateParams: Schemas["GuildAdminUpdatePayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<GuildAdmin>({
      url: `/guilds/${guildIdOrUrlName}/admins/${adminUserId}`,
      method: "PUT",
      body: {
        schema: "GuildAdminUpdatePayloadSchema",
        data: guildAdminUpdateParams,
      },
      signer,
    }),

  delete: (
    guildIdOrUrlName: string | number,
    adminUserId: number,
    signer: SignerFunction
  ) =>
    callGuildAPI<void>({
      url: `/guilds/${guildIdOrUrlName}/admins/${adminUserId}`,
      method: "DELETE",
      signer,
    }),
};

export default guildAdmin;
