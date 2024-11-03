import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  apis: {
    solanaRpc: string;
    solanaTrackerApiKey: string;
    solscanApiKey: string;
  };
  tokens: {
    sobaAddress: string;
    burnWallet: string;
  };
  cache: {
    ttl: number;
  };
}

export const config: Config = {
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MONGODB_URI || '',
  apis: {
    solanaRpc: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    solanaTrackerApiKey: process.env.SOLANA_TRACKER_API_KEY || '',
    solscanApiKey: process.env.SOLSCAN_API_KEY || ''
  },
  tokens: {
    sobaAddress: process.env.SOBA_TOKEN_ADDRESS || '',
    burnWallet: process.env.SOBA_BURN_WALLET || ''
  },
  cache: {
    ttl: 5 * 60 // 5 minutes
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'SOLANA_RPC_URL',
  'SOLSCAN_API_KEY',
  'SOBA_TOKEN_ADDRESS',
  'SOBA_BURN_WALLET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}); 