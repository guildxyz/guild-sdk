<div align="center">
<h1> Guild SDK for TypeScript | WIP </h1>
<a href="https://www.npmjs.com/package/@guildxyz/sdk"><img src="https://img.shields.io/npm/v/prisma.svg?style=flat" /></a>
  <a href="https://github.com/agoraxyz/guild-sdk/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <br/>
  <a href="https://guild.xyz">Application</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/guildxyz">Twitter</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://docs.guild.xyz/guild/">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://roadmap.guild.xyz/">Community Roadmap</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://github.com/agoraxyz">Github</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://discord.gg/guildxyz">Discord</a>
</div>
  
  
  
## Summary

The Guild SDK library is a Typescript library for interacting with the Guild API. This document explains how to authenticate, manage your Guilds easily and automate token-gated access in any application with this SDK.

Guild.xyz is the membership layer protocol for web3 communities, making community management easy and interoperable between platforms.

Check out our API documentation for more information about guilds, roles and what is possible: https://docs.guild.xyz/guild/guild-api-alpha

Developed and maintained by the @agoraxyz team.
Twitter: https://twitter.com/agora_xyz
Webpage: https://agora.xyz
GitHub: https://github.com/agoraxyz

#### Node.js

To install our SDK on Node.js, open your terminal and run:

```
npm i @guildxyz/sdk
```

#### Importing the package and specific types

```typescript
import { guild, role, user, setProjectName } from "@guildxyz/sdk";

// To simplify the authentication, we implemented the whole flow, you just have to provide a signing function from your library (like ethers or web3react). Check the examples below.

// ethers.js signing method example
import { ethers } from "ethers";
const ethersWallet =
  ethers.Wallet.createRandom() || ethers.Wallet.fromMnemonic("");
const walletAddress = ethersWallet.address;
const signerFunction = (signableMessage: string | Bytes) =>
  ethersWallet.signMessage(signableMessage);

// Web3React signing method example
// import { useWeb3React } from "@web3-react/core";
// const { account: walletAddress, library } = useWeb3React();
// const signerFunction = (signableMessage: string | Bytes) =>
//   library.getSigner(account).signMessage(signableMessage);

setProjectName("My project") // The project name should be set at initialization.

// The walletAddress here is equals always with the signer's address

await guild.get(guildId); // Get Guild by ID (detailed)
await guild.get(urlName); // Get Guild by url name (detailed) - for example "our-guild"
await guild.getAll(); // Get All Guilds basic information
await guild.getUserAccess(guildId, userAddress); // Access checking for an address for a specific Guild
await guild.getUserMemberships(guildId, userAddress); // User current memberships for the given Guild
await guild.create(walletAddress, signerFunction, createGuildParams); // Create a guild with specific params - check the example below
await guild.update(guildId, walletAddress, signerFunction, updateGuildParams); // Update a guild with the given params
await guild.delete(guildId, walletAddress, signerFunction, removePlatformAccess); // Remove a guild by ID

await user.join(guildId, walletAddress, signerFunction, platforms); // Enables to join a user to the accessible roles in a Guild. (The platforms parameter is optional, it is used for connecting platform accounts to a Guild user.)
await user.getMemberships(userAddress); // Returns every Guild and Role of a given user

await role.get(roleId); // Get Role by ID
await role.create(walletAddress, signerFunction, createRoleParams); // Create a role for an existing Guild
await role.update(roleId, walletAddress, signerFunction, updateRoleParams); // Update a role with the given params
await role.delete(roleId, walletAddress, signerFunction, removePlatformAccess); // Remove a role by ID
```

#### Browser

You can create an index.html file and include our SDK with:

```html
<script src="https://cdn.jsdelivr.net/npm/@guildxyz/sdk"></script>
```

#### Quick Start flow from Create Guild to Join

```typescript
import { guild, user } from "@guildxyz/sdk";
import { ethers } from "ethers";

// Creating a random wallet for the example
const wallet = ethers.Wallet.createRandom();
// Wrapping the signer function from ethers.js
const sign = (signableMessage) => wallet.signMessage(signableMessage);

// Creating a Guild
const myGuild = await guild.create(
  wallet.address, // You have to insert your own wallet here
  sign,
  {
    name: "My New Guild",
    urlName: "my-new-guild-123",                 // Optinal
    description: "Cool stuff",                   // Optional
    admins: ["0x916b1aBC3C38852B338a22B08aF19DEe14113627"], // Optional
    showMembers: true,                           // Optional
    hideFromExplorer: false,                     // Optional
    theme: [{ mode: "DARK", color: "#000000" }], // Optional
    guildPlatforms: [                            // Optional (declaring the gated platforms)
      {
        platformName: "DISCORD",
        platformGuildId: "717317894983225012",
        platformGuildData: {inviteChannel: "832195274127999019"}
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
        rolePlatforms: [ // Optional (connecting gated platforms to the role)
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
        rolePlatforms: [ // Optional (connecting gated platforms to the role)
          {
            guildPlatformIndex: 0,
            platformRoleId: "283446353822178118",
          },
        ],
      },
    ],
  }
);

// Joining to a Guild if any role is accessible by the given address
await user.join(myGuild.id, wallet.address, sign);

// Connect Discord account (if not yet connected) to Guild and join
await user.join(myGuild.id, wallet.address, sign, [
  {
    name: "DISCORD",
    authData: {
      access_token: "123" // Discord access token retrieved from oauth
    }
  }
]);
// Note that the above shoud be used exactly once per user, 
// when the user's platform account is not connected to their Guild account.
// If it is already connected, the join will grant access for all the
// user's connected platforms automatically.
```

