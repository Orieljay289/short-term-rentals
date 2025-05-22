import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

import { storage } from "./storage-factory";
import { reconcileJsonToSchema } from "@shared/reconcile";
import { reconcileJson } from "@/lib/hospitable/client_side_reconcile";
import apiMatchedKey from "@/lib/hospitable/api_matched_key.json";
import apiDBJsonMatchup from "@shared/api_json_db_matchup.json";
import { 
  
  insertCitySchema, 
  insertPropertySchema, 
  insertReviewSchema, 
  insertFavoriteSchema 
} from "@shared/schema";
import { z } from "zod";
import { createServerApiClient } from "../client/src/lib/hospitable/server-utils";
import { dataTagSymbol } from "@tanstack/react-query";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties API
  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const properties = await storage.getProperties(limit, offset);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const properties = await storage.getFeaturedProperties(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : undefined;
      const properties = await storage.searchProperties(query, filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.get("api/properties/:user_id", async (req: Request, res: Response) => {
    try {
      const userId = req.params.user_id;
      console.log("Fetching properties for user:", userId);
      const properties = await storage.getPropertiesByCustomer(userId);
      if (!properties) {
        return res.status(404).json({ message: "No properties found for this user" });
      }
      res.json(properties);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user ID", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("api/properties/:user_id/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.params.user_id;
      const propertyId = req.params.id;
      console.log("Fetching property for user:", userId, "Property ID:", propertyId);
      const property = await storage.getPropertyByCustomer(propertyId, userId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" }); 
      }
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user ID or property ID", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });
  
  app.patch("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const propertyData = req.body;
      
      
      // Ensure the property exists
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(id, propertyData);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Cities API
  app.get("/api/cities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const cities = await storage.getCities(limit);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const cities = await storage.getFeaturedCities(limit);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured cities" });
    }
  });

  app.get("/api/cities/:name", async (req: Request, res: Response) => {
    try {
      const city = await storage.getCityByName(req.params.name);
      
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      
      res.json(city);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });

  app.post("/api/cities", async (req: Request, res: Response) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(cityData);
      res.status(201).json(city);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid city data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create city" });
    }
  });

  app.get("/api/cities/:name/properties", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const properties = await storage.getPropertiesByCity(req.params.name, limit, offset);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch city properties" });
    }
  });

  // Neighborhoods API
  app.get("/api/cities/:id/neighborhoods", async (req: Request, res: Response) => {
    try {
      const cityId = parseInt(req.params.id);
      const neighborhoods = await storage.getNeighborhoods(cityId);
      res.json(neighborhoods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });

  // Reviews API
  app.get("/api/properties/:id/reviews", async (req: Request, res: Response) => {
    try {
      const propertyId = req.params.id;
      const reviews = await storage.getReviews(propertyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Favorites API (these would normally require authentication)
  app.get("/api/users/:userId/favorites", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites", async (req: Request, res: Response) => {
    try {
      const { userId, propertyId } = req.body;
      if (!userId || !propertyId) {
        return res.status(400).json({ message: "Missing userId or propertyId" });
      }
      
      const success = await storage.removeFavorite(parseInt(userId), parseInt(propertyId));
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const propertyId = parseInt(req.query.propertyId as string);
      
      if (isNaN(userId) || isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid userId or propertyId" });
      }
      
      const isFavorite = await storage.isFavorite(userId, propertyId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Hospitable API proxy routes
  const hospitable = {
    
    // properties: '/api/hospitable/properties',
    // property: '/api/hospitable/properties/:id',
    // customers: '/api/hospitable/customers',
    // customer: '/api/hospitable/customers/:id',
    bookings: '/api/hospitable/bookings',
    booking: '/api/hospitable/bookings/:id',
    // New dynamic customer routes:
    properties: '/api/hospitable/customers/:customerId/listings',
    property: '/api/hospitable/customers/:customerId/listings/:id',
    customers: '/api/hospitable/customers',
    customer: '/api/hospitable/customers/:id',
  };

  // Middleware to ensure Hospitable API token is set
  const requireHospitableToken = (req: Request, res: Response, next: Function) => {
    try {
      // This will throw if token is not available
      createServerApiClient();
      next();
    } catch (error: any) {
      res.status(500).json({ 
        message: "Hospitable API connection error", 
        error: error.message || "Missing API token"
      });
    }
  };

  // Apply middleware to all Hospitable routes
  app.use([
    hospitable.properties,
    hospitable.property,
    hospitable.customers,
    hospitable.customer,
    hospitable.bookings,
    hospitable.booking
  ], requireHospitableToken);


  // Hospitable Properties
  app.get(hospitable.properties, async (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res.status(400).json({ message: 'Missing customerId in request URL.' });
    }

    try {
      const api = createServerApiClient();
      const properties = await api.getProperties(customerId);
      res.json(properties);
    } catch (error: any) {
      console.error('Hospitable API Error (getProperties):', error);
      res.status(500).json({
        message: "Failed to fetch properties from Hospitable",
        error: error.message,
        details: error.code ? { code: error.code, status: error.status } : undefined,
      });
    }
  });


  app.get(hospitable.properties, async (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res.status(400).json({ message: 'Missing customerId in request URL.' });
    }

    try {
      const api = createServerApiClient();
      const properties = await api.getProperties(customerId);
      res.json(properties);
    } catch (error: any) {
      console.error('Hospitable API Error (getProperties):', error);
      res.status(500).json({
        message: "Failed to fetch properties from Hospitable",
        error: error.message,
        details: error.code ? { code: error.code, status: error.status } : undefined,
      });
    }
  });


  app.post(hospitable.properties, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const property = await api.createProperty(req.body);
      res.status(201).json(property);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create property in Hospitable", error: error.message });
    }
  });

  // Hospitable Customers
  app.get(hospitable.customers, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const customers = await api.getCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch customers from Hospitable", error: error.message });
    }
  });

  app.get(hospitable.customer, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const customer = await api.getCustomer(req.params.id);
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch customer from Hospitable", error: error.message });
    }
  });

  // Hospitable Bookings
  app.get(hospitable.bookings, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const filters = {
        propertyId: req.query.propertyId as string,
        customerId: req.query.customerId as string
      };
      const bookings = await api.getBookings(filters);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch bookings from Hospitable", error: error.message });
    }
  });

  app.post(hospitable.bookings, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const booking = await api.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create booking in Hospitable", error: error.message });
    }
  });

  app.patch(`${hospitable.booking}/status`, async (req: Request, res: Response) => {
    try {
      const api = createServerApiClient();
      const { status } = req.body;
      const booking = await api.updateBookingStatus(req.params.id, status);
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update booking status in Hospitable", error: error.message });
    }
  });

  app.post('/api/customer-lookup', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) return res.status(400).json({ message: 'Missing fields' });

    // 1. Check local DB
    const existing = await storage.getUserByEmailFullname(email, name);
   
    if (existing) {
      // If customer exists in local DB, return the ID
      return res.json({ customer_id: existing.username.replace(/^user_/, '') });

    }

    // 2. Query Hospitable Connect API
    const hospitableRes = await fetch('https://connect.hospitable.com/api/v1/customers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.HOSPITABLE_PLATFORM_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Connect-Version': '2024-01',
      },
    });

    if (!hospitableRes.ok) {
      const error = await hospitableRes.text();
      console.error('Hospitable API Error:', error);
      return res.status(500).json({ message: 'Hospitable API failed', error });
    }

    const { data: customers } = await hospitableRes.json();
    const match = customers.find((c: any) => c.email === email || c.name === name);

    if (!match) {
      return res.status(404).json({ message: 'Customer not found in Hospitable' });
    }

    // 3. Save match to DB
    try{
      const matchedCustomer = {data: match};
      
      console.log('Reconciliation process started for customer:', matchedCustomer);
      const fromattedResponse = reconcileJson(matchedCustomer, "Customer", "/api/v1/customers/{customer}", apiMatchedKey, undefined, false);
      console.log('Formatted response:', fromattedResponse);
      const reconciled = reconcileJsonToSchema(fromattedResponse, "Customer", "users", apiDBJsonMatchup);
      const { id, ...reconciledWithoutId } = reconciled;
      console.log('Reconciled customer data:', reconciledWithoutId);

      
      const customer = await storage.createUser({
        
        username:  `user_${reconciled.id}`,
        password: reconciled.id , // TODO: Replace with secure password logic
        email: reconciledWithoutId.email ?? null,
        phone: reconciledWithoutId.phone ?? null,
        fullName: reconciledWithoutId.fullName ?? null,
        ...reconciledWithoutId
      });
      console.log('Customer reconciled and saved to DB:', customer);
    }
    catch (error) {
      console.error('Error reconciling customer data and saving to DB:', error);
      
    }
    return res.json({ customer_id: match.id });
  });

  const httpServer = createServer(app);
  return httpServer;
}
