import axios from "axios";
import { ethers } from "ethers";
import prepareRequest from "./auth";
import { API_BASE_URL } from "./common";
import {
  GetAllGuildsResponse,
  GetGuildByIdResponse,
  GetMembershipsResponse,
  GetUserAccessResponse,
  JoinResponse,
} from "./types";

const user = {
  async getMemberships(
    address: string
  ): Promise<GetMembershipsResponse | null> {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/membership/${address}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return null;
      }
      throw error;
    }
  },

  async join(wallet: ethers.Wallet, guildId: number): Promise<JoinResponse> {
    try {
      const body = await prepareRequest(wallet, { guildId });
      const res = await axios.post(`${API_BASE_URL}/user/join/`, body, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (error: any) {
      return null;
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
};

export default {
  user,
  guild,
};