### Modular / multi-platform architecture
Guild.xyz no longer limits its platform gating functionalities to a single gateable Discord server or Telegram group. In the new multi-platform architecture you can gate more platforms in a single guild/role.

The `guildPlatform` entity refers to a platform gated by the guild. It contains information about the gate platform, e.g.: a Discord server's id (`platformGuildId` which is a uniqu identifier of this platform) and optionally some additional data like the `inviteChannel` in the `platformRoleData` property in this case.

The `rolePlatform` entity connects a `guildPlatform` to a role indicating that this role gives access to that platform. It can also contain some additional information about the platform (`platformRoleId` and `platformRoleData`), in Discord's case it's the Discord-role's id. 

Note that for example in Telegram's case `platformRoleId` is not required; only `platformGuild` (which refers to a telegram group's id) needs to be provided in `guildPlatform`.

### Multiple telegram groups guild example

```typescript
const myGuild = await guild.create(
  wallet.address,
  sign,
  {
    name: "My Telegram Guild",
    guildPlatforms: [
      {
        platformName: "TELEGRAM",           // Telegram group 0
        platformGuildId: "-1001190870894",
      },
      {
        platformName: "TELEGRAM",           // Telegram group 1
        platformGuildId: "-1003847238493",
      },
      {
        platformName: "TELEGRAM",           // Telegram group 2
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
            guildPlatformIndex: 0           // Telegram group 0
          },
          {
            guildPlatformIndex: 2           // Telegram group 2
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
          }
        ],
        rolePlatforms: [ 
          {
            guildPlatformIndex: 1,          // Telegram group 1
          },
        ],
      },
    ],
  }
);

```

## Authentication Overview

One of the most common problems with digital signature-based authentication systems is the replay attack. We have developed a new authentication method against this vulnerability, which both ensures the integrity of the request independent of TLS encapsulation (HTTPS) and protects against replay based attacks. This ensures protection from the signature service (Wallet client) all the way to the API.

## Example for Authentication only with ethers.js

```typescript
import { prepareBodyWithSign } from "@guildxyz/sdk";
import { ethers } from "ethers";

const wallet = ethers.Wallet.createRandom(); // You have to insert your own wallet here
const sign = (signableMessage: string | Bytes) =>
  ethersWallet.signMessage(signableMessage);

//Prepare body for request without payload
const bodyWithoutPayload = await prepareBodyWithSign(wallet.address, sign);

// {"payload":{},"validation":{"address":"0xea66400591bf2485907749f71615128238f7ef0a","addressSignedMessage":"0xddc0d710043a232b430a3678d76367489b8f6c329e27e81795e75efb4744289034fdc4f7284e37b791609b0e1d76bf9a1837db2a3adf158e31a37ac6c91656511c","nonce":"0x26bb7d4c941aec37b239dbf6850e149faace8df740809c8f989c270f2a543c51","random":"wrETMso/e9YiMloSSeEusgMuoaVirTuIPfkzYGkDv7w=","timestamp":"1646265565126"}}

//Prepare body for request with payload
const bodyWithPayload = await prepareBodyWithSign(wallet.address, sign, {
  guildId: 1234,
});
// {"payload":{"guildId":1234},"validation":{"address":"0xea66400591bf2485907749f71615128238f7ef0a","addressSignedMessage":"0x544855fc7c34b2411d74b45395ae59e87b6be10c15598a12446f3b0b0daf25f501ad8532a6420f9c8288724df2e03c14068786260a2eaaa9938e31318034fe1b1b","hash":"0xd24a3714283ef2c42428e247e76d4afe6bb6f4c73b10131978b877bc78238aa9","nonce":"0x3c3b72ba441b2740682d8974d96df2f61f3b9d49235d97ff6d5fd50373b2429c","random":"vrCxwqgt0ml9bF9z3Pxg9j9te1v0VU/9Yx9oFkfm84k=","timestamp":"1646267441728"}}
```

## Integrating new platforms to Guild (WIP)

```typescript
import { Platform } from "@guildxyz/sdk";

const platform = new Platform(platformName);

await platform.guild.get(platformGuildId);
await platform.guild.getUserAccess(platformGuildId, platformUserId);

await platform.user.join(platformGuildId, platformUserId);
await platform.user.status(platformGuildId, platformUserId);

// The non platform specific endpoints are also available at this instance. Eg.:
await platform.guild.create(walletAddress, signerFunction, createGuildParams);
await platform.role.get(roleId);
```
