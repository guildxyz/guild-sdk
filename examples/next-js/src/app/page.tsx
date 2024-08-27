"use client";

import {
  Button,
  ChakraProvider,
  HStack,
  ListItem,
  OrderedList,
  Spinner,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { createSigner } from "@guildxyz/sdk";
import { UserProfile } from "@guildxyz/types";
import { useState } from "react";
import useSWR from "swr";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import guildClient from "../lib/guild";

// Id of Our Guild (https://guild.xyz/our-guild)
// You can check your guild's id with the following endpoint:
// https://api.guild.xyz/v2/guilds/our-guild
const GUILD_ID = 1985;

function fetchUserMembershipsInGuild(address: `0x${string}`, guildId: number) {
  return guildClient.user
    .getMemberships(address)
    .then((results) => results.find((item) => item.guildId === guildId));
}

function fetchRoleNames(guildId: number) {
  return guildClient.guild.role
    .getAll(guildId)
    .then((roles) =>
      Object.fromEntries(roles.map(({ id, name }) => [id, name]))
    );
}

async function fetchLeaderboard(
  guildIdOrUrlName: number | string,
  isAllUser: boolean = false
) {
  const rewards = await guildClient.guild.reward.getAll(guildIdOrUrlName);

  // platformId === 13 means that the reward is point-based
  const pointsReward = rewards.find((reward) => reward.platformId === 13);

  // The guildPlatformId parameter could also be hardcoded
  // isAllUser means, that the response contains the whole leaderboard, while the value is false, it returns the first 500 user & address
  return guildClient.guild.getLeaderboard(
    guildIdOrUrlName,
    pointsReward!.id,
    undefined,
    isAllUser
  );
}

export default function Home() {
  const { address } = useAccount();

  const { connect: connectInjected } = useConnect({
    connector: new InjectedConnector(),
  });
  const { connect: connectWalletConnect } = useConnect({
    connector: new WalletConnectConnector({
      options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
    }),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [profile, setProfile] = useState<UserProfile>();

  const { data: userMemberships, isLoading: isUserMembershipsLoading } = useSWR(
    !!address ? ["memberships", address, GUILD_ID] : null,
    ([, ...props]) => fetchUserMembershipsInGuild(...props)
  );

  const { data: roles, isLoading: isRolesLoading } = useSWR(
    ["roles", GUILD_ID],
    ([, ...props]) => fetchRoleNames(...props)
  );

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useSWR(
    ["leaderboard", "walletconnect", false],
    ([, ...params]) => fetchLeaderboard(...params)
  );

  return (
    <ChakraProvider>
      <Stack alignItems={"start"} spacing={8} padding={8}>
        {address ? (
          <>
            <HStack>
              <Text>Connected to {address}</Text>

              <Button onClick={() => disconnect()}>Disconnect</Button>
            </HStack>
          </>
        ) : (
          <HStack spacing={8}>
            <Button onClick={() => connectInjected()}>Connect Injected</Button>
            <Button onClick={() => connectWalletConnect()}>
              Connect WalletConnect
            </Button>
          </HStack>
        )}

        {!!address && (
          <>
            <Text fontSize={"xx-large"}>Fetch user profile</Text>
            {!profile ? (
              <Button
                onClick={() =>
                  guildClient.user
                    .getProfile(
                      address,
                      createSigner.custom(
                        (message) => signMessageAsync({ message }),
                        address
                      )
                    )
                    .then(setProfile)
                }
              >
                Call Guild API
              </Button>
            ) : (
              <Text>{JSON.stringify(profile)}</Text>
            )}
          </>
        )}

        <Text fontSize={"xx-large"}>List Memberships</Text>

        {isUserMembershipsLoading || isRolesLoading ? (
          <Spinner />
        ) : !userMemberships || !roles ? (
          <Text>No data</Text>
        ) : (
          <UnorderedList>
            {userMemberships.roleIds.map((roleId) => (
              <ListItem key={roleId}>
                {roles[roleId]} (#{roleId})
              </ListItem>
            ))}
          </UnorderedList>
        )}

        <Text fontSize={"xx-large"}>Listing Point Leaderboard</Text>

        {leaderboard?.isRevalidating && (
          <Text color="red">
            Leaderboard is currently revalidating, current data might be
            inconsistent.
          </Text>
        )}

        {isLeaderboardLoading ? (
          <Spinner />
        ) : !leaderboard ? (
          <Text>No data</Text>
        ) : (
          <OrderedList>
            {leaderboard.leaderboard.map(({ userId, address, totalPoints }) => (
              <ListItem key={userId}>
                {address} ({totalPoints} points)
              </ListItem>
            ))}
          </OrderedList>
        )}
      </Stack>
    </ChakraProvider>
  );
}
