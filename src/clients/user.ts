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
};

export default user;
