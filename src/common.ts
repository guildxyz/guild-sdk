import { consts } from "@guildxyz/types";

const globals = {
  apiBaseUrl: process.env.GUILD_SDK_BASE_URL ?? "https://api.guild.xyz/v2",
  headers: {
    "Content-Type": "application/json",
    [consts.SDK_VERSION_HEADER_NAME]: "2.0.0-rc.2",
    [consts.SDK_PROJECT_NAME_HEADER_NAME]: "",

    ...(process.env.GUILD_SDK_PRIVELEGED_KEY
      ? { [consts.AUTH_HEADER_NAME]: process.env.GUILD_SDK_PRIVELEGED_KEY }
      : {}),

    ...(process.env.GUILD_SDK_SERVICE_NAME
      ? { [consts.SERVICE_HEADER_NAME]: process.env.GUILD_SDK_SERVICE_NAME }
      : {}),
  },
};

const setProjectName = (projectName: string) => {
  globals.headers[consts.SDK_PROJECT_NAME_HEADER_NAME] = projectName;
};

export { globals, setProjectName };
