import {
  UserAddressCreationPayloadSchema,
  UserAddressUpdatePayloadSchema,
  type types,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const userAddress = {
  get: (
    userIdOrAddress: string | number,
    address: string,
    signer: SignerFunction
  ): Promise<types.UserAddress> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/addresses/${address}`,
      method: "GET",
      signer,
    }),

  getAll: (
    userIdOrAddress: string | number,
    signer: SignerFunction
  ): Promise<types.UserAddress[]> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/addresses`,
      method: "GET",
      signer,
    }),

  create: async (
    userIdOrAddress: string | number,
    signerOfNewAddress: SignerFunction,
    signer: SignerFunction
  ): Promise<types.UserAddress> => {
    const { params, sig } = await signerOfNewAddress(
      {},
      (p) => `Address: ${p.addr}\nNonce: ${p.nonce}\n Timestamp: ${p.ts}`
    );

    return callGuildAPI({
      url: `/users/${userIdOrAddress}/addresses`,
      method: "POST",
      body: {
        schema: UserAddressCreationPayloadSchema,
        data: {
          address: params.addr,
          signature: sig,
          nonce: params.nonce,
          timestamp: +params.ts,
        },
      },
      signer,
    });
  },

  update: (
    userIdOrAddress: string | number,
    address: string,
    addressUpdateParams: types.Schemas["UserAddressUpdatePayload"],
    signer: SignerFunction
  ): Promise<types.UserAddress> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/addresses/${address}`,
      method: "PUT",
      body: {
        schema: UserAddressUpdatePayloadSchema,
        data: addressUpdateParams,
      },
      signer,
    }),

  delete: (
    userIdOrAddress: string | number,
    address: string,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/addresses/${address}`,
      method: "DELETE",
      signer,
    }),
};

export type UserAddressClient = typeof userAddress;
export default userAddress;
