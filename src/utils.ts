/* eslint-disable no-unused-vars */
import { consts, schemas, Schemas } from "@guildxyz/types";
import assert from "assert";
import { randomBytes } from "crypto";
import { BytesLike, keccak256, SigningKey, toUtf8Bytes, Wallet } from "ethers";
import type { z } from "zod";
import { globals } from "./common";
import { GuildAPICallFailed, GuildSDKValidationError } from "./error";

export const recreateMessage = (params: Schemas["Authentication"]["params"]) =>
  `${params.msg}\n\nAddress: ${params.addr}\nMethod: ${params.method}${
    params.method === consts.AuthMethod.EIP1271
      ? `\nChainId: ${params.chainId}`
      : ""
  }${params.hash ? `\nHash: ${params.hash}` : ""}\nNonce: ${
    params.nonce
  }\nTimestamp: ${params.ts}`;

export type SignerFunction = (
  // eslint-disable-next-line no-unused-vars
  payload?: any,
  // eslint-disable-next-line no-unused-vars
  getMessage?: (params: Schemas["Authentication"]["params"]) => string
) => Promise<{
  params: Schemas["Authentication"]["params"];
  sig: string;
  payload: string;
}>;

type SignerOptions = {
  msg?: string;
};

export const createSigner = {
  fromEthersWallet:
    (
      wallet: Wallet,
      { msg = "Please sign this message" }: SignerOptions = {}
    ): SignerFunction =>
    async (payload = {}, getMessage = recreateMessage) => {
      const stringPayload = JSON.stringify(payload);

      const params = schemas.AuthenticationParamsSchema.parse({
        method: consts.AuthMethod.EOA,
        addr: wallet.address,
        msg,
        nonce: randomBytes(32).toString("base64"),
        ts: `${Date.now()}`,
        hash: keccak256(toUtf8Bytes(stringPayload)),
      });

      // To have proper output typing (only EOA variant). Should never throw, as method is hardcoded
      assert(params.method === consts.AuthMethod.EOA);

      const sig = await wallet.signMessage(toUtf8Bytes(getMessage(params)));

      return { params, sig, payload: stringPayload };
    },

  fromPrivateKey: (privateKey: BytesLike, options: SignerOptions = {}) =>
    createSigner.fromEthersWallet(
      new Wallet(new SigningKey(privateKey)),
      options
    ),

  custom:
    (
      // eslint-disable-next-line no-unused-vars
      sign: (message: string) => Promise<string>,
      address: string,
      {
        msg = "Please sign this message",
        chainIdOfSmartContractWallet,
      }: { chainIdOfSmartContractWallet?: number } & SignerOptions = {}
    ): SignerFunction =>
    async (payload = {}, getMessage = recreateMessage) => {
      const stringPayload = JSON.stringify(payload);

      const params = schemas.AuthenticationParamsSchema.parse({
        addr: address,
        msg,
        nonce: randomBytes(32).toString("base64"),
        ts: `${Date.now()}`,
        hash: keccak256(toUtf8Bytes(stringPayload)),
        ...(typeof chainIdOfSmartContractWallet === "number"
          ? {
              chainId: chainIdOfSmartContractWallet.toString(),
              method: consts.AuthMethod.EIP1271,
            }
          : { method: consts.AuthMethod.EOA }),
      });

      const sig = await sign(getMessage(params));

      return { params, sig, payload: stringPayload };
    },
  apiKeySigner:
    (addressOrUserId?: string | number): SignerFunction =>
    async () => ({
      params: {
        addr: addressOrUserId as string,
        method: "1",
        msg: "",
        nonce: "",
        ts: "",
        hash: "",
      },
      sig: "",
      payload: "",
    }),
};

type SchemasImportType = (typeof import("@guildxyz/types"))["schemas"];
type SchemaNames = keyof SchemasImportType;
type MappedSchemas = {
  [Schema in SchemaNames]: {
    schema: Schema;
    data: z.input<SchemasImportType[Schema]>;
  };
}[SchemaNames];

type CallGuildAPIParams = {
  url: string;
  queryParams?: Record<string, any>;
  queryParamsSchema?: MappedSchemas["schema"];
  signer?: SignerFunction;
} & (
  | {
      method: "GET";
    }
  | {
      method: "POST" | "PUT" | "DELETE" | "PATCH";
      body?: MappedSchemas;
    }
);

