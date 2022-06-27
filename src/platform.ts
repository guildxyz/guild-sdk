/* eslint-disable no-unused-vars */
import axios from "axios";
import { globals } from "./common";
import * as client from "./client";
import {
  ApiError,
  GetGuildResponse,
  PlatformGetUserAccessesReponse,
  PlatformJoinResponse,
  PlatformStatusResponse,
} from "./types";

class Platform {
  readonly platformName: string;

  constructor(platformName: string) {
    this.platformName = platformName;
  }

  guild = {
    ...client.guild,

    // getAllOfPlatform: async (): Promise<PlatformGetAllGuilds> => {
    //   const res = await axios.get(
    //     `${globals.apiBaseUrl}/platform/guild/${this.platformName}`
    //   );
    //   return res.data;
    // },

    get: async (platformGuildId: string): Promise<GetGuildResponse> => {
      const res = await axios.get(
        `${globals.apiBaseUrl}/platform/guild/${this.platformName}/${platformGuildId}`
      );
      if (res.status === 204) {
        return null;
      }
      return res.data;
    },

    getUserAccess: async (
      platformGuildId: string,
      platformUserId: string
    ): Promise<PlatformGetUserAccessesReponse> => {
      const res = await axios.get(
        `${globals.apiBaseUrl}/platform/guild/accesses/${this.platformName}/${platformGuildId}/${platformUserId}`
      );
      return res.data;
    },

    // getUserMemberships: async (
    //   platformGuildId: string,
    //   platformUserId: string
    // ): Promise<PlatformGetUserMembershipsReponse> => {
    //   const res = await axios.get(
    //     `${globals.apiBaseUrl}/platform/guild/member/${this.platformName}/${platformGuildId}/${platformUserId}`
    //   );
    //   return res.data;
    // },
  };

  user = {
    ...client.user,

    join: async (
      platformGuildId: string,
      platformUserId: string
    ): Promise<PlatformJoinResponse> => {
      try {
        const body = {
          platformName: this.platformName,
          platformGuildId,
          platformUserId,
        };
        const res = await axios.post(
          `${globals.apiBaseUrl}/platform/user/join`,
          body,
          {
            headers: globals.headers,
          }
        );
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.data.errors) {
          throw new ApiError(error.response.data.errors);
        } else {
          throw error;
        }
      }
    },

    // leave: async (
    //   platformGuildId: string,
    //   platformUserId: string
    // ): Promise<PlatformLeaveResponse> => {
    //   try {
    //     const body = {
    //       platformName: this.platformName,
    //       platformGuildId,
    //       platformUserId,
    //     };
    //     const res = await axios.post(
    //       `${globals.apiBaseUrl}/platform/user/leave`,
    //       body,
    //       {
    //         headers: globals.headers,
    //       }
    //     );
    //     return res.data;
    //   } catch (error) {
    //     if (axios.isAxiosError(error) && error.response.data.errors) {
    //       throw new ApiError(error.response.data.errors);
    //     } else {
    //       throw error;
    //     }
    //   }
    // },

    status: async (
      platformGuildId: string,
      platformUserId: string
    ): Promise<PlatformStatusResponse> => {
      try {
        const body = {
          platformName: this.platformName,
          platformGuildId,
          platformUserId,
        };
        const res = await axios.post(
          `${globals.apiBaseUrl}/platform/user/status`,
          body,
          {
            headers: globals.headers,
          }
        );
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.data.errors) {
          throw new ApiError(error.response.data.errors);
        } else {
          throw error;
        }
      }
    },

    //   getMemberships: async (
    //     platformUserId: string
    //   ): Promise<PlatformGetMembershipsResponse> => {
    //     try {
    //       const res = await axios.get(
    //         `${globals.apiBaseUrl}/platform/user/membership/${this.platformName}/${platformUserId}`
    //       );
    //       return res.data;
    //     } catch (error) {
    //       if (axios.isAxiosError(error) && error.response.data.errors) {
    //         throw new ApiError(error.response.data.errors);
    //       } else {
    //         throw error;
    //       }
    //     }
    //   },
  };

  role = client.role;
}

// eslint-disable-next-line import/prefer-default-export
export { Platform };
