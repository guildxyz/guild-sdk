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
</div>
  
  
  
## Summary
The Guild SDK library is a Typescript library for interacting with the Guild API. This document explains how to authenticate, manage your Guilds easily through the SDK. Developed and maintained by the @agoraxyz team.

#### Node.js

To install our SDK on Node.js, open your terminal and run:

```
npm i @guildxyz/sdk
```

#### Importing the package and specific types

```typescript
import { guild, role, user } from "@guildxyz/sdk";
```

```typescript
import {
  Chain,
  Requirement,
  GetMembershipsResponse,
  JoinResponse,
  RequestWithAuth,
  GetAllGuildsResponse,
  GetGuildByIdResponse,
  GetUserAccessResponse,
  CreateGuildParams,
  UpdateGuildParams,
  CreateGuildResponse,
  DeleteGuildResponse,
  GetRoleResponse,
  CreateRoleParams,
  UpdateRoleParams,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  ApiError
  } from "@guildxyz/sdk";
```

#### Browser

You can create an index.html file and include our SDK with:

```html
<script src="https://cdn.jsdelivr.net/npm/@guildxyz/sdk"></script>
```

#### Create Guild

```typescript
import { guild } from "@guildxyz/sdk";
import { ethers } from "ethers";

guild.create(
  {
    name: "My New Guild",
    description: "Cool stuff",
    theme: [{ mode: "DARK", color: "#000000" }],
    roles: [
      {
        name: "My First Role",
        logic: "AND",
        requirements: [
          {
            type: "ALLOWLIST",
            data: {
              addresses: [
                "0x000000000000000000000000000000000000dEaD",
                "0x000000000000000000000000000000000000dead",
              ],
            },
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
            data: { amount: 1 },
          },
          {
            type: "ERC721",
            address: "0x734AA2dac868218D2A5F9757f16f6f881265441C",
            chain: "ETHEREUM",
            data: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  ethers.Wallet.createRandom() // You have to insert your own wallet here
);
```

## Authentication Overview

One of the most common problems with digital signature-based authentication systems is the replay attack. We have developed a new authentication method against this vulnerability, which both ensures the integrity of the request independent of TLS encapsulation (HTTPS) and protects against replay based attacks. This ensures protection from the signature service (Wallet client) all the way to the API.

## Example

```javascript
const guildAuth = require("@agoraxyz/guildauth");

//If you initialize guildAuth without a mnemonic, it will automatically generate a private key
const auth = new guildAuth();

//Or you can initialize with mnemonic
const auth = new guildAuth(
  "neglect twenty arena spatial thunder mixed citizen over awful glad rally stomach"
);

//Get current address
console.log(auth.getAddress());
// 0x502d5f2DfE608D5135e649F1d76466E977158BB3

//Get current mnemonic
console.log(auth.getMnemonic());
// neglect twenty arena spatial thunder mixed citizen over awful glad rally stomach

//Prepare request without payload
console.log(await auth.prepareRequest());
// {"payload":{},"validation":{"address":"0xea66400591bf2485907749f71615128238f7ef0a","addressSignedMessage":"0xddc0d710043a232b430a3678d76367489b8f6c329e27e81795e75efb4744289034fdc4f7284e37b791609b0e1d76bf9a1837db2a3adf158e31a37ac6c91656511c","nonce":"0x26bb7d4c941aec37b239dbf6850e149faace8df740809c8f989c270f2a543c51","random":"wrETMso/e9YiMloSSeEusgMuoaVirTuIPfkzYGkDv7w=","timestamp":"1646265565126"}}

//Prepare request with payload
console.log(await auth.prepareRequest({ guildId: 1234 }));
// {"payload":{"guildId":1234},"validation":{"address":"0xea66400591bf2485907749f71615128238f7ef0a","addressSignedMessage":"0x544855fc7c34b2411d74b45395ae59e87b6be10c15598a12446f3b0b0daf25f501ad8532a6420f9c8288724df2e03c14068786260a2eaaa9938e31318034fe1b1b","hash":"0xd24a3714283ef2c42428e247e76d4afe6bb6f4c73b10131978b877bc78238aa9","nonce":"0x3c3b72ba441b2740682d8974d96df2f61f3b9d49235d97ff6d5fd50373b2429c","random":"vrCxwqgt0ml9bF9z3Pxg9j9te1v0VU/9Yx9oFkfm84k=","timestamp":"1646267441728"}}

//Generate random wallet (https://docs.ethers.io/v5/api/signer/#Wallet-createRandom)
const wallet = auth.createRandomWallet();

//Generate random mnemonic
console.log(auth.createRandomMnemonic());
// letter sphere minimum tissue armed thumb wolf catalog theory mass arctic notice
```
