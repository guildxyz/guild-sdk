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

    get: async (platformGuildId: string): Promise<GetGuildResponse> => {
      const res = await axios.get(
        `${globals.apiBaseUrl}/platform/guild/${this.platformName}/${platformGuildId}`,
        { headers: globals.headers }
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
        `${globals.apiBaseUrl}/platform/guild/access/${this.platformName}/${platformGuildId}/${platformUserId}`,
        { headers: globals.headers }
      );
      return res.data;
    },
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
        return res?.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.data.errors) {
          throw new ApiError(error.response.data.errors);
        } else {
          throw error;
        }
      }
    },

    status: async (platformUserId: string): Promise<PlatformStatusResponse> => {
      try {
        const body = {
          platformName: this.platformName,
          platformUserId,
        };
        const res = await axios.post(
          `${globals.apiBaseUrl}/platform/user/status`,
          body,
          {
            headers: globals.headers,
          }
        );
        return res?.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.data.errors) {
          throw new ApiError(error.response.data.errors);
        } else {
          throw error;
        }
      }
    },
  };

  role = client.role;
}

// eslint-disable-next-line import/prefer-default-export
export { Platform };
