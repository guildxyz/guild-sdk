import type {
  MembershipResult,
  PlatformName,
  PublicUserProfile,
  User,
  UserProfile,
} from "@guildxyz/types";
import { callGuildAPI, type SignerFunction } from "../utils";

const user = {
  get: (userIdOrAddress: string | number): Promise<User> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}`,
      method: "GET",
    }),

  getProfile: <Sig extends SignerFunction | "_" = "_">(
    userIdOrAddress: string | number,
    signer?: Sig
  ): Promise<Sig extends "_" ? PublicUserProfile : UserProfile> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/profile`,
      method: "GET",
      signer: typeof signer === "string" ? undefined : signer,
    }),

  getMemberships: (
    userIdOrAddress: string | number,
    signer?: SignerFunction
  ): Promise<MembershipResult[]> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/memberships`,
      method: "GET",
      signer,
    }),

  delete: (
    userIdOrAddress: string | number,
    signer: SignerFunction
  ): Promise<void> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}`,
      method: "DELETE",
      signer,
    }),

  listGateables: (
    userIdOrAddress: string | number,
    platformName: PlatformName,
    signer: SignerFunction
  ): Promise<any> =>
    callGuildAPI({
      url: `/users/${userIdOrAddress}/platforms/${platformName}/gateables`,
      method: "GET",
      signer,
    }),
};

export default user;
