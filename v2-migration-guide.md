<div align="center">
<h1> Guild SDK v2 migration guide </h1>
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
    <a href="https://discord.gg/guildxyz">Discord</a>
</div>

## Contents

- [SignerFunction](#signing-a-message)
- [Clients](#clients)
  - [Platform](#platform)
  - [User](#user)
    - [getMemberships](#getmemberships)
    - [join](#join)
  - [Guild](#guild)
    - [getAll](#getall)
    - [getByAddress](#getbyaddress)
    - [get](#get)
    - [getUserAccess](#getuseraccess)
    - [getUserMemberships](#getusermemberships)
    - [create](#create)
    - [update](#update)
    - [delete](#delete)
  - [Role](#role)
    - [get](#get-1)
    - [create](#create-1)
    - [update](#update-1)
    - [delete](#delete-1)

## Signing a message

Use `createSigner` to construct a signer function. There are multiple ways to create a signer function, for example `createSigner.fromEthersWallet` can construct a signer from an `ethers.Walllet`

```ts
import { createSigner, guild } from "@guildxyz/sdk";
import { Wallet } from "ethers";
import { randomBytes } from "crypto";

const privateKey = randomBytes(32);

const mySigner = createSigner.fromEthersWallet(
  new Wallet(privateKey.toString("hex"))
);

// Use it directly
const myAuthData = await mySigner({ some: "payload" });

// Or pass it to a client method
const createdGuild = await guild.create(
  {
    name: "My SDK test Guild",
    urlName: "my-sdk-test-guild",
    description: "My first Guild created with the SDK",
    roles: [{ name: "My SDK test Role", requirements: [{ type: "FREE" }] }],
  },
  mySigner
);
```

## Clients

These clients have changed in the latest version of the SDK, and are now more flexible, and easier to use. The `platformName` parameter is no longer needed, as it is now a property of the client. The `signerAddress` and `sign` parameters are no longer needed either, as the clients now accept a single `signer: SignerFunction` parameter. The `SignerFunction` is a function that takes a payload, and returns a signature. See [Signing a message](#signing-a-message) for more details.

### Platform

Use the `withPlatformName` function on the `platform` client to create a platform client that is fixed with a specific `platformName`

```ts
import { platform } from "@guildxyz/sdk";

const discordClient = platform.withPlatformName("DISCORD")

await discordClient.getGuildByPlatform(...) // Doesn't need a platformName parameter!
```

### User

#### `getMemberships`

Now accepts user ids as well, and optionally takes a `SignerFunction`. If the signer is provided, and the signature is successfully validated, the result will be more detailed.

```ts
import { user } from "@guildxyz/sdk";

const userMemberships = await user.getMemberships("0x...", mySigner);

const guildMembership = userMemberships.find(
  ({ guildId }) => guildId === someGuildId
);
```

#### `join`

Use the `actions.join` client. Create a new join action with `actions.join.start`, then poll it's state by either calling `actions.join.poll`, or `actions.join.await`. The former will make a single poll, while the latter will keep polling the state until the job is done

```ts
import { actions } from "@guildxyz/sdk";

// Start a join action, if it hasn't been started yet
await actions.join.start(someGuildId, mySigner);

// Poll the job until it is done. Poll every 2 seconds, and log results
const joinResult = actions.join.await(someGuildId, mySigner, console.log, 2000);
```

### Guild

#### `getAll`

Use `guild.getMany` to fetch multiple guilds by their IDs. Use `guild.search` to search for guilds with paginated results. The `roles: string[]` field, containing the names of the guild's roles isn't returned anymore, if needed, it needs to be fetched separately with a `guild.role.getAll` call

```ts
import { guild } from "@guildxyz/sdk";

const guilds = await guild.getMany([someGuildId, someOtherGuildId]);
```

#### `getByAddress`

This method doesn't exist anymore

#### `get`

Use `guild.get`. The response won't include roles, rewards, nor admins. Those can be fetched with `guild.role.getAll`, `guild.reward.getAll`, and `guild.admin.getAll`

```ts
import { guild } from "@guildxyz/sdk";

const guild = await guild.get(someGuildId);
const guildPlatforms = await guild.reward.getAll(someGuildId);
const roles = await guild.role.getAll(someGuildId);
const admins = await guild.admin.getAll(someGuildId);
```

> Note that the role response won't include everything either, rolePlatforms/rewards, and requirements will be missing, those can be fetched with `guild.role.reward.getAll` and `guild.role.requirement.getAll`

#### `getUserAccess`

Use `guild.getMemberAccess`. It now accepts user id as well, and optionally a signer to get more detailed output

```ts
import { guild } from "@guildxyz/sdk";

const memberAccess = await guild.getMemberAccess(someGuildId, someUserId);
```

#### `getUserMemberships`

Use `user.getMemberships` to fetch for all the guilds, where the user is a member

```ts
import { user } from "@guildxyz/sdk";

const memberships = await user.getMemberships(someUserId);

const guildMembership = memberships.find(
  ({ guildId }) => guildId === someGuildId
);
```

#### `create`

Use `guild.create`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`

```ts
import { guild } from "@guildxyz/sdk";

const createdGuild = await guild.create(
  {
    name: "My SDK test Guild",
    urlName: "my-sdk-test-guild",
    description: "My first Guild created with the SDK",
    roles: [{ name: "My SDK test Role", requirements: [{ type: "FREE" }] }],
  },
  mySigner
);
```

#### `update`

Use `guild.update`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`

```ts
import { guild } from "@guildxyz/sdk";

const updatedGuild = await guild.update(
  someGuildId,
  {
    description: "I've edited my first Guild created with the SDK",
  },
  mySigner
);
```

#### `delete`

Use `guild.delete`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. The `success` flag in the response isn't returned anymore, if the call resolved, then the deletion was successful, if it rejected, then something went wrong, and a `GuildAPICallFailed` error is thrown

```ts
import { guild } from "@guildxyz/sdk";

await guild.delete(someGuildId, mySigner);
```

### Role

#### `get`

Use `guild.role.get`. It now needs a `guildIdOrUrlName` param as well, and optionally takes a signer for more detailed results. The `guildId`, `members`, `requirements` and `rolePlatforms` fields aren't included in the result anymore. `guildId` is assumed to be known, as it is needed to make the get call, the other three can be fetched sepatarately with `guild.getMembers`, `guild.role.requirement.getAll` and `guild.role.reward.getAll`

```ts
import { guild } from "@guildxyz/sdk";

const role = await guild.role.get(someGuildId, someRoleId);
```

#### `create`

Use `guild.role.create`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. Similarly to `get`, the `guildId`, `members`, `requirements` and `rolePlatforms` fields aren't included in the response

```ts
import { guild } from "@guildxyz/sdk";

const createdRole = await guild.role.create(
  someGuildId,
  { name: "My new Role", requirements: [{ type: "FREE" }] },
  mySigner
);
```

#### `update`

Use `guild.role.update`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. Similarly to `get`, the `guildId`, `members`, `requirements` and `rolePlatforms` fields aren't included in the response

```ts
import { guild } from "@guildxyz/sdk";

const updatedRole = await guild.role.update(
  someGuildId,
  someRoleId,
  { description: "I've edited my new role" },
  mySigner
);
```

#### `delete`

Use `guild.role.delete`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. The `success` flag in the response isn't returned anymore, if the call resolved, then the deletion was successful, if it rejected, then something went wrong, and a `GuildAPICallFailed` error is thrown

```ts
import { guild } from "@guildxyz/sdk";

await guild.role.delete(someGuildId, someRoleId, mySigner);
```
