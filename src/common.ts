import {
  SDK_PROJECT_NAME_HEADER_NAME,
  SDK_VERSION_HEADER_NAME,
} from "@guildxyz/types/consts";

const globals = {
  apiBaseUrl: process.env.GUILD_SDK_BASE_URL ?? "https://api.guild.xyz/v2",
  headers: {
    "Content-Type": "application/json",
    [SDK_VERSION_HEADER_NAME]: "2.0.0-rc.2",
    [SDK_PROJECT_NAME_HEADER_NAME]: "",
  },
};

const setProjectName = (projectName: string) => {
  if (typeof projectName !== "string" || projectName.length <= 0)
    throw Error("Project name should be a non-empty string");

  globals.headers[SDK_PROJECT_NAME_HEADER_NAME] = projectName;
};

export { globals, setProjectName };
