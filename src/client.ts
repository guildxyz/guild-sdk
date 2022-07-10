import axios from "axios";
import { prepareBodyWithSign } from "./auth";
import { globals } from "./common";
import {
  ApiError,
  CreateGuildParams,
  CreateGuildResponse,
  CreateRoleParams,
  CreateRoleResponse,
  DeleteGuildResponse,
  DeleteRoleResponse,
  GetGuildsResponse,
  GetGuildByIdResponse,
  GetMembershipsResponse,
  GetRoleResponse,
  GetUserAccessResponse,
  JoinResponse,
  SignerFunction,
  UpdateGuildParams,
  UpdateRoleParams,
  UpdateRoleResponse,
  GuildsQueryType,
  GuildsByAddressQueryType,
  UpdateGuildResponse,
} from "./types";

const user = {
  async getMemberships(
    address: string
  ): Promise<GetMembershipsResponse | null> {
    try {
      const res = await axios.get(
        `${globals.apiBaseUrl}/user/membership/${address}`,
        { headers: globals.headers }
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

  async join(
    guildId: number,
    signerAddress: string,
    sign: SignerFunction,
    platforms?: {
      name: string;
      authData: { [key: string]: string };
    }[]
  ): Promise<JoinResponse> {
    try {
      const body = await prepareBodyWithSign(signerAddress, sign, {
        guildId,
        platforms,
      });
      const res = await axios.post(`${globals.apiBaseUrl}/user/join/`, body, {
        headers: globals.headers,
      });
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

const guild = {
  async getAll(query: GuildsQueryType = {}): Promise<GetGuildsResponse> {
    const queryParams: GuildsQueryType = {};
    if (query.order) queryParams.order = query.order;
    if (query.search) queryParams.search = query.search;
    const searchParams = new URLSearchParams(queryParams).toString();

    const res = await axios.get(`${globals.apiBaseUrl}/guild?${searchParams}`, {
      headers: globals.headers,
    });
    return res?.data;
  },

  async getByAddress(
    address: string,
    query: GuildsByAddressQueryType = {}
  ): Promise<GetGuildsResponse> {
    const queryParams: GuildsByAddressQueryType = {};
    if (query.order) queryParams.order = query.order;
    if (query.search) queryParams.search = query.search;
    queryParams.include = query.include ?? "all";
    const searchParams = new URLSearchParams(queryParams).toString();

    const res = await axios.get(
      `${globals.apiBaseUrl}/guild/address/${address}?${searchParams}`,
      { headers: globals.headers }
    );
    return res?.data;
  },

  async get(id: number | string): Promise<GetGuildByIdResponse> {
    const res = await axios.get(`${globals.apiBaseUrl}/guild/${id}`, {
      headers: globals.headers,
    });
    if (res.status === 204) {
      return null;
    }
    return res?.data;
  },

  async getUserAccess(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${globals.apiBaseUrl}/guild/access/${guildId}/${address}`,
      { headers: globals.headers }
    );
    return res?.data;
  },

  async getUserMemberships(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${globals.apiBaseUrl}/guild/member/${guildId}/${address}`,
      { headers: globals.headers }
    );
    return res?.data;
  },

  async create(
    signerAddress: string,
    sign: SignerFunction,
    params: CreateGuildParams
  ): Promise<CreateGuildResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${globals.apiBaseUrl}/guild`, body, {
        headers: globals.headers,
      });
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async update(
    id: number | string,
    signerAddress: string,
    sign: SignerFunction,
    params: UpdateGuildParams
  ): Promise<UpdateGuildResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${globals.apiBaseUrl}/guild/${id}`, body, {
        headers: globals.headers,
      });
      return res?.data;
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
    signerAddress: string,
    sign: SignerFunction,
    removePlatformAccess: boolean = false
  ): Promise<DeleteGuildResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, {
      removePlatformAccess,
    });
    try {
      const res = await axios.delete(`${globals.apiBaseUrl}/guild/${id}`, {
        data: body,
        headers: globals.headers,
      });
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

const role = {
  async get(id: number): Promise<GetRoleResponse> {
    const res = await axios.get(`${globals.apiBaseUrl}/role/${id}`, {
      headers: globals.headers,
    });
    if (res.status === 204) {
      return null;
    }
    return res?.data;
  },

  async create(
    signerAddress: string,
    sign: SignerFunction,
    params: CreateRoleParams
  ): Promise<CreateRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${globals.apiBaseUrl}/role`, body, {
        headers: globals.headers,
      });
      return res?.data;
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
    signerAddress: string,
    sign: SignerFunction,
    params: UpdateRoleParams
  ): Promise<UpdateRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${globals.apiBaseUrl}/role/${id}`, body, {
        headers: globals.headers,
      });
      return res?.data;
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
    signerAddress: string,
    sign: SignerFunction,
    removePlatformAccess: boolean = false
  ): Promise<DeleteRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, {
      removePlatformAccess,
    });
    try {
      const res = await axios.delete(`${globals.apiBaseUrl}/role/${id}`, {
        data: body,
        headers: globals.headers,
      });
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

export { user, guild, role };
