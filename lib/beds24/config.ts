import { Beds24Config } from './types';

const DEFAULT_CONFIG: Beds24Config = {
  baseURL: 'https://api.beds24.com/v2',
  version: '2.0',
  format: 'json',
  timeout: 10000,
  retries: 3
};

export const createConfig = (config: Partial<Beds24Config>): Beds24Config => {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  return {
    ...DEFAULT_CONFIG,
    ...config
  };
};