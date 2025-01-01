import { AxiosInstance } from 'axios';
import { Booking, BookingFilters, ApiResponse } from '../types';

export class BookingsApi {
  constructor(private readonly axios: AxiosInstance) {}

  /**
   * Retrieve a list of bookings
   * @param {BookingFilters} filters - Optional filters for the bookings list
   * @returns {Promise<ApiResponse<Booking[]>>} List of bookings
   */
  async list(filters?: BookingFilters): Promise<ApiResponse<Booking[]>> {
    try {
      const { data } = await this.axios.get('/bookings', { params: filters });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a single booking by ID
   * @param {number} id - Booking ID
   * @returns {Promise<ApiResponse<Booking>>} Booking details
   */
  async get(id: number): Promise<ApiResponse<Booking>> {
    try {
      const { data } = await this.axios.get(`/bookings?id=${id}`);
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
          throw new Error('Booking not found');
        case 429:
          throw new Error('Rate limit exceeded');
        default:
          throw new Error(data.message || 'An error occurred with the bookings API');
      }
    }
    throw error;
  }
}