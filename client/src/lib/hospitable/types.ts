// types.ts

export interface HospitableError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface HospitableResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface HospitableRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export interface HospitableClientConfig {
  baseUrl: string;
  apiToken: string;
  defaultHeaders?: Record<string, string>;
  defaultCache?: RequestCache;
  defaultRevalidate?: number;
}

export interface Property {
  id: string;
  userId: string;
  name: string;
  description: string;
  private_name? : string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    latitude?: number;
    longitude?: number;
    neighborhood?: string;

  };
  imageUrl?: string;
  images: {
    url?: string;
    thumbnail_url?: string;
    caption?: string;
    order?: number;
  }[];
  amenities: string[];
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  pricing: {
    basePrice?: number;
    currency: string;
    cleaningFee?: number;
    serviceFee?: number;
  };
  rating?: number;
  reviewsCount?: number;
  type?: string; // e.g., "Apartment", "House", etc.
  
  availability: {
    checkIn: string;
    checkOut: string;
    minStay?: number;
    maxStay?: number;
  };

  bedroomDetails: {
      id?: number;
      name?: string;
      beds?: Array<{type?: string; quantity?: number}>;
      image?: string;
    }[];

  channel: {
    id?: string;
    platform?: string;
    platform_id?: string;
    name?: string;
    picture?: string;

  };
  hostId?: string;
  hostName?: string;
  hostImage?: string;
  channels: {
    id?: string;
    platform?: string;
    platform_id?: string;
    name?: string;
    picture?: string;

  }[];
  metadata?: Record<string, unknown>;
  bookingWidgetUrl?: string;

}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}