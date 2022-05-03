import axios from "axios";
import { API_BASE_URL, headers } from "./common";
import * as client from "./client";
import {
  ApiError,
  PlatformConnectResponse,
  PlatformGetAllGuilds,
  PlatformGetGuild,
  PlatformGetMembershipsResponse,
  PlatformGetUserMembershipsReponse,
  PlatformJoinResponse,
  PlatformLeaveResponse,
  PlatformStatusResponse,
} from "./types";

class Platform {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  guild = {
    ...client.guild,

    async getAllOfPlatform(): Promise<PlatformGetAllGuilds> {
      const res = await axios.get(
        `${API_BASE_URL}/platform/guild/${Platform.name}`
      );
      return res.data;
    },

    async get(platformSpecificGuildId: string): Promise<PlatformGetGuild> {
      const res = await axios.get(
        `${API_BASE_URL}/platform/guild/${Platform.name}/${platformSpecificGuildId}`
      );
      if (res.status === 204) {
        return null;
      }
      return res.data;
    },

    async getUserAccess(
      platformSpecificGuildId: string,
      platformUserId: string
    ): Promise<PlatformStatusResponse> {
      const res = await axios.get(
        `${API_BASE_URL}/platform/guild/accesses/${Platform.name}/${platformSpecificGuildId}/${platformUserId}`
      );
      return res.data;
    },

    async getUserMemberships(
      platformSpecificGuildId: string,
      platformUserId: string
    ): Promise<PlatformGetUserMembershipsReponse> {
      const res = await axios.get(
        `${API_BASE_URL}/platform/guild/member/${Platform.name}/${platformSpecificGuildId}/${platformUserId}`
      );
      return res.data;
    },
  };

  user = {
    ...client.user,

    async connect(platformUserId: string): Promise<PlatformConnectResponse> {
      try {
        const body = {
          platformUserId,
        };
        const res = await axios.post(
          `${API_BASE_URL}/platform/user/connect`,
          body,
          {
            headers,
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

    async join(
      platformSpecificGuildId: string,
      platformUserId: string
    ): Promise<PlatformJoinResponse> {
      try {
        const body = {
          platformName: Platform.name,
          platformSpecificGuildId,
          platformUserId,
        };
        const res = await axios.post(
          `${API_BASE_URL}/platform/user/join`,
          body,
          {
            headers,
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

    async leave(
      platformSpecificGuildId: string,
      platformUserId: string
    ): Promise<PlatformLeaveResponse> {
      try {
        const body = {
          platformName: Platform.name,
          platformSpecificGuildId,
          platformUserId,
        };
        const res = await axios.post(
          `${API_BASE_URL}/platform/user/leave`,
          body,
          {
            headers,
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

    async status(
      platformSpecificGuildId: string,
      platformUserId: string
    ): Promise<PlatformStatusResponse> {
      try {
        const body = {
          platformName: Platform.name,
          platformSpecificGuildId,
          platformUserId,
        };
        const res = await axios.post(
          `${API_BASE_URL}/platform/user/status`,
          body,
          {
            headers,
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

    async getMemberships(
      platformUserId: string
    ): Promise<PlatformGetMembershipsResponse> {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/platform/user/membership/${Platform.name}/${platformUserId}`
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
  };

  role = client.role;
}

// eslint-disable-next-line import/prefer-default-export
export { Platform };
