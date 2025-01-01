export interface Beds24Config {
  apiKey: string;
  baseURL?: string;
  version?: string;
  format?: 'json' | 'xml';
  timeout?: number;
  retries?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PropertyFilters {
  active?: boolean;
  channelId?: number;
  modifiedSince?: Date;
}

export interface BookingFilters extends PaginationParams {
  propertyId?: number;
  status?: 'confirmed' | 'pending' | 'cancelled';
  dateFrom?: Date;
  dateTo?: Date;
  modifiedSince?: Date;
}

export interface Property {
  id: number;
  name: string;
  type: string;
  status: string;
  rooms: number;
  address: {
    street: string;
    city: string;
    country: string;
    postcode: string;
  };
  amenities: string[];
}

export interface Booking {
  id: number;
  propertyId: number;
  guestName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  totalAmount: number;
  currency: string;
  source: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}