# Guild SDK v2 migration guide

## `prepareBodyWithSign`

Use `createSigner` to construct a signer function. There are multiple ways to create a signer function, for example `createSigner.fromEthersWallet` can construct a signer from an `ethers.Walllet`

```ts
import { createSigner, guild } from "@guildxyz/sdk";
import { Wallet } from "ethers";
import { randomBytes } from "crypto";

const privateKey = randomBytes(32);

// Alternatively createSigner.fromPrivateKey(privateKey)
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

## `Platform`

Use the `withPlatformName` function on the `platform` client to create a platform client that is fixed with a specific `platformName`

```ts
import { platform } from "@guildxyz/sdk";

const discordClient = platform.withPlatformName("DISCORD")

await discordClient.getGuildByPlatform(...) // Doesn't need a platformName parameter!
```

## `user` client

### `getMemberships`

Now accepts user ids as well, and optionally takes a `SignerFunction`. If the signer is provided, and the signature is successfully validated, the result will be more detailed

```ts
import { user } from "@guildxyz/sdk";

const userMemberships = await user.getMemberships("0x...", mySigner);

const guildMembership = userMemberships.find(
  ({ guildId }) => guildId === someGuildId
);
```

### `join`

Use the `actions.join` client. Create a new join action with `actions.join.start`, then poll it's state by either calling `actions.join.poll`, or `actions.join.await`. The former will make a single poll, while the latter will keep polling the state until the job is done

```ts
import { actions } from "@guildxyz/sdk";

// Start a join action, if it hasn't been started yet
await actions.join.start(someGuildId, mySigner);

// Poll the job until it is done. Poll every 2 seconds, and log results
const joinResult = actions.join.await(someGuildId, mySigner, console.log, 2000);
```

## `guild` client

### `getAll`

Use `guild.getMany` to fetch multiple guilds by their IDs. Use `guild.search` to search for guilds with paginated results. The `roles: string[]` field, containing the names of the guild's roles isn't returned anymore, if needed, it needs to be fetched separatly with a `guild.role.getAll` call

```ts
import { guild } from "@guildxyz/sdk";

const guilds = await guild.getMany([someGuildId, someOtherGuildId]);
```

### `getByAddress`

This method doesn't exist anymore

### `get`

Use `guild.get`. The response won't include roles, nor rewards. Those can be fetched with `guild.role.getAll` and `guild.reward.getAll`

```ts
import { guild } from "@guildxyz/sdk";

const result = await guild.get(someGuildId);
```

### `getUserAccess`

Use `guild.getMemberAccess`. It now accepts user id as well, and optionally a signer to get more detaled output

```ts
import { guild } from "@guildxyz/sdk";

const memberAccess = await guild.getMemberAccess(someGuildId, someUserId);
```

### `getUserMemberships`

Use `user.getMemberships` to fetch for all the guilds, where the user is a member

```ts
import { user } from "@guildxyz/sdk";

const memberships = await user.getMemberships(someUserId);

const guildMembership = memberships.find(
  ({ guildId }) => guildId === someGuildId
);
```

### `create`

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

### `update`

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

### `delete`

Use `guild.delete`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. The `success` flag in the response isn't returned anymore, if the call resolved, then the deletion was successful, if it rejected, then something went wrong, and a `GuildAPICallFailed` error is thrown

```ts
import { guild } from "@guildxyz/sdk";

await guild.delete(someGuildId, mySigner);
```

## `role` client

### `get`

Use `guild.role.get`. It now needs a `guildIdOrUrlName` param as well, and optionally takes a signer for more detailed results. The `guildId`, `members`, `requirements` and `rolePlatforms` fields aren't included in the result anymore. `guildId` is assumed to be known, as it is needed to make the get call, the other three can be fetched sepatarately with `guild.getMembers`, `guild.role.requirement.getAll` and `guild.role.reward.getAll`

```ts
import { guild } from "@guildxyz/sdk";

const role = await guild.role.get(someGuildId, someRoleId);
```

### `create`

Use `guild.role.create`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. Similarly to `get`, the `guildId`, `members`, `requirements` and `rolePlatforms` fields aren't included in the response

```ts
import { guild } from "@guildxyz/sdk";

const createdRole = await guild.role.create(
  someGuildId,
  { name: "My new Role", requirements: [{ type: "FREE" }] },
  mySigner
);
```

### `update`

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

### `delete`

Use `guild.role.delete`. Instead of separate `signerAddress`, and `sign` params, it now accepts a single `signer: SignerFunction`. The `success` flag in the response isn't returned anymore, if the call resolved, then the deletion was successful, if it rejected, then something went wrong, and a `GuildAPICallFailed` error is thrown

```ts
import { guild } from "@guildxyz/sdk";

await guild.role.delete(someGuildId, someRoleId, mySigner);
```
