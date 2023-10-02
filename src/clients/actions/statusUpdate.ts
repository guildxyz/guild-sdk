import { Schemas, StatusUpdateJob } from "@guildxyz/types";
import { OnPoll, SignerFunction, awaitJob, callGuildAPI } from "../../utils";

const statusUpdate = {
  start: (
    statusUpdateParams: Schemas["StatusUpdateActionPayload"],
    signer: SignerFunction
  ) =>
    callGuildAPI<{ jobId: string }>({
      url: "/actions/status-update",
      method: "POST",
      body: {
        schema: "StatusUpdateActionPayloadSchema",
        data: statusUpdateParams,
      },
      signer,
    }),

  pollByGuildId: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<StatusUpdateJob[]>({
      url: "/actions/status-update",
      method: "GET",
      queryParams: { guildId },
      signer,
    }).then(([firstJob = null]) => firstJob),

  awaitByGuildId: (
    guildId: number,
    signer: SignerFunction,
    onPoll?: OnPoll<StatusUpdateJob>,
    pollIntervalMs?: number
  ) =>
    awaitJob(
      () => statusUpdate.pollByGuildId(guildId, signer),
      onPoll,
      pollIntervalMs
    ),

  pollByRoleId: (roleId: number, signer: SignerFunction) =>
    callGuildAPI<StatusUpdateJob[]>({
      url: "/actions/status-update",
      method: "GET",
      queryParams: { roleId },
      signer,
    }).then(([firstJob = null]) => firstJob),

  awaitByRoleId: (
    roleId: number,
    signer: SignerFunction,
    onPoll?: OnPoll<StatusUpdateJob>,
    pollIntervalMs?: number
  ) =>
    awaitJob(
      () => statusUpdate.pollByRoleId(roleId, signer),
      onPoll,
      pollIntervalMs
    ),
};

export default statusUpdate;
