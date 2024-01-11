import { describe, expect, it } from "vitest";
import { createGuildClient } from "../../src";

const OUR_GUILD_DC_SERVER_ID = "886314998131982336";

const { platform } = createGuildClient("vitest");

describe.skip("platform client", () => {
  it("Can get guild by platform data", async () => {
    const ourGuild = await platform.getGuildByPlatform(
      "DISCORD",
      OUR_GUILD_DC_SERVER_ID
    );
    expect(ourGuild.urlName).toEqual("our-guild");
  });

  it("Can get user guild access by platform data", async () => {
    const ourGuild = await platform.getUserGuildAccessByPlatform(
      "DISCORD",
      OUR_GUILD_DC_SERVER_ID,
      "604927885530234908"
    );
    expect(ourGuild.platformGuildId).toEqual(OUR_GUILD_DC_SERVER_ID);
  });
});
