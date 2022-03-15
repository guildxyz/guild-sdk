import { ethers } from "ethers";
import clinet from "../src/client";

const testWallet = ethers.Wallet.fromMnemonic(process.env.TEST_WALLET_MNEMONIC);

describe("Check client sdk function", () => {
  test("GET /user/membership/:address - interacted with guild", async () => {
    const membership = await clinet.user.getMemberships(testWallet.address);
    expect(
      membership.some((x) => x.guildId === 1985 && x.roleids.includes(1904))
    ).toBe(true);
  });

  test("GET /user/membership/:address - hasn't interacted with guild", async () => {
    const membership = await clinet.user.getMemberships(
      "0x0000000000000000000000000000000000000000"
    );
    expect(membership).toStrictEqual([]);
  });

  test("POST /user/join", async () => {
    const joinResponse = await clinet.user.join(2158, testWallet);
    expect(joinResponse.alreadyJoined).toBe(false);
    expect(joinResponse.inviteLink).toMatch(/^https:\/\/discord.gg\/.+$/);
  });

  test("GET /guild", async () => {
    const guilds = await clinet.guild.getAll();
    expect(guilds.length).toBeGreaterThan(100);

    const ourGuild = guilds.find((x) => x.id === 1985);
    expect(ourGuild.name).toBe("Our Guild");
    expect(ourGuild.urlName).toBe("our-guild");
  });

  test("GET /guild/:id - ID (number)", async () => {
    const guild = await clinet.guild.get(1985);
    expect(guild.name).toBe("Our Guild");
    expect(guild.urlName).toBe("our-guild");
  });

  test("GET /guild/:id - urlName", async () => {
    const guild = await clinet.guild.get("our-guild");
    expect(guild.name).toBe("Our Guild");
    expect(guild.id).toBe(1985);
  });

  test("GET /guild/access/:id/:address", async () => {
    const userAccess = await clinet.guild.getUserAccess(
      1985,
      testWallet.address
    );
    expect(userAccess.find((x) => x.roleId === 1904)?.access).toBe(true);
    expect(userAccess.find((x) => x.roleId === 1899)?.access).toBe(false);
  });

  test("GET /guild/member/:id/:address", async () => {
    const userAccess = await clinet.guild.getUserCurrentAccess(
      1985,
      testWallet.address
    );
    expect(userAccess.find((x) => x.roleId === 1904)?.access).toBe(true);
    expect(userAccess.find((x) => x.roleId === 1899)?.access).toBe(false);
  });
});
