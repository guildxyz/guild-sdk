import { Authentication } from "@guildxyz/types";
import {
  AuthMethod,
  PARAMS_HEADER_NAME,
  SIG_HEADER_NAME,
} from "@guildxyz/types/consts";
import { AuthenticationParamsSchema } from "@guildxyz/types/schemas";
import assert from "assert";
import { randomBytes } from "crypto";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import type { ZodType, z } from "zod";
import { globals } from "./common";
import { GuildAPICallFailed, GuildSDKValidationError } from "./error";

export const recreateMessage = (params: Authentication["params"]) =>
  `${params.msg}\n\nAddress: ${params.addr}\nMethod: ${params.method}${
    params.method === AuthMethod.EIP1271 ? `\nChainId: ${params.chainId}` : ""
  }${params.hash ? `\nHash: ${params.hash}` : ""}\nNonce: ${
    params.nonce
  }\nTimestamp: ${params.ts}`;

// eslint-disable-next-line no-unused-vars
type SignerFunction = (payload?: any) => Promise<{
  params: Authentication["params"];
  sig: string;
  payload: string;
}>;

export const Signers = {
  EOA:
    (wallet: Wallet, msg = "Please sign this message"): SignerFunction =>
    async (payload = {}) => {
      const stringPayload = JSON.stringify(payload);

      const params = AuthenticationParamsSchema.parse({
        method: AuthMethod.EOA,
        addr: wallet.address,
        msg,
        nonce: randomBytes(32).toString("base64"),
        ts: `${Date.now()}`,
        hash: keccak256(toUtf8Bytes(stringPayload)),
      });

      // To have proper output typing (only EOA variant). Should never throw, as method is hardcoded
      assert(params.method === AuthMethod.EOA);

      const message = recreateMessage(params);

      const sig = await wallet.signMessage(toUtf8Bytes(message));

      return { params, sig, payload: stringPayload };
    },
};

type CallGuildAPIParams<BodySchema extends ZodType<any, any, any>> = {
  url: string;
  queryParams?: Record<string, any>;
  signer?: SignerFunction;
} & (
  | {
      method: "GET";
    }
  | {
      method: "POST" | "PUT" | "DELETE" | "PATCH";
      body?: {
        schema: NonNullable<BodySchema>;
        data: z.infer<BodySchema>;
      };
    }
);

// Couldn't get proper type inference if the type params are on the same function
export const callGuildAPI = async <
  ResponseType,
  BodySchema extends ZodType<any, any, any> = ZodType<any, any, any>,
>(
  params: CallGuildAPIParams<BodySchema>
): Promise<ResponseType> => {
  const queryParamEntries = Object.entries(params.queryParams ?? {})
    .filter(([, value]) => !!value)
    .map(([key, value]) => [key, `${value}`]);

  const url =
    queryParamEntries.length > 0
      ? `${globals.apiBaseUrl}${params.url}?${new URLSearchParams(
          queryParamEntries
        )}`
      : `${globals.apiBaseUrl}${params.url}`;

  let parsedPayload = null;
  if (params.method !== "GET" && !!params.body?.schema && !!params.body?.data) {
    const validationResult = params.body.schema.safeParse(params.body.data);
    if (validationResult.success) {
      parsedPayload = validationResult.data;
    } else {
      throw new GuildSDKValidationError(validationResult.error);
    }
  }

  const authentication = params.signer
    ? await params.signer(parsedPayload)
    : null;

  const response = await fetch(url, {
    method: params.method,
    body:
      params.method === "GET"
        ? undefined
        : JSON.stringify(authentication ?? parsedPayload),
    headers: {
      ...(params.method === "GET" && authentication
        ? {
            [PARAMS_HEADER_NAME]: Buffer.from(
              JSON.stringify(authentication.params)
            ).toString("base64"),
            [SIG_HEADER_NAME]: Buffer.from(
              authentication.sig.slice(2),
              "hex"
            ).toString("base64"),
          }
        : {}),
      ...globals.headers,
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new GuildAPICallFailed(
      url.replace(globals.apiBaseUrl, ""),
      responseBody?.errors?.[0]?.msg ??
        responseBody?.message ??
        "Unexpected Error",
      response.status
    );
  }

  return responseBody;
};
