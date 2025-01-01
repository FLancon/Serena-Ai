import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { Beds24Config } from './types';
import { createConfig } from './config';
import { PropertiesApi } from './api/properties';
import { BookingsApi } from './api/bookings';
import { AvailabilityApi } from './api/availability';
import { RatesApi } from './api/rates';
import { ChannelsApi } from './api/channels';
import { SystemApi } from './api/system';

export class Beds24Client {
  private readonly config: Beds24Config;
  private readonly axios: AxiosInstance;

  public readonly properties: PropertiesApi;
  public readonly bookings: BookingsApi;
  public readonly availability: AvailabilityApi;
  public readonly rates: RatesApi;
  public readonly channels: ChannelsApi;
  public readonly system: SystemApi;

  constructor(config: Partial<Beds24Config>) {
    this.config = createConfig(config);
    this.axios = this.createAxiosInstance();

    // Initialize API modules
    this.properties = new PropertiesApi(this.axios);
    this.bookings = new BookingsApi(this.axios);
    this.availability = new AvailabilityApi(this.axios);
    this.rates = new RatesApi(this.axios);
    this.channels = new ChannelsApi(this.axios);
    this.system = new SystemApi(this.axios);
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'token': this.config.apiKey,
        'Accept': this.config.format === 'json' ? 'application/json' : 'application/xml',
        'Content-Type': 'application/json'
      }
    });

    // Configure retry logic
    axiosRetry(instance, {
      retries: this.config.retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.response?.status === 429; // Rate limit exceeded
      }
    });

    // Add response interceptor for error handling
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 429) {
            // Handle rate limiting
            const retryAfter = error.response.headers['retry-after'];
            error.retryAfter = retryAfter ? parseInt(retryAfter, 10) : 60;
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }
}