import {
  MembershipResult,
  PlatformName,
  PublicUserProfile,
  User,
  UserProfile,
} from "@guildxyz/types";
import { SignerFunction, callGuildAPI } from "../utils";
import platformUser from "./platformUser";
import userAddress from "./userAddress";

const user = {
  platform: platformUser,

  address: userAddress,

  get: (userIdOrAddress: string | number) =>
    callGuildAPI<User>({
      url: `/users/${userIdOrAddress}`,
      method: "GET",
    }),

  getProfile: <Sig extends SignerFunction | "_" = "_">(
    userIdOrAddress: string | number,
    signer?: Sig
  ) =>
    callGuildAPI<Sig extends "_" ? PublicUserProfile : UserProfile>({
      url: `/users/${userIdOrAddress}/profile`,
      method: "GET",
      signer: typeof signer === "string" ? undefined : signer,
    }),

  getMemberships: (userIdOrAddress: string | number, signer?: SignerFunction) =>
    callGuildAPI<MembershipResult[]>({
      url: `/users/${userIdOrAddress}/memberships`,
      method: "GET",
      signer,
    }),

  delete: (userIdOrAddress: string | number, signer: SignerFunction) =>
    callGuildAPI<void>({
      url: `/users/${userIdOrAddress}`,
      method: "DELETE",
      signer,
    }),

  listGateables: (
    userIdOrAddress: string | number,
    platformName: PlatformName,
    signer: SignerFunction
  ) =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platforms/${platformName}/gateables`,
      method: "GET",
      signer,
    }),

  verifyKey: (
    userIdOrAddress: string | number,
    { pubKey, reCaptchaToken }: { reCaptchaToken?: string; pubKey: string },
    signer: SignerFunction
  ) =>
    callGuildAPI<UserProfile>({
      url: `/users/${userIdOrAddress}/public-key`,
      method: "POST",
      body: {
        schema: "VerifyKeyPayloadSchena",
        data: {
          pubKey,
          verificationParams: reCaptchaToken
            ? { reCaptcha: reCaptchaToken }
            : undefined,
        },
      },
      signer,
    }),

  /**
   * Revokes the prevoiusly registered session key. Once it is revoked it can't be used to sign messages on behalf of the user.
   * @param userIdOrAddress User ID or address of the user
   * @param signer The key which is about to be revoked, can't be used. The user has to sign with it's own wallet
   */
  revokeKey: (userIdOrAddress: string | number, signer: SignerFunction) =>
    callGuildAPI<void>({
      url: `/users/${userIdOrAddress}/public-key`,
      method: "DELETE",
      signer,
    }),
};

export default user;
