import packageJson from "../package.json";

const BASE_USER_AGENT = `guild-sdk/${packageJson?.version}`;

// TODO Get these from @guildxyz/types consts
export const KEY_HEADER_NAME = "x-guild-auth";
export const SERVICE_HEADER_NAME = "x-guild-service";

const globals = {
  // apiBaseUrl: "http://localhost:8989/v2",
  apiBaseUrl: "https://api.guild.xyz/v2",
  headers: {
    "User-Agent": BASE_USER_AGENT,
    "Content-Type": "application/json",
    [KEY_HEADER_NAME]: "",
    [SERVICE_HEADER_NAME]: "",
  },
};

const setApiBaseUrl = (apiBaseUrl: string) => {
  globals.apiBaseUrl = apiBaseUrl;
};

const setProjectName = (projectName: string) => {
  globals.headers["User-Agent"] = `${BASE_USER_AGENT} ${projectName}`;
};

const setApiKey = (apiKey: string) => {
  globals.headers[KEY_HEADER_NAME] = apiKey;
};

const setServiceName = (serviceName: string) => {
  globals.headers[SERVICE_HEADER_NAME] = serviceName;
};

export { globals, setApiBaseUrl, setApiKey, setProjectName, setServiceName };
