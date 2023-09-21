import axios from "axios";
import { globals } from "./common";

// eslint-disable-next-line no-unused-vars
const prepareBodyWithSign = (_: any, __: any, ___: any) => null

const user = {
  async getMemberships(
    address: string
  ): Promise<any | null> {
    try {
      const res = await axios.get(
        `${globals.apiBaseUrl}/user/membership/${address}`,
        { headers: globals.headers }
      );
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async join(
    guildId: number,
    signerAddress: string,
    sign: any,
    platforms?: {
      name: string;
      authData: { [key: string]: string };
    }[]
  ): Promise<any> {
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
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

const guild = {
  async getAll(query: any = {}): Promise<any> {
    const queryParams: any = {};
    if (query.order) queryParams.order = query.order;
    if (query.search) queryParams.search = query.search;
    const searchParams = new URLSearchParams(queryParams).toString();

    const res = await axios.get(`${globals.apiBaseUrl}/guild?${searchParams}`, {
      headers: globals.headers,
    });
    return res?.data;
  },

  async get(id: number | string): Promise<any> {
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
  ): Promise<any> {
    const res = await axios.get(
      `${globals.apiBaseUrl}/guild/access/${guildId}/${address}`,
      { headers: globals.headers }
    );
    return res?.data;
  },

  // Ez access check?
  async getUserMemberships(
    guildId: number,
    address: string
  ): Promise<any> {
    const res = await axios.get(
      `${globals.apiBaseUrl}/guild/member/${guildId}/${address}`,
      { headers: globals.headers }
    );
    return res?.data;
  },

  async create(
    signerAddress: string,
    sign: any,
    params: any
  ): Promise<any> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${globals.apiBaseUrl}/guild`, body, {
        headers: globals.headers,
      });
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async update(
    id: number | string,
    signerAddress: string,
    sign: any,
    params: any
  ): Promise<any> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${globals.apiBaseUrl}/guild/${id}`, body, {
        headers: globals.headers,
      });
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(
    id: number,
    signerAddress: string,
    sign: any,
    removePlatformAccess: boolean = false
  ): Promise<any> {
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
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

const role = {
  async get(id: number): Promise<any> {
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
    sign: any,
    params: any
  ): Promise<any> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${globals.apiBaseUrl}/role`, body, {
        headers: globals.headers,
      });
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async update(
    id: number,
    signerAddress: string,
    sign: any,
    params: any
  ): Promise<any> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${globals.apiBaseUrl}/role/${id}`, body, {
        headers: globals.headers,
      });
      return res?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(
    id: number,
    signerAddress: string,
    sign: any,
    removePlatformAccess: boolean = false
  ): Promise<any> {
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
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        throw new Error(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

export { user, guild, role };
