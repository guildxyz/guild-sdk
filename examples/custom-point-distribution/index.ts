import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { randomBytes } from "crypto";
import { privateKeyToAccount } from "viem/accounts";

const YOUR_PROJECT_NAME = "snapshot-test-snippet";

const client = createGuildClient(YOUR_PROJECT_NAME);

if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set the PRIVATE_KEY env var");
}

// Load an account here (viem is just an example, any library works by implementing the singer function in createSigner.custom())
const viemAccount = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);
// Pass a function which signs a message with the admin account, and the address of this account
const signer = createSigner.custom(
  (message) => viemAccount.signMessage({ message }),
  viemAccount.address
);

// If you don't have a guild yet, you can create one by calling this function
async function createGuildWithSnapshot() {
  try {
    const createdGuild = await client.guild.create(
      {
        name: "For snapshot testing",
        urlName: "snapshot-testing",
        contacts: [],
        roles: [
          {
            name: "Test role",
            requirements: [
              {
                type: "GUILD_SNAPSHOT",
                data: {
                  snapshot: [
                    {
                      key: "0x0000000000000000000000000000000000000000",
                      value: 10,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      signer
    );

    console.log("Guild created!");

    const guildId = createdGuild.id;
    const roleId = createdGuild.roles[0].id;
    const requirementId = createdGuild.roles[0].requirements[0].id;

    console.log(createdGuild.guildPlatforms);

    // Created the reward on the guild
    await client.guild.role.reward.create(
      guildId,
      roleId,
      {
        guildPlatform: {
          platformName: "POINTS",
          platformGuildId: `unique-name-${randomBytes(4).toString("hex")}`,
          platformGuildData: {
            name: "Tokens",
          },
        },
        platformRoleData: { score: "0" },
        dynamicAmount: {
          operation: {
            type: "LINEAR",
            input: [
              {
                type: "REQUIREMENT_AMOUNT",
                roleId,
                requirementId,
              },
            ],
          },
        },
      },
      signer
    );
    console.log(`https://guild.xyz/${createdGuild.urlName}`);
    console.log(
      `You can now edit the snapshot with:\nnpx ts-node index.ts edit ${guildId} ${roleId} ${requirementId}`
    );
    return createdGuild;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// This function edits an existing snapshot
async function editSnapshot(
  guildId: number,
  roleId: number,
  requirementId: number
) {
  try {
    const editedRequirement = await client.guild.role.requirement.update(
      guildId,
      roleId,
      requirementId,
      {
        data: {
          // The provided snapshot overwrites the previous array
          snapshot: [
            { key: "0x0000000000000000000000000000000000000000", value: 12 },
            { key: "0x0000000000000000000000000000000000000001", value: 10 },
          ],
        },
      },
      signer
    );
    console.log("Snapshot edited!");
    return editedRequirement;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Set the `PRIVATE_KEY` env var. It should be an admin in the snapshot's guild,
 * so it has access to edit the snapshot
 *
 * Create a guild with `npx ts-node index.ts create-guild`
 *
 * Edit the snapshot with `npx ts-node index.ts edit {guildId} {roleId} {requirementId}`
 *
 * The three ID-s for editing can be retrieved by the
 * https://api.guild.xyz/v2/guilds/guild-page/{urlName} endpoint.
 * The creation command also outputs them for the freshly created guild
 *
 * If the guild is created externally, make sure that the `PRIVATE_KEY`'s account is
 * added to the guild as an admin
 */
async function main() {
  const [, , command, ...params] = process.argv;
  switch (command) {
    case "create-guild": {
      await createGuildWithSnapshot();
      break;
    }
    case "edit": {
      const [guildIdStr, roleIdStr, requirementIdStr] = params;
      await editSnapshot(+guildIdStr, +roleIdStr, +requirementIdStr);
      break;
    }
  }
}

main();
