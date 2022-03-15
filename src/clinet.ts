import axios from "axios";
import { ethers } from "ethers";
import prepareRequest from "./auth";
import { API_BASE_URL } from "./common";
import { GetMembershipsResponse, JoinResponse } from "./types";

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

export default {
  user,
};
