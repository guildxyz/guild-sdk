import { Authentication, consts, schemas } from "@guildxyz/types";
import assert from "assert";
import { randomBytes, webcrypto } from "crypto";
import { BytesLike, SigningKey, Wallet, keccak256, toUtf8Bytes } from "ethers";
import type { z } from "zod";
import { globals } from "./common";
import { GuildAPICallFailed, GuildSDKValidationError } from "./error";

export const recreateMessage = (params: Authentication["params"]) =>
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
  getMessage?: (params: Authentication["params"]) => string
) => Promise<{
  params: Authentication["params"];
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

  fromWebcryptoEdcsaPrivateKey:
    (
      privateKey: webcrypto.CryptoKey,
      address: string,
      { msg = "Please sign this message" }: SignerOptions = {}
    ): SignerFunction =>
    async (payload = {}, getMessage = recreateMessage) => {
      const stringPayload = JSON.stringify(payload);

      const params = schemas.AuthenticationParamsSchema.parse({
        method: consts.AuthMethod.KeyPair,
        addr: address,
        msg,
        nonce: randomBytes(32).toString("base64"),
        ts: `${Date.now()}`,
        hash: keccak256(toUtf8Bytes(stringPayload)),
      });

      const sig = await webcrypto.subtle
        .sign(
          { name: "ECDSA", hash: "SHA-512" },
          privateKey,
          Buffer.from(getMessage(params).replace(/\n/g, ""))
        )
        .then((signature) => Buffer.from(signature).toString("hex"));

      return { params, sig, payload: stringPayload };
    },
};

type SchemasImportType = (typeof import("@guildxyz/types"))["schemas"];
type SchemaNames = keyof SchemasImportType;
type MappedSchemas = {
  [Schema in SchemaNames]: {
    schema: Schema;
    data: z.infer<SchemasImportType[Schema]>;
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

  const url =
    queryParamEntries.length > 0
      ? `${globals.apiBaseUrl}${params.url}?${new URLSearchParams(
          queryParamEntries
        )}`
      : `${globals.apiBaseUrl}${params.url}`;

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
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new GuildAPICallFailed(
      url.replace(globals.apiBaseUrl, ""),
      responseBody?.errors?.[0]?.msg ??
        responseBody?.message ??
        "Unexpected Error",
      response.status,
      response.headers.get("x-correlation-id") ?? ""
    );
  }

  return responseBody;
};
