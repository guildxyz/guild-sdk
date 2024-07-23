import { randomBytes } from "crypto";
import { afterAll } from "vitest";
import { CLIENT, TEST_SIGNER } from "./common";

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.keys(obj)
      .filter((key: keyof T) => !keys.includes(key as K))
      .map((key) => [key, obj[key]])
  ) as Omit<T, K>;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<T, K>;
}

export async function createTestGuild() {
  const random = randomBytes(4).toString("hex");

  const guild = await CLIENT.guild.create(
    {
      name: "SDK Test Guild",
      urlName: `sdk-test-guild-${random}`,
      contacts: [],
      roles: [{ name: "SDK Test Role", requirements: [{ type: "FREE" }] }],
    },
    TEST_SIGNER
  );

  afterAll(async () => {
    await CLIENT.guild.delete(guild.id, TEST_SIGNER);
  });

  return guild;
}
