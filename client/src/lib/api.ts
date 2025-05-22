import axios from 'axios';
import { Property, City, Review, Neighborhood } from '@shared/schema';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties API
export const getProperties = async (limit = 10, offset = 0): Promise<Property[]> => {
  const response = await api.get(`/properties?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getFeaturedProperties = async (limit = 4): Promise<Property[]> => {
  const response = await api.get(`/properties/featured?limit=${limit}`);
  return response.data;
};

export const getProperty = async (id: number): Promise<Property> => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (
  propertyData: Omit<Property, 'id'>
): Promise<Property> => {
  try {
    const response = await api.post('/properties', propertyData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating property:', error);
    if (error.response?.status === 400) {
      throw new Error('Invalid property data');
    }
    throw new Error('Failed to create property');
  }
};


export const getUserProperties = async (
  userId: string
): Promise<Property[]> => {
  try {
    console.log('Fetching properties for user:', userId);
    const response = await api.get(`/properties/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching properties for user ${userId}:`, error);
    if (error.response?.status === 404) {
      throw new Error('No properties found for this user');
    }
    throw new Error('Failed to fetch user properties');
  }
};


export const getUserPropertyById = async (
  userId: string,
  propertyId: string
): Promise<Property> => {
  try {
    console.log('Fetching property for user:', userId, 'Property ID:', propertyId);
    const response = await api.get(`/properties/${userId}/${propertyId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching property ${propertyId} for user ${userId}:`, error);
    if (error.response?.status === 404) {
      throw new Error('Property not found');
    }
    throw new Error('Failed to fetch property');
  }
};






export const searchProperties = async (query: string, filters?: any): Promise<Property[]> => {
  const filtersParam = filters ? `&filters=${JSON.stringify(filters)}` : '';
  const response = await api.get(`/properties/search?q=${query}${filtersParam}`);
  return response.data;
};

// Cities API
export const getCities = async (limit = 10): Promise<City[]> => {
  const response = await api.get(`/cities?limit=${limit}`);
  return response.data;
};

export const getFeaturedCities = async (limit = 4): Promise<City[]> => {
  const response = await api.get(`/cities/featured?limit=${limit}`);
  return response.data;
};

export const getCity = async (name: string): Promise<City> => {
  const response = await api.get(`/cities/${name}`);
  return response.data;
};

export const getCityProperties = async (
  cityName: string, 
  limit = 10, 
  offset = 0
): Promise<Property[]> => {
  const response = await api.get(`/cities/${cityName}/properties?limit=${limit}&offset=${offset}`);
  return response.data;
};

// Neighborhoods API
export const getNeighborhoods = async (cityId: number): Promise<Neighborhood[]> => {
  const response = await api.get(`/cities/${cityId}/neighborhoods`);
  return response.data;
};

// Reviews API
export const getPropertyReviews = async (propertyId: number): Promise<Review[]> => {
  const response = await api.get(`/properties/${propertyId}/reviews`);
  return response.data;
};

export const createReview = async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const response = await api.post('/reviews', review);
  return response.data;
};

// Favorites API
export const getFavorites = async (userId: number): Promise<Property[]> => {
  const response = await api.get(`/users/${userId}/favorites`);
  return response.data;
};

export const addFavorite = async (userId: number, propertyId: number): Promise<void> => {
  await api.post('/favorites', { userId, propertyId });
};

export const removeFavorite = async (userId: number, propertyId: number): Promise<void> => {
  await api.delete('/favorites', { data: { userId, propertyId } });
};

export const checkFavorite = async (userId: number, propertyId: number): Promise<boolean> => {
  const response = await api.get(`/favorites/check?userId=${userId}&propertyId=${propertyId}`);
  return response.data.isFavorite;
};

export default api;
