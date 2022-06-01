const globals = {
  apiBaseUrl: "https://api.guild.xyz/v1",
  headers: { "Content-Type": "application/json" },
};

const setApiBaseUrl = (apiBaseUrl: string) => {
  globals.apiBaseUrl = apiBaseUrl;
};

export { globals, setApiBaseUrl };
