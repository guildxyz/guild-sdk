import { describe, expect, it } from "vitest";
import { createGuildClient } from "../../src";

const client = createGuildClient("vitest");

describe("Guild admins", () => {
  it("get all", async () => {
    const admins = await client.guild.admin.getAll(1985);
    expect(admins.length).toBeGreaterThan(0);
  });

  it("get", async () => {
    const admin = await client.guild.admin.get(1985, 45);
    expect(admin).toMatchObject({ userId: 45 });
  });
});
