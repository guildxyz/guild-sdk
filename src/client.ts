import guild from "./clients/guild";
import platform from "./clients/platform";
import user from "./clients/user";
import { setProjectName } from "./common";

const createGuildClient = (projectName: string) => {
  if (typeof projectName !== "string" || projectName.length <= 0)
    throw Error("Project name should be a non-empty string");

  setProjectName(projectName);

  return { guild, platform, user };
};

export type GuildClient = ReturnType<typeof createGuildClient>

export default createGuildClient;
