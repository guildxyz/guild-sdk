/* eslint-disable no-unused-vars */
import { JoinJob } from "@guildxyz/types";
import { OnPoll, SignerFunction, awaitJob, callGuildAPI } from "../../utils";

const join = {
  start: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<{ jobId: string }>({
      url: "/actions/join",
      method: "POST",
      body: {
        schema: "JoinActionPayloadSchema",
        data: { guildId },
      },
      signer,
    }),

  poll: (guildId: number, signer: SignerFunction) =>
    callGuildAPI<JoinJob[]>({
      url: "/actions/join",
      method: "GET",
      queryParams: { guildId },
      signer,
    }).then(([firstJob = null]) => firstJob),

  await: (
    guildId: number,
    signer: SignerFunction,
    onPoll?: OnPoll<JoinJob>,
    pollIntervalMs?: number
  ) => awaitJob(() => join.poll(guildId, signer), onPoll, pollIntervalMs),
};

export default join;
