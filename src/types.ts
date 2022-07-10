import { Bytes } from "ethers/lib/utils";

type GetMembershipsResponse = {
  guildId: number;
  roleids: number[];
}[];

type JoinResponse = {
  success: boolean;
  platformResults: {
    success: boolean;
    platformId: number;
    platformName: string;
    errorMsg?: string;
    invite?: string;
  }[];
};

type GuildPlatformData = {
  guildName: string;
  platformGuildId: string;
  roles: {
    name: string;
    platformRoleId: string;
    [key: string]: string;
  }[];
};

type PlatformGetAllGuilds = GuildPlatformData[];

type PlatformGetGuild = GuildPlatformData;

type PlatformJoinResponse =
  | (GuildPlatformData & { inviteLink?: never })
  | {
      guildName?: never;
      platformGuildId?: never;
      roles?: never;
      inviteLink: string;
    };

type PlatformStatusResponse = (GuildPlatformData & {
  platformGuildName: string;
})[];

type PlatformGetUserAccessesReponse = GuildPlatformData;

type PlatformGetUserMembershipsReponse = GuildPlatformData;

type PlatformGetMembershipsResponse = GuildPlatformData[];

type PlatformLeaveResponse = {
  success: boolean;
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

type GuildsQueryType = { order?: GuildOrderType; search?: string };

type GuildIncludeType = "all" | "admin";

type GuildsByAddressQueryType = GuildsQueryType & {
  include?: GuildIncludeType;
};

type Poap = {
  id: number;
  poapIdentifier: number;
  fancyId: string;
  guildId: number;
  vaultId?: number;
  contract?: string;
  chainId?: number;
  activated: boolean;
  createdAt: string;
  expiryDate?: number;
};

type GetGuildsResponse = {
  id: number;
  name: string;
  imageUrl: string;
  urlName: string;
  hideFromExplorer: boolean;
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

type GetGuildResponse = {
  id: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  showMembers: boolean;
  hideFromExplorer: boolean;
  createdAt: string;
  onboardingComplete: true;
  theme: Theme;
  admins: {
    id: number;
    address: string;
    isOwner: boolean;
  }[];
  poaps: Poap[];
  guildPlatforms: {
    id: number;
    platformId: number;
    platformGuildId: string;
    platformGuildData?: any;
    platformGuildName?: string;
    invite?: string;
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
        minAmount?: number;
        maxAmount?: number;
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
    rolePlatforms: {
      guildPlatformId: number;
      platformRoleId?: string;
      platformRoleData?: { [key: string]: string };
    }[];
    members: string[];
    memberCount: number;
  }[];
};

type GetGuildByIdResponse = GetGuildResponse;

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
        maxAmount: number;
      };
    }
  | {
      type: "ERC20";
      chain: Chain;
      address: string;
      data: {
        minAmount: number;
        maxAmount: number;
      };
    }
  | {
      type: "ERC721" | "ERC1155";
      chain: Chain;
      address: string;
      data: {
        id?: number;
        minAmount: number;
        maxAmount: number;
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
        maxAmount: number;
      };
    }
  | {
      type: "ALLOWLIST";
      data: {
        addresses: string[];
      };
    };

type GuildPlatform = {
  id: number;
  platformName: string;
  platformGuildId: string;
  platformGuildData?: any;
  platformGuildName?: string;
  invite?: string;
};

type Role = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  logic: Logic;
  guildId: number;
  requirements: Requirement[];
  rolePlatforms?: {
    guildPlatformId: number;
    platformRoleId?: string;
    platformRoleData?: { [key: string]: string };
    guildPlatform: GuildPlatform & {
      platform: { id: number; name: string };
    };
  }[];
  members: string[];
};

type CreateGuildParams = {
  name: string;
  urlName?: string;
  imageUrl?: string;
  description?: string;
  admins?: string[];
  showMembers?: boolean;
  hideFromExplorer?: boolean;
  theme?: Theme[];
  guildPlatforms?: {
    platformName: string;
    platformGuildId: string;
    platformGuildData?: any;
  }[];
  roles: {
    name: string;
    description?: string;
    imageUrl?: string;
    logic: Logic;
    activationInterval?: number;
    includeUnauthenticated?: boolean;
    rolePlatforms?: {
      guildPlatformIndex: number;
      platformRoleId?: string;
      platformRoleData?: { [key: string]: string };
    }[];
    requirements: Requirement[];
  }[];
};

type UpdateGuildParams = {
  name?: string;
  imageUrl?: string;
  description?: string;
  theme?: Theme[];
  admins?: string[];
  showMembers?: boolean;
  hideFromExplorer?: boolean;
  onboardingComplete?: boolean;
};

type CreateGuildResponse = {
  id: number;
  name: string;
  urlName: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  showMembers: boolean;
  hideFromExplorer: boolean;
  onboardingComplete: boolean;
};

type UpdateGuildResponse = CreateGuildResponse;

type DeleteGuildResponse = {
  success: boolean;
};

type GuildPlatformResolvable =
  | {
      guildPlatformId: number;
      guildPlatform?: never;
    }
  | {
      guildPlatformId?: never;
      guildPlatform: {
        platformName: string;
        platformGuildId: string;
        platformGuildData?: any;
      };
    };

type RolePlatformParam = {
  platformRoleId?: string;
  platformRoleData?: {
    [key: string]: string;
  };
} & GuildPlatformResolvable;

type CreateRoleParams = {
  guildId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  logic: Logic;
  requirements: Requirement[];
  rolePlatforms?: RolePlatformParam[];
  activationInterval?: number;
  includeUnauthenticated?: boolean;
};

type UpdateRoleParams = {
  name: string;
  imageUrl?: string;
  description?: string;
  logic: Logic;
  rolePlatforms?: RolePlatformParam[];
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
  GetGuildResponse,
  GetGuildByIdResponse,
  GetUserAccessResponse,
  CreateGuildParams,
  UpdateGuildParams,
  CreateGuildResponse,
  UpdateGuildResponse,
  DeleteGuildResponse,
  GetRoleResponse,
  CreateRoleParams,
  UpdateRoleParams,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  ApiError,
  GuildPlatformData,
  PlatformGetAllGuilds,
  PlatformGetGuild,
  PlatformJoinResponse,
  PlatformLeaveResponse,
  PlatformStatusResponse,
  PlatformGetUserAccessesReponse,
  PlatformGetUserMembershipsReponse,
  PlatformGetMembershipsResponse,
  GuildPlatform,
};
