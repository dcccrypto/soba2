import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export class SolanaError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: any
  ) {
    super(message);
    this.name = 'SolanaError';
  }
}

export class SolanaService {
  private connection: Connection;
  private sobaTokenAddress: PublicKey;
  private burnWalletAddress: PublicKey;

  constructor() {
    try {
      this.connection = new Connection(config.apis.solanaRpc, 'confirmed');
      this.sobaTokenAddress = new PublicKey(config.tokens.sobaAddress);
      this.burnWalletAddress = new PublicKey(config.tokens.burnWallet);
      
      logger.info('SolanaService initialized', {
        rpc: config.apis.solanaRpc,
        tokenAddress: config.tokens.sobaAddress,
        burnWallet: config.tokens.burnWallet
      });
    } catch (error) {
      logger.error('Failed to initialize SolanaService:', error);
      throw new SolanaError(
        'Failed to initialize Solana service',
        500,
        error
      );
    }
  }

  async getTokenAccountInfo(walletAddress: PublicKey): Promise<string> {
    try {
      logger.info('Getting token account info', { wallet: walletAddress.toString() });
      
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletAddress,
        { programId: TOKEN_PROGRAM_ID }
      );

      logger.info('Found token accounts', { count: tokenAccounts.value.length });

      const sobaAccount = tokenAccounts.value.find(account => 
        account.account.data.parsed.info.mint === this.sobaTokenAddress.toString()
      );

      if (!sobaAccount) {
        logger.warn('No SOBA token account found', { wallet: walletAddress.toString() });
        return '0';
      }

      const balance = sobaAccount.account.data.parsed.info.tokenAmount.uiAmount;
      logger.info('Token balance fetched', { balance });
      
      return balance?.toString() || '0';
    } catch (error) {
      logger.error('Error getting token account info:', error);
      throw new SolanaError(
        'Failed to get token account info',
        500,
        error
      );
    }
  }

  async getTokenomics() {
    try {
      logger.info('Fetching tokenomics data');

      // Get burn wallet balance
      const burnBalance = await this.getTokenAccountInfo(this.burnWalletAddress);
      logger.info('Burn wallet balance fetched', { balance: burnBalance });

      // Get total supply using Solscan API for more reliable data
      const solscanResponse = await fetch(
        `https://api.solscan.io/token/meta?token=${config.tokens.sobaAddress}`,
        {
          headers: {
            'token': config.apis.solscanApiKey
          }
        }
      );

      const solscanData = await solscanResponse.json();
      logger.info('Solscan data fetched', { data: solscanData });

      return {
        totalSupply: solscanData.totalSupply || '0',
        burnedTokens: burnBalance,
        circulatingSupply: (parseFloat(solscanData.totalSupply || '0') - parseFloat(burnBalance)).toString(),
        holders: solscanData.holder || 0
      };
    } catch (error) {
      logger.error('Error fetching tokenomics:', error);
      throw new SolanaError(
        'Failed to fetch tokenomics data',
        500,
        error
      );
    }
  }

  async getBurnHistory() {
    try {
      logger.info('Fetching burn history');
      
      const signatures = await this.connection.getSignaturesForAddress(
        this.burnWalletAddress,
        { limit: 20 }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          return {
            signature: sig.signature,
            timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
            amount: tx?.meta?.postBalances[0] || 0
          };
        })
      );

      logger.info('Burn history fetched', { transactions: transactions.length });
      return transactions;
    } catch (error) {
      logger.error('Error fetching burn history:', error);
      throw new SolanaError(
        'Failed to fetch burn history',
        500,
        error
      );
    }
  }
} 