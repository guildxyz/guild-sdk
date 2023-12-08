import { GuildAdmin } from "@guildxyz/types";
import { callGuildAPI } from "../utils";

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
};

export default guildAdmin;
