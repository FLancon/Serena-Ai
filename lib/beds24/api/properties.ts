import { AxiosInstance } from 'axios';
import { Property, PropertyFilters, ApiResponse } from '../types';

export class PropertiesApi {
  constructor(private readonly axios: AxiosInstance) {}

  /**
   * Retrieve a list of properties
   * @param {PropertyFilters} filters - Optional filters for the properties list
   * @returns {Promise<ApiResponse<Property[]>>} List of properties
   */
  async list(filters?: PropertyFilters): Promise<ApiResponse<Property[]>> {
    try {
      const { data } = await this.axios.get('/properties', { params: filters });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a single property by ID
   * @param {number} id - Property ID
   * @returns {Promise<ApiResponse<Property>>} Property details
   */
  async get(id: number): Promise<ApiResponse<Property>> {
    try {
      const { data } = await this.axios.get(`/properties?id=${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 404:
          throw new Error('Property not found');
        case 429:
          throw new Error('Rate limit exceeded');
        default:
          throw new Error(data.message || 'An error occurred with the properties API');
      }
    }
    throw error;
  }
}