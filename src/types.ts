type GetMembershipsResponse = {
  guildId: number;
  roleids: number[];
}[];

type JoinResponse = {
  alreadyJoined: boolean;
  inviteLink?: string;
};

type RequestWithAuth<T> = {
  payload: T;
  validation: {
    address: string;
    addressSignedMessage: string;
    nonce: string;
    random: string;
    hash: string;
    timestamp: string;
  };
};

type GetAllGuildsResponse = {
  id: number;
  name: string;
  imageUrl: string;
  urlName: string;
  roles: string[];
  memberCount: number;
}[];

type Theme = {
  mode: string;
  color?: any;
  backgroundImage: string;
  backgroundCss?: any;
};

type Requirement = {
  id: number;
  type: string;
  address: string;
  chain: string;
  roleId: number;
  name: string;
  symbol: string;
  data: {
    id?: string;
    amount?: number;
    strategy?: { name: string; params: any };
    addresses?: string[];
    attribute?: {
      trait_type: string;
      value?: string;
      interval?: {
        min: number;
        max: number;
      };
    };
  };
};

type Role = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  logic: string;
  requirements: Requirement[];
  platforms: {
    roleId: number;
    platformId: number;
    inviteChannel: string;
    discordRoleId: string;
  }[];
  members: string[];
  memberCount: number;
};

type GetGuildByIdResponse = {
  id: number;
  ownerId: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  showMembers: boolean;
  theme: Theme;
  platforms: {
    id: number;
    platformId: string;
    type: string;
    platformName: string;
  }[];
  roles: Role[];
  owner: {
    id: number;
    address: string;
  };
};

type GetUserAccessResponse = {
  roleId: number;
  access: boolean;
}[];

export {
  GetMembershipsResponse,
  JoinResponse,
  RequestWithAuth,
  GetAllGuildsResponse,
  GetGuildByIdResponse,
  GetUserAccessResponse,
};
