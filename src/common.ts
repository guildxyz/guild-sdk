import packageJson from "../package.json";

const globals = {
  apiBaseUrl: "https://api.guild.xyz/v1",
  headers: { "User-Agent": `@guildxyz/sdk:${packageJson?.version}`, "Project-Name": "", "Content-Type": "application/json" },
};

const setApiBaseUrl = (apiBaseUrl: string) => {
  globals.apiBaseUrl = apiBaseUrl;
};

const setProjectName = (projectName: string) => {
  globals.headers["Project-Name"] = projectName
};

export { globals, setApiBaseUrl, setProjectName };
