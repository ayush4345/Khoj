export const huntABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_huntId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "addWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startsAt",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_clues_blobId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_answers_blobId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_teamsEnabled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_maxTeamSize",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_theme",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nftMetadataURI",
        type: "string",
      },
    ],
    name: "createHunt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftContractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "huntId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startsAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "HuntCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "huntId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endedAt",
        type: "uint256",
      },
    ],
    name: "HuntEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "huntId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
    ],
    name: "HuntStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "huntId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NFTAwarded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_huntId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "registerForHunt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllHunts",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "participantCount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "clues_blobId",
            type: "string",
          },
          {
            internalType: "string",
            name: "answers_blobId",
            type: "string",
          },
          {
            internalType: "bool",
            name: "teamsEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "maxTeamSize",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "theme",
            type: "string",
          },
          {
            internalType: "string",
            name: "nftMetadataURI",
            type: "string",
          },
        ],
        internalType: "struct ETHunt.HuntInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_huntId",
        type: "uint256",
      },
    ],
    name: "getHunt",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noOfParticipants",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "winners",
        type: "address[]",
      },
      {
        internalType: "string",
        name: "clues_blobId",
        type: "string",
      },
      {
        internalType: "string",
        name: "answers_blobId",
        type: "string",
      },
      {
        internalType: "bool",
        name: "teamsEnabled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "maxTeamSize",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "theme",
        type: "string",
      },
      {
        internalType: "string",
        name: "nftMetadataURI",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_huntId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "getTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hunts",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startsAt",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "clues_blobId",
        type: "string",
      },
      {
        internalType: "string",
        name: "answers_blobId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noOfParticipants",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nftContract",
    outputs: [
      {
        internalType: "contract ETHuntNFT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
