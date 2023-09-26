import packageJson from "../package.json";

const BASE_USER_AGENT = `guild-sdk/${packageJson?.version}`;

const globals = {
  // apiBaseUrl: "http://localhost:8989/v2",
  projectName: "",
  apiBaseUrl: "https://api.guild.xyz/v2",
  headers: {
    "User-Agent": BASE_USER_AGENT,
    "Content-Type": "application/json",
  },
};

const setApiBaseUrl = (apiBaseUrl: string) => {
  globals.apiBaseUrl = apiBaseUrl;
};

const setProjectName = (projectName: string) => {
  globals.headers["User-Agent"] = `${BASE_USER_AGENT} ${projectName}`;
};

export { globals, setApiBaseUrl, setProjectName };
