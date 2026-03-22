/**
 * Create Guild Profile — BeatinDaBlock Podcast
 *
 * This example demonstrates how to create a guild profile for the
 * "BeatinDaBlock" podcast using the Guild SDK.
 *
 * Usage:
 *   PRIVATE_KEY=<your-private-key> npm start
 */

import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Wallet } from "ethers";

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Resolve the private key from the environment, or fall back to a random
  // wallet for demonstration purposes.
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = privateKey ? new Wallet(privateKey) : Wallet.createRandom();

  console.log(`Using wallet: ${wallet.address}`);

  const client = createGuildClient("beatindablock-guild-setup");
  const signer = createSigner.fromEthersWallet(wallet, {
    msg: "Create my Guild profile",
  });

  console.log('\nCreating guild: "BeatinDaBlock"');

  const created = await client.guild.create(
    {
      name: "BeatinDaBlock",
      urlName: "beatindablock",
      description:
        "The official community for BeatinDaBlock — a podcast covering hip-hop culture, music production, and the intersection of beats and blockchain.",
      contacts: [],
      // Free-to-join listener role so any fan can get access right away.
      roles: [
        {
          name: "Listener",
          requirements: [{ type: "FREE" }],
        },
      ],
    },
    signer
  );

  console.log("Guild created successfully!");
  console.log(`  id      : ${created.id}`);
  console.log(`  urlName : ${created.urlName}`);
  console.log(`  url     : https://guild.xyz/${created.urlName}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
