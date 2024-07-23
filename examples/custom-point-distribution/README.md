# Custom point distribution

This example script shows how you can distribute points on Guild based on custom data / logic

## Setup

- Install the dependencies: `npm i`
- Set the `PRIVATE_KEY` environment variable: `export PRIVATE_KEY=0x...`
  - If you already have a Guild, in which you intend to create the point reward, the account of the private key has to be an admin in that Guild, so it has the necessary permissions to create and update the points

## Creating a Guild

This example app can create a Guild by executing `npx ts-node index.js create-guild`
It will print the Guild's URL, and the relevant ID-s for the point updates

It sets the following things in the Guild:

- Basic data (its name, urlName, ...)
- A role with a GUILD_SNAPSHOT requirement. This requirement will be the source of the point distribution
- A POINTS reward, which taks it's input from the requirement

## Editing the points

The script shows how you can edit the points by running `npx ts-node index.js edit {guildId} {roleId} {requirementId}`

The `snapshot` represents the point distribution. It maps addresses to point values

> When a snapshot is updated this way, the whole previous `data` field fill be overwritten, so you'll have to call this update with the whole list every time it changes
