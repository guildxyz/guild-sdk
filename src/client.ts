import axios from "axios";
import { ethers } from "ethers";
import prepareRequest from "./auth";
import { API_BASE_URL } from "./common";
import {
  ApiError,
  CreateGuildParams,
  CreateGuildResponse,
  CreateRoleParams,
  CreateRoleResponse,
  DeleteGuildResponse,
  DeleteRoleResponse,
  GetAllGuildsResponse,
  GetGuildByIdResponse,
  GetMembershipsResponse,
  GetRoleResponse,
  GetUserAccessResponse,
  JoinResponse,
  UpdateGuildParams,
  UpdateRoleResponse,
} from "./types";

const headers = { "Content-Type": "application/json" };

const user = {
  async getMemberships(
    address: string
  ): Promise<GetMembershipsResponse | null> {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/membership/${address}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async join(guildId: number, wallet: ethers.Wallet): Promise<JoinResponse> {
    try {
      const body = await prepareRequest(wallet, { guildId });
      const res = await axios.post(`${API_BASE_URL}/user/join/`, body, {
        headers,
      });
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

const guild = {
  async getAll(): Promise<GetAllGuildsResponse> {
    const res = await axios.get(`${API_BASE_URL}/guild`);
    return res.data;
  },

  async get(id: number | string): Promise<GetGuildByIdResponse> {
    const res = await axios.get(`${API_BASE_URL}/guild/${id}`);
    return res.data;
  },

  async getUserAccess(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${API_BASE_URL}/guild/access/${guildId}/${address}`
    );
    return res.data;
  },

  async getUserCurrentAccess(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${API_BASE_URL}/guild/member/${guildId}/${address}`
    );
    return res.data;
  },

  async create(
    params: CreateGuildParams,
    wallet: ethers.Wallet
  ): Promise<CreateGuildResponse> {
    const body = await prepareRequest(wallet, params);
    try {
      const res = await axios.post(`${API_BASE_URL}/guild`, body, { headers });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  // TODO id string (urlName) ?
  async update(id: number, params: UpdateGuildParams, wallet: ethers.Wallet) {
    const body = await prepareRequest(wallet, params);
    try {
      const res = await axios.patch(`${API_BASE_URL}/guild/${id}`, body, {
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(
    id: number,
    wallet: ethers.Wallet
  ): Promise<DeleteGuildResponse> {
    const body = await prepareRequest(wallet);
    try {
      const res = await axios.delete(`${API_BASE_URL}/guild/${id}`, {
        data: body,
        headers,
      });
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

const role = {
  async get(id: number): Promise<GetRoleResponse> {
    const res = await axios.get(`${API_BASE_URL}/role/${id}`);
    return res.data;
  },

  async create(
    params: CreateRoleParams,
    wallet: ethers.Wallet
  ): Promise<CreateRoleResponse> {
    const body = prepareRequest(wallet, params);
    try {
      const res = await axios.post(`${API_BASE_URL}/role`, body, { headers });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async update(
    id: number,
    params: UpdateGuildParams,
    wallet: ethers.Wallet
  ): Promise<UpdateRoleResponse> {
    const body = prepareRequest(wallet, params);
    try {
      const res = await axios.patch(`${API_BASE_URL}/role/${id}`, body, {
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(id: number, wallet: ethers.Wallet): Promise<DeleteRoleResponse> {
    const body = prepareRequest(wallet);
    try {
      const res = await axios.delete(`${API_BASE_URL}/role/${id}`, {
        data: body,
        headers,
      });
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

export default {
  user,
  guild,
  role,
};