// Couldn't get proper type inference if the type params are on the same function
export const callGuildAPI = async <ResponseType>(
  params: CallGuildAPIParams
): Promise<ResponseType> => {
  let parsedQueryParams = null;
  if (params.queryParams) {
    if (params.queryParamsSchema) {
      const validationResult = schemas[params.queryParamsSchema].safeParse(
        params.queryParams
      );
      if (validationResult.success) {
        parsedQueryParams = params.queryParams;
      } else {
        throw new GuildSDKValidationError(validationResult.error);
      }
    } else {
      parsedQueryParams = params.queryParams;
    }
  }

  const queryParamEntries = Object.entries(parsedQueryParams ?? {})
    .filter(([, value]) => !!value)
    .map(([key, value]) => [key, `${value}`]);

  const baseUrl = params.url.startsWith("/v1/")
    ? globals.apiBaseUrl.replace("/v2", "")
    : globals.apiBaseUrl;

  const url =
    queryParamEntries.length > 0
      ? `${baseUrl}${params.url}?${new URLSearchParams(queryParamEntries)}`
      : `${baseUrl}${params.url}`;

  let parsedPayload = {};
  if (params.method !== "GET" && !!params.body?.schema && !!params.body?.data) {
    const validationResult = schemas[params.body.schema].safeParse(
      params.body.data
    );
    if (validationResult.success) {
      parsedPayload = validationResult.data;
    } else {
      throw new GuildSDKValidationError(validationResult.error);
    }
  }

  const hasAPIKey =
    !!globals.headers[consts.AUTH_HEADER_NAME] &&
    !!globals.headers[consts.SERVICE_HEADER_NAME];

  const authentication = await params.signer?.(parsedPayload);

  const response = await fetch(url, {
    method: params.method,
    body:
      params.method === "GET"
        ? undefined
        : JSON.stringify(
            params.signer && !hasAPIKey ? authentication : parsedPayload
          ),
    headers: {
      ...(params.method === "GET" && authentication
        ? {
            [consts.PARAMS_HEADER_NAME]: Buffer.from(
              JSON.stringify(authentication.params)
            ).toString("base64"),
            [consts.SIG_HEADER_NAME]: Buffer.from(
              authentication.sig.startsWith("0x")
                ? authentication.sig.slice(2)
                : authentication.sig,
              "hex"
            ).toString("base64"),
          }
        : {}),
      ...globals.headers,
      ...(hasAPIKey && authentication?.params?.addr
        ? {
            [consts.PRIVILEGED_USER_ID_HEADER]: authentication.params.addr,
          }
        : {}),
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new GuildAPICallFailed(
      url.replace(baseUrl, ""),
      responseBody?.errors?.[0]?.msg ??
        responseBody?.message ??
        "Unexpected Error",
      response.status,
      response.headers.get("x-correlation-id") ?? ""
    );
  }

  return responseBody;
};

export type OnPoll<Job> = (
  job: Job | null,
  promiseHandlers: {
    resolve: (value: Job | PromiseLike<Job | null> | null) => void;
    reject: (reason?: any) => void;
  }
) => void;

export type PollOptions<Job> = { onPoll?: OnPoll<Job>; intervalMs?: number };

export const createAndAwaitJob = async <
  Job extends { done?: boolean; error?: any; errorMsg?: any },
>(
  url: string,
  body: MappedSchemas,
  queryParams: Record<string, any>,
  signer: SignerFunction,
  { onPoll, intervalMs = 1000 }: PollOptions<Job> = {}
) => {
  await callGuildAPI<{ jobId: string }>({
    url,
    method: "POST",
    body,
    signer,
  });

  let interval: ReturnType<typeof setInterval>;

  return new Promise<Job | null>((resolve, reject) => {
    interval = setInterval(() => {
      callGuildAPI<Job[]>({
        url,
        method: "GET",
        queryParams,
        signer,
      }).then(([job = null]) => {
        onPoll?.(job, { resolve, reject });

        if (!job) {
          reject(job);
          return; // Return is needed, so TS knows, that after this point job is not null
        }
        if (!job.done) return;

        if (job.error ?? job.errorMsg) reject(job);
        else resolve(job);
      });
    }, intervalMs);
  }).finally(() => {
    clearInterval(interval);
  });
};
