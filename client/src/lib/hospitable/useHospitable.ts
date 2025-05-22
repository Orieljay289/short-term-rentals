// useHospitable.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HospitableAPI } from './api-client';
import { HOSPITABLE_CONFIG, getEnv } from './config';
import type { Property, Customer, Booking } from './types';
import { apiRequest } from '@/lib/queryClient';


// This client-side API instance will be used with a client token
// The token must be set in the VITE_HOSPITABLE_CLIENT_TOKEN environment variable
const getClientApi = () => {
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  
  
  return new HospitableAPI({
    baseUrl: HOSPITABLE_CONFIG.API_BASE_URL,
    apiToken: clientToken || '',
  });
};

// Properties
export function useProperties(customerId: string | null) {
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();

  return useQuery({
    queryKey: ['properties', customerId],
    queryFn: async () => {
      if (!customerId) throw new Error('Missing customerId');
      
      if (clientToken) {
        return api.getProperties(customerId);
      } else {
        const response = await apiRequest('GET', `/customers/${customerId}/listings`);
        return await response.json();
      }
    },
    enabled: !!customerId,
  });
}


export function useProperty(id: string, customerId: string | null) {
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (clientToken) {
        return api.getProperty(id, customerId);
      } else {
        // const response = await apiRequest('GET', `/api/hospitable/properties/${id}`);
        
        const response = await apiRequest('GET', `/customers/${customerId}/listings/${id}`);
        return await response.json();
      }
    },
    enabled: !!customerId,
    staleTime: 0, // force re-fetch
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useMutation({
    mutationFn: async (property: Omit<Property, 'id'>) => {
      if (clientToken) {
        return api.createProperty(property);
      } else {
        const response = await apiRequest('POST', '/api/hospitable/properties', property);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      if (clientToken) {
        return api.updateProperty(id, data);
      } else {
        const response = await apiRequest('PATCH', `/api/hospitable/properties/${id}`, data);
        return await response.json();
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Customers
export function useCustomer(id: string) {
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (clientToken) {
        return api.getCustomer(id);
      } else {
        const response = await apiRequest('GET', `/api/hospitable/customers/${id}`);
        return await response.json();
      }
    },
    enabled: !!id,
  });
}

// Bookings
export function useBookings(filters?: { propertyId?: string; customerId?: string }) {
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useQuery({
    queryKey: ['bookings', filters?.propertyId, filters?.customerId],
    queryFn: async () => {
      if (clientToken) {
        return api.getBookings(filters);
      } else {
        const params = new URLSearchParams();
        if (filters?.propertyId) params.append('propertyId', filters.propertyId);
        if (filters?.customerId) params.append('customerId', filters.customerId);
        
        const url = `/api/hospitable/bookings${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await apiRequest('GET', url);
        return await response.json();
      }
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      if (clientToken) {
        return api.createBooking(booking);
      } else {
        const response = await apiRequest('POST', '/api/hospitable/bookings', booking);
        return await response.json();
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.propertyId] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const clientToken = getEnv('VITE_HOSPITABLE_CLIENT_TOKEN');
  const api = getClientApi();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking['status'] }) => {
      if (clientToken) {
        return api.updateBookingStatus(id, status);
      } else {
        const response = await apiRequest('PATCH', `/api/hospitable/bookings/${id}/status`, { status });
        return await response.json();
      }
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', booking.propertyId] });
    },
  });
}