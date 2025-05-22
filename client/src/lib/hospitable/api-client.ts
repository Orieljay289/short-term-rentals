// api-client.ts

import { HospitableClientConfig, HospitableError, HospitableRequestOptions, HospitableResponse, Property, Customer, Booking } from './types';
import { reconcileJson } from './client_side_reconcile';
import apiMatchedMap from './api_matched_key.json';
import { reconcileJsonToSchema } from '@shared/reconcile';
import api_json_db_matchup from '@shared/api_json_db_matchup.json'
  // Property endpoints
import {
  getUserProperties,
  getUserPropertyById,
  createProperty
} from '../api'; // adjust path as needed
export class HospitableAPI {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultCache: RequestCache;
  private readonly defaultRevalidate: number;

  constructor(config: HospitableClientConfig) {
    this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
    this.apiToken = config.apiToken;
    this.defaultHeaders = {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Connect-Version': '2024-01',
      ...config.defaultHeaders,
    };
    this.defaultCache = config.defaultCache ?? 'no-store';
    this.defaultRevalidate = config.defaultRevalidate ?? 60;
  }

private async request<T>(path: string, options: HospitableRequestOptions = {}): Promise<HospitableResponse<T>> {
  console.log(`The base url is: ${this.baseUrl}`);
  
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(fullPath, this.baseUrl);

  const fetchOptions: RequestInit = {
    method: options.method ?? 'GET',
    headers: {
      ...this.defaultHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? this.defaultCache,
  };

  console.log(`[HospitableAPI] ${fetchOptions.method} ${url.toString()}`);
  if (fetchOptions.body) {
    console.log(`[HospitableAPI] Request body: ${fetchOptions.body}`);
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    const responseText = await response.text(); // Capture raw body before parsing

    console.log(`[HospitableAPI] Response status: ${response.status}`);
    // console.log(`[HospitableAPI] Raw response body:\n${responseText}`);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: `Non-JSON error. Status: ${response.status}`, raw: responseText };
      }

      const errorDetails = {
        name: 'APIError',
        message: errorData.message || `HTTP error! status: ${response.status}`,
        code: errorData.code || 'API_ERROR',
        status: response.status,
        raw: responseText,
      };

      console.error('[HospitableAPI] Error details:', errorDetails);
      throw errorDetails;
    }

    return JSON.parse(responseText) as HospitableResponse<T>;

  } catch (error: any) {
    console.error('[HospitableAPI] API request failed:', error);

    // Wrap in consistent error format if it’s not already
    const hospError: HospitableError = {
      name: error.name || 'APIError',
      message: error.message || 'Unknown API error',
      code: error.code || 'API_ERROR',
      status: error.status || 500,
      
    };

    throw hospError;
  }
}




  async getProperties(customerId: string): Promise<Property[]> {
    // STEP 1: Always fetch from Hospitable API
    const response = await this.request<any>(`/api/v1/customers/${customerId}/listings`);

    const reconciled: Property[] = reconcileJson<Property>(
      response,
      'Property',
      "/api/v1/customers/{customer}/listings/{listing}",
      apiMatchedMap,
      undefined,
      true
    );

    const finalReconciled: Property[] = [];

    for (const property of reconciled) {
      const propertyId = property.id;

      // STEP 2: Fetch full property details from Hospitable
      const propertyResponse = await this.getProperty(propertyId, customerId);
      finalReconciled.push(propertyResponse);
      console.log(`Fetched property ${propertyId} from Hospitable API`);

      // STEP 3: Check if property already exists in your backend DB
      let alreadyExists = false;
      try {
        const checkRes = await fetch(`/api/properties/${customerId}/${propertyId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (checkRes.ok) {
          const respJson = await checkRes.json();
          console.log(`Property ${propertyId} exists in DB:`, respJson);
          const respText  = await checkRes.text();
          console.log(`Property ${propertyId} exists in DB:`, respText);
          // If the property exists, we can skip saving itconst 
          console.log(`Property ${propertyId} already exists in DB, skipping save.`);
          alreadyExists = true;
        } else if (checkRes.status !== 404) {
          const errText = await checkRes.text();
          console.error(`Unexpected response when checking property: ${checkRes.status}`, errText);
        }
      } catch (err) {
        console.error(`Failed to check if property ${propertyId} exists:`, err);
      }

      // STEP 4: Save only if it doesn't exist
      if (!alreadyExists) {
        try {
          const reconciledProperty = reconcileJsonToSchema<Property>(
            propertyResponse,
            'Property',
            'properties',
            api_json_db_matchup
          );
          console.log(JSON.stringify(reconciledProperty));
          const createRes = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reconciledProperty),
          });

          if (!createRes.ok) {
            const errText = await createRes.text();
            console.error(`Failed to create property ${propertyId}:`, errText);
          } else {
            console.log(`Created property ${propertyId} in DB.`);
          }
        } catch (saveErr) {
          console.error(`Error while saving property ${propertyId} to DB:`, saveErr);
        }
      }
    }

    return finalReconciled;
  }




  async getProperty(id: string, customerId: string | null): Promise<Property> {
    const propResponse = await this.request<any>(`/api/v1/customers/${customerId}/listings/${id}`);
    const imageResponse = await this.request<any>(`/api/v1/customers/${customerId}/listings/${id}/images`);
    const pricingResponse = await this.request<any>(`/api/v1/listings/${id}/calendar`);

    const reconciled: Property = reconcileJson<Property>(propResponse, 'Property', "/api/v1/customers/{customer}/listings/{listing}", apiMatchedMap, undefined, false);
    const reconciledMiddle: Property = reconcileJson<Property>(imageResponse, 'Property', "/api/v1/customers/{customer}/listings/{listing}/images", apiMatchedMap, reconciled, false, true);
    const reconciledFinal: Property = reconcileJson<Property>(pricingResponse, 'Property', "/api/v1/listings/{listing}/calendar", apiMatchedMap, reconciledMiddle, false);

    return reconciledFinal;
  }


  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    const response = await this.request<Property>('/properties', {
      method: 'POST',
      body: property,
    });
    return response.data;
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`, {
      method: 'PATCH',
      body: property,
    });
    return response.data;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer endpoints
  async getCustomers(): Promise<Customer[]> {
    const response = await this.request<Customer[]>('/customers');
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.request<Customer>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await this.request<Customer>('/customers', {
      method: 'POST',
      body: customer,
    });
    return response.data;
  }

  // Booking endpoints
  async getBookings(filters?: { propertyId?: string; customerId?: string }): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filters?.propertyId) params.append('propertyId', filters.propertyId);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    
    const response = await this.request<Booking[]>(`/bookings?${params.toString()}`);
    return response.data;
  }

  async createBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const response = await this.request<Booking>('/bookings', {
      method: 'POST',
      body: booking,
    });
    return response.data;
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await this.request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return response.data;
  }
}
