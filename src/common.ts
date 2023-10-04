import { consts } from "@guildxyz/types";

const globals = {
  // apiBaseUrl: "http://localhost:8989/v2",
  apiBaseUrl: "https://api.guild.xyz/v2",
  headers: {
    "Content-Type": "application/json",
    [consts.AUTH_HEADER_NAME]: "",
    [consts.SERVICE_HEADER_NAME]: "",
    [consts.SDK_VERSION_HEADER_NAME]: "2.0.0-rc.2",
    [consts.SDK_PROJECT_NAME_HEADER_NAME]: "",
  },
};

const setApiBaseUrl = (apiBaseUrl: string) => {
  globals.apiBaseUrl = apiBaseUrl;
};

const setProjectName = (projectName: string) => {
  globals.headers[consts.SDK_PROJECT_NAME_HEADER_NAME] = projectName;
};

const setApiKey = (apiKey: string) => {
  globals.headers[consts.AUTH_HEADER_NAME] = apiKey;
};

const setServiceName = (serviceName: string) => {
  globals.headers[consts.SERVICE_HEADER_NAME] = serviceName;
};

export { globals, setApiBaseUrl, setApiKey, setProjectName, setServiceName };
