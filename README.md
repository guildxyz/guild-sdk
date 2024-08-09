<div align="center">
<h1> Guild SDK for TypeScript | WIP </h1>
<a href="https://www.npmjs.com/package/@guildxyz/sdk"><img src="https://img.shields.io/npm/v/@guildxyz/sdk.svg?style=flat" /></a>
  <a href="https://github.com/guildxyz/guild-sdk/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <br/>
  <a href="https://guild.xyz">Application</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/guildxyz">Twitter</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://github.com/guildxyz">Github</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://discord.gg/gu8qMJAp">Discord</a>
</div>
  
  
  
## Summary

The Guild SDK library is a Typescript library for interacting with the Guild API. This document explains how to authenticate, manage your Guilds easily and automate token-gated access in any application with this SDK.

Guild.xyz is the membership layer protocol for web3 communities, making community management easy and interoperable between platforms.

## Migration Guide to V2

⚠️ `1.x.x versions` of the SDK are **_deprecated_**, these versions won't work after **_2024-01-31_**. Please migrate to the latest version. You can find the migration guide [HERE](https://github.com/guildxyz/guild-sdk/blob/main/v2-migration-guide.md#guild-sdk-v2-migration-guide).

## Demo app

A demo app is available [here](https://github.com/guildxyz/guild-sdk/tree/main/examples/next-js), it shows how to:

- Connect wallet (with wagmi)
- Sign a message
- Get user profile with signature
- Fetch data (with SWR)
  - Guild roles
  - User memberships
  - Leaderboard

## Contents

- [Installation](#installation)
- [Importing the package and creating a Guild client](#importing-the-package-and-creating-a-guild-client)
- [SignerFunctions and Authentication](#signerfunctions-and-authentication)
  - [ethers.js](#creating-a-signer-from-an-ethers-wallet)
  - [web3-react](#creating-a-custom-signer-for-usage-with-web3-react)
  - [wagmi](#creating-a-custom-signer-for-usage-with-wagmi)
  - [EIP-1271](#support-for-eip-1271-smart-contract-wallets)
- [Clients](#clients)
  - [Guild client](#guild-client)
    - [Points](#points)
  - [Guild admin client](#guild-admin-client)
  - [Guild reward client](#guild-reward-client)
  - [Role client](#role-client)
  - [Requirement client](#requirement-client)
  - [Role reward client](#role-reward-client)
  - [User client](#user-client)
  - [User address client](#user-address-client)
  - [User platform client](#user-platform-client)
- [Modular / multi-platform architecture](#modular--multi-platform-architecture)
- [Examples](#examples)
  - [Example flow from Create Guild to Join](#example-flow-from-create-guild-to-join)
  - [Multiple telegram groups guild](#multiple-telegram-groups-guild)

### Installation

To install our SDK, open your terminal and run:

```
npm i @guildxyz/sdk
```

### Importing the package and creating a Guild client

```typescript
import { createGuildClient, createSigner } from "@guildxyz/sdk";

// The only parameter is the name of your project
const guildClient = createGuildClient("My project");
```

### SignerFunctions and Authentication

#### `Creating a signer from an ethers wallet`

```ts
import { ethers } from "ethers";

const ethersWallet = new ethers.Wallet(...);

const signerFunction = createSigner.fromEthersWallet(ethersWallet);
```

#### `Creating a custom signer for usage with web3-react`

```ts
import { useWeb3React } from "@web3-react/core";

const { account: walletAddress, library } = useWeb3React();

const signerFunction = createSigner.custom(
  (message) => library.getSigner(account).signMessage(signableMessage),
  address
);
```

#### `Creating a custom signer for usage with wagmi`

```ts
import { useAccount, useSignMessage } from "wagmi";

const { signMessageAsync } = useSignMessage();
const { address } = useAccount();

const signerFunction = createSigner.custom(
  (message) => signMessageAsync({ message }),
  address
);
```

#### `Support for EIP-1271 smart contract wallets`

For signatures produced by EIP-1272 wallets, pass `{ chainIdOfSmartContractWallet: chainId }` as the third parameter of `createSigner.custom`, where `chainId` is the chain where the wallet operates. The Guild backend will try to call `isValidSignature` on the specified chain.
We have an example app under [`examples`](https://github.com/guildxyz/guild-sdk/tree/main/examples), which covers this parameter

### Clients

We have multiple clients for different entities. These clients are created from the `guildClient` that we created above.

#### `Guild client`

```ts
const { guild: client } = guildClient;

// Get Guild by its numeric ID
const guild = await client.get(guildId);

// Get Guild by its urlName (slug)
const guild = await client.get(urlName);

// Get multiple guilds by their IDs
const guilds = await client.getMany([guildId1, guildId2]);

// Search guilds with pagination
const guilds = await client.search({ limit: 10, offset: 0, search: "our" });

// Get the members of a guild
const members = await client.getMembers(
  guildId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Join into a guild
const joinResult = await client.join(guildId, signerFunction);

// Check access to a guild, signerFuncion is required
await client.accessCheck(guildId, signerFunction);

// Create a new guild, check the possible creation parameters according to the typing
await client.create(
  {
    // In this example we are creating a guild with one FREE role
    name: "My Guild",
    urlName: "my-guild",
    roles: [{ name: "My Role", requirements: [{ type: "FREE" }] }],
  },
  signerFunction
);

// Update an existing guild, check the possible update parameters according to the typing
await client.update(guildId, { description: "Edited" }, signerFunction);

// Delete a guild
await client.delete(guildId, signerFunction);
```

##### `Points`

```ts
// For a given role, create a new point system, and assign some points as reward
const created = await guild.role.reward.create(
  guildId,
  roleId, // This role will have the 5 points reward
  {
    guildPlatform: {
      platformGuildId: "my-points", // Some unique name for your point system
      platformName: "POINTS",
      platformGuildData: { name: "coins" }, // Assign a custom name for the points
    },
    platformRoleData: { score: 5 }, // Members will get this many points
  },
  signerFunction
);

// Use an existing point system for a role
const created = await guild.role.reward.create(
  guildId,
  roleId, // This role will have the 10 points reward
  {
    guildPlatformId, // The ID of the existing guildPlatform (reward) object
    platformRoleData: { score: 10 },
  },
  signerFunction
);

// Get leaderboard for a specific point guild reward
const { leaderboard, aroundUser } = await guild.getLeaderboard(
  guildId,
  guildPlatformId,
  signerFunction // Optional. If provided, the response will include an "aroundUser" field, which contains leaderboard items from around the user's position, otherwise it will be undefined
);

// Get user's rank in a specific reward
const response = await user.getRankInGuild(userId, guildId, guildPlatformId); // Returns the leaderboard position of a user for the given reward

// Get all the points of a user across all relevant rewards
const response = await user.getPoints(userId, signerFunction);
```

#### `Guild admin client`

```ts
const {
  guild: { admin: adminClient },
} = guildClient;

// Get all admins of a guild
const admins = await adminClient.getAll(guildIdOrUrlName);

// Get a specific admin of a guild
const admin = await adminClient.get(guildIdOrUrlName, userIdOfAdmin);
```

#### `Guild reward client`

```ts
const {
  guild: { reward: guildRewardClient },
} = guildClient;

// Get a guild reward (like a Discord server)
const guildReward = await guildRewardClient.get(
  guildIdOrUrlName,
  guildPlatformId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Get all rewards of a guild
const guildRewards = await guildRewardClient.getAll(
  guildIdOrUrlName,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Add a new reward to a guild
const createdGuildReward = await guildRewardClient.create(guildIdOrUrlName, {
  platformName: "DISCORD", // In this example we are adding a Discord server
  platformGuildId: "<SERVER_ID>",
});

// Delete a reward from a guild
await guildRewardClient.delete(
  guildIdOrUrlName,
  guildPlatformId,
  signerFunction
);
```

#### `Role client`

```ts
const {
  guild: { role: roleClient },
} = guildClient;

// Get a role
await roleClient.get(
  guildIdOrUrlName,
  roleId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Get all roles of a guild
await roleClient.getAll(
  guildIdOrUrlName,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Create a new role. Refer to the typing for other possible input parameters, like description, logic, or visibility
const createdRole = await roleClient.create(
  guildIdOrUrlName,
  {
    name: "My new role",
    requirements: [{ type: "FREE" }],
  },
  signerFunction
);

// Update an existing role
const updatedRole = await roleClient.update(
  guildIdOrUrlName,
  roleId,
  { description: "Edited" },
  signerFunction
);

// Delete a role
await roleClient.delete(guildIdOrUrlName, roleId, signerFunction);
```

#### `Requirement client`

```ts
const {
  guild: {
    role: { requirement: requirementClient },
  },
} = guildClient;

// Get a requirement
const requirement = await requirementClient.get(
  guildIdOrUrlName,
  roleId,
  requirementId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Get all requirements of a role
const requirements = await requirementClient.getAll(
  guildIdOrUrlName,
  roleId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Create a new requirement
const createdRequirement = await requirementClient.create(
  guildIdOrUrlName,
  roleId,
  { type: "FREE" },
  signerFunction
);

// Update an existing requirement (for example addresses in an ALLOWLIST requirement)
const updatedRequirement = await requirementClient.update(
  guildIdOrUrlName,
  roleId,
  requirementId,
  { data: { addresses: ["0x..."] } }, // Lowercased addresses
  signerFunction
);

// Delete a requirement
await requirementClient.delete(
  guildIdOrUrlName,
  roleId,
  requirementId,
  signerFunction
);
```

#### `Role reward client`

```ts
const {
  guild: {
    role: { reward: rewardClient },
  },
} = guildClient;

// Get a role reward
const reward = rewardClient.get(
  guildIdOrUrlName,
  roleId,
  rolePlatformId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Get all rewards of a role
const roleReward = rewardClient.getAll(
  guildIdOrUrlName,
  roleId,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Create a role reward (for example a Discord role) with a guild reward (Discord server)
const createdReward = rewardClient.create(
  guildIdOrUrlName,
  roleId,
  {
    guildPlatform: {
      // Here we are also creating a guild reward (the Discord server)
      platformName: "DISCORD",
      platformGuildId: "<DC_SERVER_ID>",
    },
    platformRoleId: "<DC_ROLE_ID>",
  },
  signerFunction
);

// Or create a role reward using an existing guild reward
const createdReward = rewardClient.create(
  guildIdOrUrlName,
  roleId,
  {
    guildPlatformId, // Here we are passing the id of an existing guild role (in this case a Discord server)
    platformRoleId: "<DC_ROLE_ID>",
  },
  signerFunction
);

// Update an existing role reward
const updatedRoleReward = rewardClient.update(
  guildIdOrUrlName,
  roleId,
  rolePlatformId,
  { visibility: "HIDDEN" }, // In this example we update a reward's visibility to HIDDEN
  signerFunction
);

// Delete a role reward
rewardClient.delete(guildIdOrUrlName, roleId, rolePlatformId, signerFunction);
```

#### `User client`

```ts
const { user: userClient } = guildClient;

// Get a user by numeric ID, or an address
const user = await userClient.get(userIdOrAddress);

// Get current memberships of a user
const userMemberships = await userClient.getMemberships(
  userIdOrAddress,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Get a user's profile
const profile = await userClient.getProfile(
  userIdOrAddress,
  signerFunction // Optional, if a valid signer is provided, the result will contain private data
);

// Delete a user
await userClient.delete(userIdOrAddress, signerFunction);
```

#### `User address client`

```ts
const {
  user: { address: userAddressClient },
} = guildClient;

// Get a user address
const userAddress = await userAddressClient.get(
  userIdOrAddress, // Used for identifying the guild user
  address, // The userAddress with this address will be returned
  signerFunction
);

// Get all addresses of a user
const userAddresses = await userAddressClient.getAll(
  userIdOrAddress,
  signerFunction
);

// Create (connect / link) a new user address
const linkedAddress = await userAddressClient.create(
  userIdOrAddress,
  signerFunctionOfAddressToLink, // Should be a SignerFunction that is derived from the wallet that is being linked to the user. Can be obtained as described above
  signerFunction
);

// Update a user address
const updatedUserAddress = await userAddressClient.update(
  userIdOrAddress,
  addressToUpdate,
  { isPrimary: true }, // In this example we update an address to be primary
  signerFunction
);

// Delete (disconnect / unlink) a user address
await userAddressClient.delete(
  userIdOrAddress,
  addressToUpdate,
  signerFunction
);
```

#### `User platform client`

```ts
const {
  user: { platform: userPlatformClient },
} = guildClient;

// Get a user platform connection
const userPlatform = await userPlatformClient.get(
  userIdOrAddress,
  platformId,
  signerFunction
);

// Get all platform connections of a user
const userPlatforms = await userPlatformClient.getAll(
  userIdOrAddress,
  signerFunction
);

// Delete (disconnect / unlink) a platform connection
await userPlatformClient.delete(userIdOrAddress, platformId, signerFunction);
```

### Modular / multi-platform architecture

Guild.xyz no longer limits its platform gating functionalities to a single gateable Discord server or Telegram group. In the new multi-platform architecture you can gate more platforms in a single guild/role.

The `guildPlatform` entity refers to a platform gated by the guild. It contains information about the gate platform, e.g.: a Discord server's id (`platformGuildId` which is a uniqu identifier of this platform) and optionally some additional data like the `inviteChannel` in the `platformRoleData` property in this case.

The `rolePlatform` entity connects a `guildPlatform` to a role indicating that this role gives access to that platform. It can also contain some additional information about the platform (`platformRoleId` and `platformRoleData`), in Discord's case it's the Discord-role's id.

Note that for example in Telegram's case `platformRoleId` is not required; only `platformGuild` (which refers to a telegram group's id) needs to be provided in `guildPlatform`.

### Examples

#### `Example flow from Create Guild to Join`

```ts
import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Wallet } from "ethers";
import { randomBytes } from "crypto";

// Creating a guild client
const guildClient = createGuildClient("sdk-readme-example");

// Creating a random wallet for the example
const wallet = new Wallet(randomBytes(32).toString("hex"));

// Creating a signer function
const signerFunction = createSigner.fromEthersWallet(wallet);

// Creating a Guild

await guildClient.guild.create(
  {
    name: "My New Guild",
    urlName: "my-new-guild-123", // Optinal
    description: "Cool stuff", // Optional
    admins: ["0x916b1aBC3C38852B338a22B08aF19DEe14113627"], // Optional
    showMembers: true, // Optional
    hideFromExplorer: false, // Optional
    theme: [{ color: "#000000" }], // Optional
    guildPlatforms: [
      // Optional (declaring the gated platforms)
      {
        platformName: "DISCORD",
        platformGuildId: "717317894983225012",
        platformGuildData: { inviteChannel: "832195274127999019" },
      },
    ],
    roles: [
      {
        name: "My First Role",
        logic: "AND",
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: [
                "0xedd9C1954c77beDD8A2a524981e1ea08C7E484Be",
                "0x1b64230Ad5092A4ABeecE1a50Dc7e9e0F0280304",
              ],
            },
          },
        ],
        rolePlatforms: [
          // Optional (connecting gated platforms to the role)
          {
            guildPlatformIndex: 0,
            platformRoleId: "947846353822178118",
          },
        ],
      },
      {
        name: "My Second Role",
        logic: "OR",
        requirements: [
          {
            type: "ERC20",
            chain: "ETHEREUM",
            address: "0xf76d80200226ac250665139b9e435617e4ba55f9",
            data: {
              amount: 1,
            },
          },
          {
            type: "ERC721",
            chain: "ETHEREUM",
            address: "0x734AA2dac868218D2A5F9757f16f6f881265441C",
            data: {
              amount: 1,
            },
          },
        ],
        rolePlatforms: [
          // Optional (connecting gated platforms to the role)
          {
            guildPlatformIndex: 0,
            platformRoleId: "283446353822178118",
          },
        ],
      },
    ],
  },
  signerFunction
);

// Joining to a Guild if any role is accessible by the given address
await guildClient.guild.join(myGuild.id, signerFunction);
```

#### `Multiple telegram groups guild`

```typescript
const myGuild = await guildClient.guild.create(
  {
    name: "My Telegram Guild",
    guildPlatforms: [
      {
        platformName: "TELEGRAM", // Telegram group 0
        platformGuildId: "-1001190870894",
      },
      {
        platformName: "TELEGRAM", // Telegram group 1
        platformGuildId: "-1003847238493",
      },
      {
        platformName: "TELEGRAM", // Telegram group 2
        platformGuildId: "-1008347384212",
      },
    ],
    roles: [
      {
        name: "My First Role",
        logic: "AND",
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: [
                "0xedd9C1954c77beDD8A2a524981e1ea08C7E484Be",
                "0x1b64230Ad5092A4ABeecE1a50Dc7e9e0F0280304",
              ],
            },
          },
        ],
        rolePlatforms: [
          {
            guildPlatformIndex: 0, // Telegram group 0
          },
          {
            guildPlatformIndex: 2, // Telegram group 2
          },
        ],
      },
      {
        name: "My Second Role",
        logic: "OR",
        requirements: [
          {
            type: "ERC20",
            chain: "ETHEREUM",
            address: "0xf76d80200226ac250665139b9e435617e4ba55f9",
            data: {
              amount: 1,
            },
          },
        ],
        rolePlatforms: [
          {
            guildPlatformIndex: 1, // Telegram group 1
          },
        ],
      },
    ],
  },
  signerFunction
);
```
