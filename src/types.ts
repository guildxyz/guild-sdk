import { Bytes } from "ethers/lib/utils";

type GetMembershipsResponse = {
  guildId: number;
  roleids: number[];
}[];

type JoinResponse = {
  alreadyJoined: boolean;
  inviteLink?: string;
};

type Validation = {
  addressSignedMessage: string;
  address: string;
  nonce: string;
  random: string;
  hash: string;
  timestamp: string;
};

type PreparedBody = {
  payload: object;
  validation: Validation;
};

// eslint-disable-next-line no-unused-vars
type SignerFunction = (signableMessage: string | Bytes) => Promise<string>;

type GuildOrderType = "members" | "name" | "oldest" | "newest";

type GuildsQueryType = { order?: GuildOrderType, search?: string }

type GuildIncludeType = "all" | "admin";

type GuildsByAddressQueryType = GuildsQueryType & { include?: GuildIncludeType }

type GetGuildsResponse = {
  id: number;
  name: string;
  imageUrl: string;
  urlName: string;
  roles: string[];
  memberCount: number;
}[];

type Theme = {
  mode: "DARK" | "LIGHT";
  color?: any;
  backgroundImage?: string;
  backgroundCss?: any;
};

type Chain =
  | "ETHEREUM"
  | "BSC"
  | "POLYGON"
  | "XDAI"
  | "AVALANCHE"
  | "FANTOM"
  | "ARBITRUM"
  | "CELO"
  | "HARMONY"
  | "JUICEBOX"
  | "GOERLI"
  | "OPTIMISM"
  | "MOONRIVER"
  | "GNOSIS";

type Logic = "AND" | "OR" | "NAND" | "NOR";

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
  roles: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    logic: Logic;
    requirements: {
      id: number;
      type: string;
      address: string;
      chain: Chain;
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
    }[];
    platforms: {
      roleId: number;
      platformId: number;
      inviteChannel: string;
      discordRoleId: string;
    }[];
    members: string[];
    memberCount: number;
  }[];
  owner: {
    id: number;
    address: string;
  };
};

type GetUserAccessResponse = {
  roleId: number;
  access: boolean;
}[];

type Requirement =
  | { type: "FREE" }
  | {
      type: "COIN";
      chain: Chain;
      data: {
        minAmount: number;
      };
    }
  | {
      type: "ERC20";
      chain: Chain;
      address: string;
      data: {
        minAmount: number;
      };
    }
  | {
      type: "ERC721" | "ERC1155";
      chain: Chain;
      address: string;
      data: {
        id?: number;
        minAmount: number;
        attribute?:
          | {
              trait_type: string;
              value: string;
            }
          | {
              trait_type: string;
              interval: { min: number; max: number };
            };
      };
    }
  | {
      type: "POAP";
      data: {
        id: string;
      };
    }
  | {
      type: "MIRROR";
      chain: Chain;
      address: string;
      data: {
        id: number;
      };
    }
  | {
      type: "SNAPSHOT";
      chain: Chain;
      data: {
        startegy: object;
      };
    }
  | {
      type: "JUICEBOX";
      chain: Chain;
      data: {
        id: number;
        minAmount: number;
      };
    }
  | {
      type: "ALLOWLIST";
      data: {
        addresses: string[];
      };
    };

type Role = {
  name: string;
  imageUrl?: string;
  description?: string;
  logic: Logic;
  requirements: Requirement[];
};

type CreateGuildParams = {
  name: string;
  imageUrl?: string;
  description?: string;
  roles: Role[];
  theme?: Theme[];
  showMembers?: boolean;
};

type UpdateGuildParams = {
  name?: string;
  imageUrl?: string;
  description?: string;
  roles?: Role[];
  theme?: Theme[];
  showMembers?: boolean;
};

type CreateGuildResponse = {
  id: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  showMembers: boolean;
};

type DeleteGuildResponse = {
  success: boolean;
};

type PlatformInfo = {
  platform?: "TELEGRAM" | "DISCORD",
  platformId?: string
}

type CreateRoleParams = Role & PlatformInfo & { guildId: number };

type UpdateRoleParams = {
  name: string;
  imageUrl?: string;
  description?: string;
  logic: Logic;
  requirements: Requirement[];
};

type GetRoleResponse = Role & { id: number };
type CreateRoleResponse = Role & { id: number };
type UpdateRoleResponse = Role & { id: number };
type DeleteRoleResponse = {
  success: boolean;
};

type ErrorItem = {
  msg: string;
  value?: any;
  param?: string;
  location?: string;
};

class ApiError extends Error {
  errors: ErrorItem[];

  constructor(errors: ErrorItem[]) {
    super(errors[0].msg);
    this.errors = errors;
  }
}

export {
  Chain,
  Requirement,
  GetMembershipsResponse,
  JoinResponse,
  Validation,
  PreparedBody,
  SignerFunction,
  GuildOrderType,
  GuildsQueryType,
  GuildIncludeType,
  GuildsByAddressQueryType,
  GetGuildsResponse,
  GetGuildByIdResponse,
  GetUserAccessResponse,
  CreateGuildParams,
  UpdateGuildParams,
  CreateGuildResponse,
  DeleteGuildResponse,
  GetRoleResponse,
  CreateRoleParams,
  UpdateRoleParams,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  ApiError,
};
