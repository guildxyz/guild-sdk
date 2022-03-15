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

export { GetMembershipsResponse, JoinResponse, RequestWithAuth };
