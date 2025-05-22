var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  apiIntegrations: () => apiIntegrations,
  cities: () => cities,
  favorites: () => favorites,
  insertApiIntegrationSchema: () => insertApiIntegrationSchema,
  insertCitySchema: () => insertCitySchema,
  insertFavoriteSchema: () => insertFavoriteSchema,
  insertNeighborhoodSchema: () => insertNeighborhoodSchema,
  insertPropertySchema: () => insertPropertySchema,
  insertReviewSchema: () => insertReviewSchema,
  insertUserSchema: () => insertUserSchema,
  neighborhoods: () => neighborhoods,
  properties: () => properties,
  reviews: () => reviews,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: text("phone"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  phone: true,
  password: true,
  email: true,
  fullName: true
});
var properties = pgTable("properties", {
  id: text("id").primaryKey().unique(),
  user_id: text("user_id"),
  // Foreign key to users table
  // Basic info
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").notNull(),
  neighborhood: text("neighborhood"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  // Property details
  price: integer("price").notNull(),
  // price per night
  weekendPrice: integer("weekend_price"),
  weeklyPrice: integer("weekly_price"),
  monthlyPrice: integer("monthly_price"),
  cleaningFee: integer("cleaning_fee"),
  serviceFee: integer("service_fee"),
  taxRate: doublePrecision("tax_rate"),
  minStay: integer("min_stay").default(1),
  maxStay: integer("max_stay"),
  // Ratings and reviews
  rating: doublePrecision("rating"),
  // average rating
  reviewCount: integer("review_count").default(0),
  // Property characteristics
  type: text("type").default("Apartment"),
  // Type of property (Apartment, Villa, House, etc.)
  propertySize: integer("property_size"),
  // in square feet
  yearBuilt: integer("year_built"),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: text("amenities").array(),
  bedroomDetails: jsonb("bedroom_details").$type(),
  // Media
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  // array of image URLs
  videoUrl: text("video_url"),
  virtualTourUrl: text("virtual_tour_url"),
  // Host information
  hostId: text("host_id").notNull(),
  hostName: text("host_name").notNull(),
  hostImage: text("host_image"),
  // Widgets and integrations
  bookingWidgetUrl: text("booking_widget_url"),
  // URL for property-specific booking widget
  reviewWidgetCode: text("review_widget_code"),
  // Widget code for Revyoos
  calendarSyncUrl: text("calendar_sync_url"),
  // iCal feed URL
  propertyManagementSystemId: text("pms_id"),
  // ID in external property management system
  channelManagerId: text("channel_manager_id"),
  // ID in external channel manager
  // External API data
  externalId: text("external_id"),
  // ID from the external API
  externalSource: text("external_source"),
  // Source of the external data (e.g., "airbnb", "vrbo")
  lastSyncedAt: timestamp("last_synced_at"),
  // SEO fields
  slug: text("slug").unique(),
  // URL-friendly version of the name
  metaTitle: text("meta_title"),
  // Custom SEO title
  metaDescription: text("meta_description"),
  // Custom SEO description
  canonicalUrl: text("canonical_url"),
  // Custom canonical URL
  keywords: text("keywords").array(),
  // SEO keywords
  // Flags and status
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  status: text("status").default("active"),
  // active, pending, inactive
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at")
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});
var cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  propertyCount: integer("property_count").default(0),
  featured: boolean("featured").default(false),
  // SEO fields
  slug: text("slug").unique(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords").array(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: text("property_id").notNull(),
  userId: integer("user_id").notNull(),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  rating: doublePrecision("rating").notNull(),
  title: text("title"),
  comment: text("comment").notNull(),
  response: text("response"),
  // Host response to the review
  responseDate: timestamp("response_date"),
  isVerified: boolean("is_verified").default(false),
  date: timestamp("date").defaultNow()
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  date: true,
  responseDate: true
});
var neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cityId: integer("city_id").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  propertyCount: integer("property_count").default(0),
  // SEO fields
  slug: text("slug").unique(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertNeighborhoodSchema = createInsertSchema(neighborhoods).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true
});
var apiIntegrations = pgTable("api_integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull(),
  // Property management system, channel manager, etc.
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  baseUrl: text("base_url"),
  isActive: boolean("is_active").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  syncFrequency: text("sync_frequency").default("daily"),
  // hourly, daily, weekly
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertApiIntegrationSchema = createInsertSchema(apiIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
var { Pool } = pg;
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/database-storage.ts
import { eq, and, gte, lte, desc, sql, ilike } from "drizzle-orm";

// shared/relations.ts
import { relations } from "drizzle-orm";
var usersRelations = relations(users, ({ many }) => ({
  properties: many(properties, { relationName: "userProperties" }),
  reviews: many(reviews),
  favorites: many(favorites)
}));
var propertiesRelations = relations(properties, ({ one, many }) => ({
  host: one(users, {
    fields: [properties.hostId],
    references: [users.id],
    relationName: "userProperties"
  }),
  city: one(cities, {
    fields: [properties.city],
    references: [cities.name]
  }),
  reviews: many(reviews),
  favorites: many(favorites)
}));
var citiesRelations = relations(cities, ({ many }) => ({
  properties: many(properties),
  neighborhoods: many(neighborhoods)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id]
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  })
}));
var neighborhoodsRelations = relations(neighborhoods, ({ one, many }) => ({
  city: one(cities, {
    fields: [neighborhoods.cityId],
    references: [cities.id]
  }),
  properties: many(properties)
}));
var favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id]
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id]
  })
}));
var apiIntegrationsRelations = relations(apiIntegrations, ({ one }) => ({
  property: one(properties, {
    fields: [apiIntegrations.id],
    // Using id as a temporary reference until we have proper propertyId column
    references: [properties.id]
  })
}));

// server/database-storage.ts
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmailFullname(email, fullname) {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.email, email),
        eq(users.fullName, fullname)
      )
    );
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(user) {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  // Properties
  async getProperties(limit = 10, offset = 0) {
    return await db.select().from(properties).where(eq(properties.isActive, true)).orderBy(desc(properties.createdAt)).limit(limit).offset(offset);
  }
  async getPropertiesByCustomer(user_id, limit, offset) {
    const query = db.select().from(properties).where(and(
      eq(properties.isActive, true),
      eq(properties.user_id, user_id)
    )).orderBy(desc(properties.createdAt));
    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }
    return await query;
  }
  async getPropertyByCustomer(id, user_id) {
    return db.select().from(properties).where(and(
      eq(properties.isActive, true),
      eq(properties.user_id, user_id),
      eq(properties.id, id)
    )).then(([property]) => property);
  }
  async getFeaturedProperties(limit = 4) {
    return await db.select().from(properties).where(and(
      eq(properties.isActive, true),
      eq(properties.isFeatured, true)
    )).limit(limit);
  }
  async getProperty(id) {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  async getPropertiesByCity(cityName, limit = 10, offset = 0) {
    return await db.select().from(properties).where(and(
      eq(properties.isActive, true),
      ilike(properties.city, `%${cityName}%`)
    )).limit(limit).offset(offset);
  }
  async searchProperties(query, filters) {
    const conditions = [
      eq(properties.isActive, true),
      sql`(
        ${properties.name} ILIKE ${`%${query}%`} OR
        ${properties.city} ILIKE ${`%${query}%`} OR
        ${properties.country} ILIKE ${`%${query}%`} OR
        ${properties.location} ILIKE ${`%${query}%`}
      )`
    ];
    if (filters) {
      if (filters.minPrice) {
        conditions.push(gte(properties.price, filters.minPrice));
      }
      if (filters.maxPrice) {
        conditions.push(lte(properties.price, filters.maxPrice));
      }
      if (filters.bedrooms) {
        conditions.push(gte(properties.bedrooms, filters.bedrooms));
      }
      if (filters.bathrooms) {
        conditions.push(gte(properties.bathrooms, filters.bathrooms));
      }
      if (filters.maxGuests) {
        conditions.push(gte(properties.maxGuests, filters.maxGuests));
      }
      if (filters.type) {
        conditions.push(eq(properties.type, filters.type));
      }
    }
    const results = await db.select().from(properties).where(and(...conditions));
    return results;
  }
  async createProperty(property) {
    if (!property.slug) {
      property.slug = property.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const [createdProperty] = await db.insert(properties).values(property).returning();
    return createdProperty;
  }
  async updateProperty(id, property) {
    const [updatedProperty] = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return updatedProperty;
  }
  async deleteProperty(id) {
    const [updatedProperty] = await db.update(properties).set({
      isActive: false
    }).where(eq(properties.id, id)).returning();
    return !!updatedProperty;
  }
  // Cities
  async getCities(limit = 10) {
    return await db.select().from(cities).limit(limit);
  }
  async getFeaturedCities(limit = 4) {
    return await db.select().from(cities).where(eq(cities.featured, true)).limit(limit);
  }
  async getCity(id) {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city;
  }
  async getCityByName(name) {
    const [city] = await db.select().from(cities).where(ilike(cities.name, name));
    return city;
  }
  async createCity(city) {
    if (!city.slug) {
      city.slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const [createdCity] = await db.insert(cities).values(city).returning();
    return createdCity;
  }
  async updateCity(id, city) {
    const [updatedCity] = await db.update(cities).set(city).where(eq(cities.id, id)).returning();
    return updatedCity;
  }
  async deleteCity(id) {
    const result = await db.delete(cities).where(eq(cities.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }
  // Reviews
  async getReviews(propertyId) {
    return await db.select().from(reviews).where(eq(reviews.propertyId, propertyId)).orderBy(desc(reviews.date));
  }
  async createReview(review) {
    const [createdReview] = await db.insert(reviews).values(review).returning();
    await this.updatePropertyRating(review.propertyId);
    return createdReview;
  }
  async deleteReview(id) {
    const [deletedReview] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    if (deletedReview) {
      await this.updatePropertyRating(deletedReview.propertyId);
      return true;
    }
    return false;
  }
  async updatePropertyRating(propertyId) {
    const propertyReviews = await this.getReviews(propertyId);
    const totalRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = propertyReviews.length > 0 ? totalRating / propertyReviews.length : 0;
    await db.update(properties).set({
      rating: avgRating,
      reviewCount: propertyReviews.length
    }).where(eq(properties.id, propertyId));
  }
  // Neighborhoods
  async getNeighborhoods(cityId) {
    return await db.select().from(neighborhoods).where(eq(neighborhoods.cityId, cityId));
  }
  async createNeighborhood(neighborhood) {
    if (!neighborhood.slug) {
      neighborhood.slug = neighborhood.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const [createdNeighborhood] = await db.insert(neighborhoods).values(neighborhood).returning();
    return createdNeighborhood;
  }
  // Favorites
  async getFavorites(userId) {
    const result = await db.select({
      property: properties
    }).from(favorites).innerJoin(properties, eq(favorites.propertyId, properties.id)).where(eq(favorites.userId, userId));
    return result.map((r) => r.property);
  }
  async addFavorite(favorite) {
    const [createdFavorite] = await db.insert(favorites).values(favorite).returning();
    return createdFavorite;
  }
  async removeFavorite(userId, propertyId) {
    const result = await db.delete(favorites).where(and(
      eq(favorites.userId, userId),
      eq(favorites.propertyId, propertyId)
    ));
    return !!result.rowCount && result.rowCount > 0;
  }
  async isFavorite(userId, propertyId) {
    const [favorite] = await db.select().from(favorites).where(and(
      eq(favorites.userId, userId),
      eq(favorites.propertyId, propertyId)
    ));
    return !!favorite;
  }
};

// server/storage.ts
var MemStorage = class {
  users;
  properties;
  cities;
  reviews;
  neighborhoods;
  favorites;
  userIdCounter;
  propertyIdCounter;
  cityIdCounter;
  reviewIdCounter;
  neighborhoodIdCounter;
  favoriteIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.cities = /* @__PURE__ */ new Map();
    this.reviews = /* @__PURE__ */ new Map();
    this.neighborhoods = /* @__PURE__ */ new Map();
    this.favorites = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.cityIdCounter = 1;
    this.reviewIdCounter = 1;
    this.neighborhoodIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.initializeData();
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmailFullname(email, fullname) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email && user.fullName === fullname
    );
  }
  // Made some corrections to the createUser method
  // to ensure it handles the optional fields correctly
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      isAdmin: false,
      email: insertUser.email ?? null,
      fullName: insertUser.fullName ?? null,
      phone: insertUser.phone ?? null
    };
    this.users.set(id, user);
    return user;
  }
  // Properties
  async getProperties(limit = 10, offset = 0) {
    return Array.from(this.properties.values()).slice(offset, offset + limit);
  }
  async getFeaturedProperties(limit = 4) {
    return Array.from(this.properties.values()).filter((property) => property.isFeatured).slice(0, limit);
  }
  async getPropertiesByCustomer(user_id, limit = 10, offset = 0) {
    return Array.from(this.properties.values()).filter((property) => property.user_id === user_id).slice(offset, offset + limit);
  }
  async getPropertyByCustomer(id, user_id) {
    const property = this.properties.get(id);
    if (property && property.user_id === user_id) {
      return property;
    }
    return void 0;
  }
  async getProperty(id) {
    return this.properties.get(id);
  }
  async getPropertiesByCity(cityName, limit = 10, offset = 0) {
    return Array.from(this.properties.values()).filter((property) => property.city.toLowerCase() === cityName.toLowerCase()).slice(offset, offset + limit);
  }
  async searchProperties(query, filters) {
    const searchTerm = query.toLowerCase();
    let results = Array.from(this.properties.values()).filter((property) => {
      return property.name.toLowerCase().includes(searchTerm) || property.city.toLowerCase().includes(searchTerm) || property.country.toLowerCase().includes(searchTerm) || property.location.toLowerCase().includes(searchTerm);
    });
    if (filters) {
      if (filters.minPrice) {
        results = results.filter((p) => p.price >= filters.minPrice);
      }
      if (filters.maxPrice) {
        results = results.filter((p) => p.price <= filters.maxPrice);
      }
      if (filters.bedrooms) {
        results = results.filter((p) => p.bedrooms >= filters.bedrooms);
      }
    }
    return results;
  }
  async createProperty(property) {
    const id = `${this.propertyIdCounter++}_property`;
    const newProperty = {
      // Required fields (must be present in InsertProperty)
      name: property.name,
      user_id: property.user_id ?? null,
      // Default to null if not provided
      description: property.description,
      location: property.location,
      city: property.city,
      country: property.country,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      maxGuests: property.maxGuests,
      imageUrl: property.imageUrl,
      hostId: property.hostId,
      hostName: property.hostName,
      maxStay: property.maxStay ?? null,
      // Add default value for maxStay
      // Fields with defaults
      id,
      type: property.type ?? "Apartment",
      rating: property.rating ?? 0,
      reviewCount: property.reviewCount ?? 0,
      minStay: property.minStay ?? 1,
      status: property.status ?? "active",
      isVerified: property.isVerified ?? false,
      isFeatured: property.isFeatured ?? false,
      isActive: property.isActive ?? true,
      // Array fields (schema says array, not null)
      amenities: property.amenities ?? [],
      additionalImages: property.additionalImages ?? [],
      keywords: property.keywords ?? [],
      // JSON fields
      bedroomDetails: property.bedroomDetails ?? [],
      // Numeric fields
      weekendPrice: property.weekendPrice ?? null,
      weeklyPrice: property.weeklyPrice ?? null,
      monthlyPrice: property.monthlyPrice ?? null,
      cleaningFee: property.cleaningFee ?? null,
      serviceFee: property.serviceFee ?? null,
      taxRate: property.taxRate ?? null,
      propertySize: property.propertySize ?? null,
      yearBuilt: property.yearBuilt ?? null,
      latitude: property.latitude ?? null,
      longitude: property.longitude ?? null,
      // String fields
      state: property.state ?? null,
      zipCode: property.zipCode ?? null,
      neighborhood: property.neighborhood ?? null,
      videoUrl: property.videoUrl ?? null,
      virtualTourUrl: property.virtualTourUrl ?? null,
      hostImage: property.hostImage ?? null,
      bookingWidgetUrl: property.bookingWidgetUrl ?? null,
      reviewWidgetCode: property.reviewWidgetCode ?? null,
      calendarSyncUrl: property.calendarSyncUrl ?? null,
      propertyManagementSystemId: property.propertyManagementSystemId ?? null,
      channelManagerId: property.channelManagerId ?? null,
      externalId: property.externalId ?? null,
      externalSource: property.externalSource ?? null,
      slug: property.slug ?? generateSlug(property.name),
      metaTitle: property.metaTitle ?? null,
      metaDescription: property.metaDescription ?? null,
      canonicalUrl: property.canonicalUrl ?? null,
      // Date fields
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      publishedAt: null,
      lastSyncedAt: property.lastSyncedAt ?? null
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }
  async updateProperty(id, updates) {
    const existing = this.properties.get(id);
    if (!existing) return void 0;
    const updatedProperty = {
      ...existing,
      ...updates,
      bedroomDetails: updates.bedroomDetails ?? existing.bedroomDetails,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  async deleteProperty(id) {
    return this.properties.delete(id);
  }
  // Cities
  async getCities(limit = 10) {
    return Array.from(this.cities.values()).slice(0, limit);
  }
  async getFeaturedCities(limit = 4) {
    return Array.from(this.cities.values()).filter((city) => city.featured).slice(0, limit);
  }
  async getCity(id) {
    return this.cities.get(id);
  }
  async getCityByName(name) {
    return Array.from(this.cities.values()).find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
  }
  async createCity(city) {
    const id = this.cityIdCounter++;
    const newCity = {
      id,
      name: city.name,
      country: city.country,
      state: city.state ?? null,
      description: city.description,
      longDescription: city.longDescription ?? null,
      latitude: city.latitude ?? null,
      longitude: city.longitude ?? null,
      imageUrl: city.imageUrl,
      additionalImages: city.additionalImages ?? [],
      propertyCount: city.propertyCount ?? 0,
      featured: city.featured ?? false,
      slug: city.slug ?? generateSlug(city.name),
      metaTitle: city.metaTitle ?? null,
      metaDescription: city.metaDescription ?? null,
      keywords: city.keywords ?? [],
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cities.set(id, newCity);
    return newCity;
  }
  async updateCity(id, city) {
    const existingCity = this.cities.get(id);
    if (!existingCity) return void 0;
    const updatedCity = { ...existingCity, ...city };
    this.cities.set(id, updatedCity);
    return updatedCity;
  }
  async deleteCity(id) {
    return this.cities.delete(id);
  }
  // Reviews
  async getReviews(propertyId) {
    return Array.from(this.reviews.values()).filter((review) => review.propertyId === propertyId);
  }
  async createReview(review) {
    const id = this.reviewIdCounter++;
    const newReview = {
      ...review,
      id,
      date: /* @__PURE__ */ new Date(),
      responseDate: null,
      // Default value for responseDate
      userImage: review.userImage ?? null,
      // Esure userImage is not undefined
      isVerified: review.isVerified ?? false,
      // Default value for isVerified
      response: null,
      // Default value for response
      title: review.title ?? null
      // Default value for title
    };
    this.reviews.set(id, newReview);
    const property = this.properties.get(review.propertyId);
    if (property) {
      const propertyReviews = await this.getReviews(review.propertyId);
      const totalRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / propertyReviews.length;
      this.properties.set(property.id, {
        ...property,
        rating: avgRating,
        reviewCount: propertyReviews.length
      });
    }
    return newReview;
  }
  async deleteReview(id) {
    const review = this.reviews.get(id);
    if (!review) return false;
    const success = this.reviews.delete(id);
    if (success) {
      const property = this.properties.get(review.propertyId);
      if (property) {
        const propertyReviews = await this.getReviews(review.propertyId);
        const totalRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = propertyReviews.length > 0 ? totalRating / propertyReviews.length : 0;
        this.properties.set(property.id, {
          ...property,
          rating: avgRating,
          reviewCount: propertyReviews.length
        });
      }
    }
    return success;
  }
  // Neighborhoods
  async getNeighborhoods(cityId) {
    return Array.from(this.neighborhoods.values()).filter((neighborhood) => neighborhood.cityId === cityId);
  }
  async createNeighborhood(neighborhood) {
    const id = this.neighborhoodIdCounter++;
    const newNeighborhood = {
      id,
      cityId: neighborhood.cityId,
      name: neighborhood.name,
      description: neighborhood.description ?? null,
      longDescription: neighborhood.longDescription ?? null,
      latitude: neighborhood.latitude ?? null,
      longitude: neighborhood.longitude ?? null,
      imageUrl: neighborhood.imageUrl,
      additionalImages: neighborhood.additionalImages ?? [],
      propertyCount: neighborhood.propertyCount ?? 0,
      slug: neighborhood.slug ?? generateSlug(neighborhood.name),
      metaTitle: neighborhood.metaTitle ?? null,
      metaDescription: neighborhood.metaDescription ?? null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.neighborhoods.set(id, newNeighborhood);
    return newNeighborhood;
  }
  // Favorites
  async getFavorites(userId) {
    const favoriteIds = Array.from(this.favorites.values()).filter((fav) => fav.userId === userId).map((fav) => fav.propertyId.toString());
    return Array.from(this.properties.values()).filter((property) => favoriteIds.includes(property.id));
  }
  async addFavorite(favorite) {
    const id = this.favoriteIdCounter++;
    const newFavorite = {
      ...favorite,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }
  async removeFavorite(userId, propertyId) {
    const favoriteEntry = Array.from(this.favorites.values()).find(
      (fav) => fav.userId === userId && fav.propertyId === propertyId
    );
    if (!favoriteEntry) return false;
    return this.favorites.delete(favoriteEntry.id);
  }
  async isFavorite(userId, propertyId) {
    return Array.from(this.favorites.values()).some(
      (fav) => fav.userId === userId && fav.propertyId === propertyId
    );
  }
  // Initialize with sample data
  initializeData() {
    const cities2 = [
      {
        name: "New York",
        country: "United States",
        description: "Experience the energy of the city that never sleeps",
        longDescription: "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that's among the world's major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.",
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        propertyCount: 1245,
        featured: true
      },
      {
        name: "London",
        country: "United Kingdom",
        description: "Historic landmarks and modern attractions in one vibrant city",
        longDescription: "London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times. At its centre stand the imposing Houses of Parliament, the iconic 'Big Ben' clock tower and Westminster Abbey, site of British monarch coronations. Across the Thames River, the London Eye observation wheel provides panoramic views of the South Bank cultural complex, and the entire city.",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        propertyCount: 978,
        featured: true
      },
      {
        name: "Tokyo",
        country: "Japan",
        description: "Ultramodern and traditional blend in Japan's busy capital",
        longDescription: "Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods. The Imperial Palace sits amid large public gardens. The city's many museums offer exhibits ranging from classical art in the Tokyo National Museum to a reconstructed kabuki theater in the Edo-Tokyo Museum.",
        imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        propertyCount: 842,
        featured: true
      },
      {
        name: "Paris",
        country: "France",
        description: "The city of lights, art, and romance",
        longDescription: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honor\xE9.",
        imageUrl: "https://images.unsplash.com/photo-1568681731043-805a5720be6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        propertyCount: 1054,
        featured: true
      }
    ];
    cities2.forEach((city) => this.createCity(city));
    const nyc = Array.from(this.cities.values()).find((c) => c.name === "New York");
    if (nyc) {
      const neighborhoods2 = [
        {
          name: "Manhattan",
          cityId: nyc.id,
          description: "The heart of New York City",
          imageUrl: "https://images.unsplash.com/photo-1555109307-f7d9da25c244?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80",
          propertyCount: 450
        },
        {
          name: "Brooklyn",
          cityId: nyc.id,
          description: "A diverse borough with a unique vibe",
          imageUrl: "https://images.unsplash.com/photo-1555109307-49fe1e4a4f6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80",
          propertyCount: 380
        },
        {
          name: "Queens",
          cityId: nyc.id,
          description: "New York's largest and most diverse borough",
          imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          propertyCount: 290
        }
      ];
      neighborhoods2.forEach((hood) => this.createNeighborhood(hood));
    }
    const properties2 = [
      {
        name: "Luxury Apartment in Manhattan",
        description: "Welcome to this stunning, modern apartment in the heart of Manhattan's Upper East Side. Recently renovated with designer furnishings and high-end finishes, this spacious two-bedroom offers the perfect luxury retreat in New York City.\n\nThe open concept living area features floor-to-ceiling windows with breathtaking city views, a gourmet kitchen with stainless steel appliances, and a comfortable dining area. Both bedrooms come with premium queen-sized beds and luxurious linens.\n\nLocated just steps from Central Park and Museum Mile, with easy access to subway lines, this apartment offers the perfect base for exploring all that New York has to offer.",
        location: "Upper East Side, Manhattan",
        city: "New York",
        country: "United States",
        price: 189,
        rating: 4.92,
        reviewCount: 128,
        type: "Apartment",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        additionalImages: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=867&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
        ],
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        amenities: ["High-speed WiFi", "Air conditioning", '55" HDTV with Netflix', "Fully equipped kitchen", "Washer/dryer", "Elevator in building", "Gym access", "24/7 security"],
        bedroomDetails: [
          {
            id: 1,
            name: "Bedroom 1",
            beds: [{ type: "king", count: 1 }, { type: "air mattress", count: 1 }],
            image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          },
          {
            id: 2,
            name: "Bedroom 2",
            beds: [{ type: "queen", count: 1 }, { type: "single", count: 1 }],
            image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          }
        ],
        hostId: "1",
        hostName: "Michael",
        hostImage: "https://randomuser.me/api/portraits/men/32.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=",
        isFeatured: true
      },
      {
        name: "Beach Villa with Ocean View",
        description: "Escape to this stunning beach villa with breathtaking ocean views. Perfect for a relaxing getaway with friends or family.",
        location: "Malibu, CA",
        city: "Malibu",
        country: "United States",
        price: 395,
        rating: 4.97,
        reviewCount: 85,
        type: "Villa",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        additionalImages: [],
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: ["Private beach access", "Ocean view", "Outdoor BBQ", "WiFi", "Air conditioning", "Fully equipped kitchen"],
        bedroomDetails: [
          {
            id: 1,
            name: "Master Bedroom",
            beds: [{ type: "king", count: 1 }],
            image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"
          },
          {
            id: 2,
            name: "Guest Bedroom",
            beds: [{ type: "queen", count: 1 }, { type: "single", count: 1 }],
            image: "https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
          },
          {
            id: 3,
            name: "Kids Room",
            beds: [{ type: "twin", count: 2 }],
            image: "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
          }
        ],
        hostId: "2",
        hostName: "Sarah",
        hostImage: "https://randomuser.me/api/portraits/women/45.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=",
        isFeatured: true
      },
      {
        name: "Modern Loft in Downtown",
        description: "Stylish loft in the heart of downtown with exposed brick walls and modern amenities. Perfect for urban explorers.",
        location: "Chicago, IL",
        city: "Chicago",
        country: "United States",
        price: 150,
        rating: 4.85,
        reviewCount: 102,
        type: "Loft",
        imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        additionalImages: [],
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 3,
        amenities: ["WiFi", "Smart TV", "Fully equipped kitchen", "Work desk", "Air conditioning", "Washing machine"],
        hostId: "3",
        hostName: "David",
        hostImage: "https://randomuser.me/api/portraits/men/67.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=",
        isFeatured: true
      },
      {
        name: "Cozy Cabin in the Woods",
        description: "Charming cabin surrounded by nature. Ideal for a peaceful retreat with all the comforts of home.",
        location: "Aspen, CO",
        city: "Aspen",
        country: "United States",
        price: 225,
        rating: 4.92,
        reviewCount: 74,
        type: "Cabin",
        imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        additionalImages: [],
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        amenities: ["Fireplace", "Hot tub", "WiFi", "Fully equipped kitchen", "BBQ grill", "Mountain views"],
        hostId: "4",
        hostName: "Emma",
        hostImage: "https://randomuser.me/api/portraits/women/22.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=",
        isFeatured: true
      },
      // More NYC properties for search results
      {
        name: "Modern Studio in SoHo",
        description: "Chic studio in the heart of SoHo. Perfect for couples or solo travelers wanting to experience NYC like a local.",
        location: "SoHo, New York",
        city: "New York",
        country: "United States",
        price: 145,
        rating: 4.88,
        reviewCount: 93,
        type: "Studio",
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        additionalImages: [],
        bedrooms: 0,
        bathrooms: 1,
        maxGuests: 2,
        amenities: ["WiFi", "Smart TV", "Kitchen", "Air conditioning", "Subway access"],
        hostId: "2",
        hostName: "Sarah",
        hostImage: "https://randomuser.me/api/portraits/women/45.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080592",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVlIn0=",
        isFeatured: false
      },
      {
        name: "Classic Brooklyn Brownstone",
        description: "Experience Brooklyn living in this charming brownstone apartment with original details and modern comforts.",
        location: "Brooklyn Heights, New York",
        city: "New York",
        country: "United States",
        price: 250,
        rating: 4.95,
        reviewCount: 68,
        type: "Brownstone",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80",
        additionalImages: [],
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: ["WiFi", "Cable TV", "Fully equipped kitchen", "Backyard", "Washer/dryer"],
        hostId: "3",
        hostName: "David",
        hostImage: "https://randomuser.me/api/portraits/men/67.jpg",
        bookingWidgetUrl: "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080593",
        reviewWidgetCode: "eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVmIn0=",
        isFeatured: false
      }
    ];
    properties2.forEach((property) => this.createProperty(property));
    const luxuryApartment = Array.from(this.properties.values()).find((p) => p.name === "Luxury Apartment in Manhattan");
    if (luxuryApartment) {
      const reviews2 = [
        {
          propertyId: luxuryApartment.id,
          userId: 5,
          userName: "Sarah",
          userImage: "https://randomuser.me/api/portraits/women/45.jpg",
          rating: 5,
          comment: "This apartment exceeded our expectations! The location is perfect - easy walking distance to Central Park and many great restaurants. The space is beautifully decorated and the views are amazing. Michael was an excellent host, very responsive and helpful."
        },
        {
          propertyId: luxuryApartment.id,
          userId: 6,
          userName: "David",
          userImage: "https://randomuser.me/api/portraits/men/67.jpg",
          rating: 4.8,
          comment: "Clean, comfortable, and luxurious! The apartment looks exactly like the photos. The kitchen had everything we needed, and the beds were extremely comfortable. The location is unbeatable for exploring Manhattan. Highly recommend!"
        },
        {
          propertyId: luxuryApartment.id,
          userId: 7,
          userName: "Emma",
          userImage: "https://randomuser.me/api/portraits/women/22.jpg",
          rating: 5,
          comment: "Perfect NYC experience! The apartment is stylish and spacious, especially by New York standards. Great natural light, comfortable furniture, and all the amenities you could want. Michael was very accommodating with our check-in. Will definitely stay here again on our next visit."
        }
      ];
      reviews2.forEach((review) => this.createReview(review));
    }
    this.createUser({
      username: "testuser",
      password: "password123"
    });
  }
};
function generateSlug(name) {
  return name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

// server/storage-factory.ts
import dotenv2 from "dotenv";
dotenv2.config();
var StorageFactory = class _StorageFactory {
  static instance;
  static getStorage() {
    if (!_StorageFactory.instance) {
      _StorageFactory.instance = _StorageFactory.createStorage();
    }
    return _StorageFactory.instance;
  }
  static createStorage() {
    const useDatabase = process.env.DATABASE_URL ? true : false;
    if (useDatabase) {
      console.log("Using DatabaseStorage");
      return new DatabaseStorage();
    } else {
      console.log("Using MemStorage");
      return new MemStorage();
    }
  }
};
if (process.env.DATABASE_URL) {
  console.log("Database configuration found");
} else {
  console.warn("No DATABASE_URL found - using in-memory storage");
  console.warn("Note: Data will not persist between server restarts!");
}
var storage = StorageFactory.getStorage();

// shared/reconcile.ts
function getValueFromPath(obj, path3) {
  if (!path3) return void 0;
  const parts = path3.split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];
    if (key.endsWith("[]")) {
      const arrayKey = key.replace("[]", "");
      const nextKey = parts[i + 1];
      if (!Array.isArray(current[arrayKey])) return void 0;
      if (nextKey) {
        return current[arrayKey].map((item) => getValueFromPath(item, parts.slice(i + 1).join(".")));
      } else {
        return current[arrayKey];
      }
    }
    const match = key.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const [, arrayKey, indexStr] = match;
      const index = parseInt(indexStr, 10);
      if (!Array.isArray(current[arrayKey])) return void 0;
      current = current[arrayKey][index];
    } else {
      current = current?.[key];
    }
    if (current === void 0 || current === null) return void 0;
  }
  return current;
}
function reconcileJsonToSchema(input, interfaceName, tableName, api_json_db_matchup) {
  const fieldMappings = api_json_db_matchup[tableName] || [];
  const reconciled = {};
  for (const mapping of fieldMappings) {
    if (mapping.interfaceName === interfaceName && mapping.keyField) {
      let value = getValueFromPath(input, mapping.keyField);
      reconciled[mapping.matchedColumn] = value;
    }
  }
  if (tableName === "properties") {
    reconciled["bookingWidgetUrl"] = "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590";
    if (reconciled["bedroomDetails"] && reconciled["bedroomDetails"].length > 0) {
      let bedroomCount = 1;
      for (const bedroom of reconciled["bedroomDetails"]) {
        if (bedroom.beds && bedroom.beds.length > 0) {
          bedroom.id = bedroomCount;
          bedroom.name = bedroom.name || `Bedroom ${bedroomCount}`;
          bedroom.image = bedroom.image || null;
          bedroomCount++;
        }
      }
    }
    reconciled["rating"] = reconciled["rating"] ?? 0;
    reconciled["reviewCount"] = reconciled["reviewCount"] ?? 0;
  }
  return reconciled;
}

// client/src/lib/hospitable/client_side_reconcile.ts
function getValueFromPath2(obj, path3) {
  return path3.split(".").reduce((acc, key) => {
    if (acc === void 0 || acc === null) return void 0;
    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const arrayKey = match[1];
      const index = parseInt(match[2], 10);
      return acc[arrayKey]?.[index];
    }
    return acc[key];
  }, obj);
}
function setValueAtPath(obj, path3, value) {
  const keys = path3.split(".");
  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!(key in current)) current[key] = {};
      current = current[key];
    }
  });
}
function convertCentsToDollars(value) {
  console.log("Converting value:", value);
  return typeof value === "number" ? value / 100 : value;
}
function convertPriceFields(obj) {
  const priceKeys = [
    "basePrice",
    "cleaningFee",
    "serviceFee",
    "totalPrice",
    "subtotal",
    "payout",
    "amount"
  ];
  const converted = /* @__PURE__ */ new Set();
  for (const key of priceKeys) {
    if (typeof obj[key] === "number" && !converted.has(key)) {
      obj[key] = convertCentsToDollars(obj[key]);
      converted.add(key);
    }
    if (obj.pricing && typeof obj.pricing === "object" && typeof obj.pricing[key] === "number" && !converted.has(`pricing.${key}`)) {
      obj.pricing[key] = convertCentsToDollars(obj.pricing[key]);
      converted.add(`pricing.${key}`);
    }
  }
  for (const k in obj) {
    if (typeof obj[k] === "object" && obj[k] !== null && k !== "pricing" && // prevent double convert
    !priceKeys.includes(k)) {
      convertPriceFields(obj[k]);
    }
  }
}
function reconcileJson(wrappedData, interfaceName, endpoint, reconciliationMap, existing, isList = false, isDataArray = false) {
  const mapping = reconciliationMap[interfaceName];
  if (!mapping) {
    throw new Error(`No reconciliation map found for interface "${interfaceName}"`);
  }
  const filteredMapping = mapping.filter(
    (entry) => entry.APIEndpoint === endpoint && entry.jsonField !== null
  );
  const data = wrappedData.data;
  if (isList) {
    if (!Array.isArray(data)) {
      throw new Error(`Expected wrappedData.data to be an array because isList is true`);
    }
    return data.map((item, index) => {
      const base = Array.isArray(existing) ? existing[index] : void 0;
      const result2 = base ? structuredClone(base) : {};
      for (const entry of filteredMapping) {
        const fieldPath = entry.jsonField;
        const value = fieldPath === "" ? item : getValueFromPath2(item, fieldPath.replace(/^data\./, ""));
        if (value !== void 0) {
          setValueAtPath(result2, entry.matchedKey, value);
        }
      }
      convertPriceFields(result2);
      return result2;
    });
  }
  const result = existing ? structuredClone(existing) : {};
  const dataObj = data;
  for (const entry of filteredMapping) {
    const fieldPath = entry.jsonField;
    const value = isDataArray && fieldPath === "data" ? data : fieldPath === "" ? dataObj : getValueFromPath2(dataObj, fieldPath.replace(/^data\./, ""));
    if (value !== void 0) {
      setValueAtPath(result, entry.matchedKey, value);
    }
  }
  convertPriceFields(result);
  return result;
}

// client/src/lib/hospitable/api_matched_key.json
var api_matched_key_default = {
  Property: [
    {
      jsonField: "data.id",
      matchedKey: "id",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.public_name",
      matchedKey: "name",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.private_name",
      matchedKey: "private_name",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.picture",
      matchedKey: "imageUrl",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.description",
      matchedKey: "description",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.street",
      matchedKey: "address.street",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.latitude",
      matchedKey: "address.latitude",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.longitude",
      matchedKey: "address.longitude",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.city",
      matchedKey: "address.city",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.state",
      matchedKey: "address.state",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.zipcode",
      matchedKey: "address.zip",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.address.country_code",
      matchedKey: "address.country",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.amenities",
      matchedKey: "amenities",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.capacity.max",
      matchedKey: "capacity.guests",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.property_type",
      matchedKey: "type",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.capacity.bedrooms",
      matchedKey: "capacity.bedrooms",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.capacity.beds",
      matchedKey: "capacity.beds",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.capacity.bathrooms",
      matchedKey: "capacity.bathrooms",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.fees[?(@.name=='PASS_THROUGH_CLEANING_FEE')].fee.amount",
      matchedKey: "pricing.cleaningFee",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.fees[?(@.name=='PASS_THROUGH_MANAGEMENT_FEE')].fee.amount",
      matchedKey: "pricing.serviceFee",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.fees[0].fee.currency",
      matchedKey: "pricing.currency",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.check_in",
      matchedKey: "availability.checkIn",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.check_out",
      matchedKey: "availability.checkOut",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.channels",
      matchedKey: "channels",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.channel",
      matchedKey: "channel",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.channel.picture",
      matchedKey: "hostImage",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.channel.name",
      matchedKey: "hostName",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.channel.id",
      matchedKey: "hostId",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.details",
      matchedKey: "metadata",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data.house_rules",
      matchedKey: "metadata",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    },
    {
      jsonField: "data",
      matchedKey: "images",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}/images"
    },
    {
      jsonField: "data.dates[0].price.amount",
      matchedKey: "pricing.basePrice",
      APIEndpoint: "/api/v1/listings/{listing}/calendar"
    },
    {
      jsonField: "data.dates[0].availability.min_stay",
      matchedKey: "availability.minStay",
      APIEndpoint: "/api/v1/listings/{listing}/calendar"
    },
    {
      jsonField: "data.dates[0].availability.max_stay",
      matchedKey: "availability.maxStay",
      APIEndpoint: "/api/v1/listings/{listing}/calendar"
    },
    {
      jsonField: "data.room_details",
      matchedKey: "bedroomDetails",
      APIEndpoint: "/api/v1/customers/{customer}/listings/{listing}"
    }
  ],
  Customer: [
    {
      jsonField: "id",
      matchedKey: "id",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "name",
      matchedKey: "name",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "email",
      matchedKey: "email",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "phone",
      matchedKey: "phone",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "timezone",
      matchedKey: "timezone",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: null,
      matchedKey: "createdAt",
      APIEndpoint: null
    },
    {
      jsonField: null,
      matchedKey: "updatedAt",
      APIEndpoint: null
    },
    {
      jsonField: "data.id",
      matchedKey: "id",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "data.name",
      matchedKey: "name",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "data.email",
      matchedKey: "email",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "data.phone",
      matchedKey: "phone",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: "data.timezone",
      matchedKey: "timezone",
      APIEndpoint: "/api/v1/customers/{customer}"
    },
    {
      jsonField: null,
      matchedKey: "createdAt",
      APIEndpoint: null
    },
    {
      jsonField: null,
      matchedKey: "updatedAt",
      APIEndpoint: null
    }
  ],
  Booking: [
    {
      jsonField: "data[0].id",
      matchedKey: "id",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].arrival_date",
      matchedKey: "checkIn",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].departure_date",
      matchedKey: "checkOut",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].guests.total",
      matchedKey: "guests",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].financials.guest.total_price.amount",
      matchedKey: "totalPrice",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].status",
      matchedKey: "status",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].booking_date",
      matchedKey: "createdAt",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].check_out_local",
      matchedKey: "updatedAt",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].listing_id",
      matchedKey: "propertyId",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    },
    {
      jsonField: "data[0].guest.email",
      matchedKey: "customerId",
      APIEndpoint: "/api/v1/listings/{listing}/reservations"
    }
  ]
};

// shared/api_json_db_matchup.json
var api_json_db_matchup_default = {
  users: [
    { keyField: "id", matchedColumn: "id", interfaceName: "Customer" },
    { keyField: "name", matchedColumn: "fullName", interfaceName: "Customer" },
    { keyField: "email", matchedColumn: "email", interfaceName: "Customer" },
    { keyField: "id", matchedColumn: "password", interfaceName: "Customer" },
    { keyField: "phone", matchedColumn: "phone", interfaceName: "Customer" },
    { keyField: "id", matchedColumn: "username", interfaceName: "Customer" }
  ],
  properties: [
    { keyField: "id", matchedColumn: "id", interfaceName: "Property" },
    { keyField: "name", matchedColumn: "name", interfaceName: "Property" },
    { keyField: "private_name", matchedColumn: "location", interfaceName: "Property" },
    { keyField: "description", matchedColumn: "description", interfaceName: "Property" },
    { keyField: "address.city", matchedColumn: "city", interfaceName: "Property" },
    { keyField: "address.state", matchedColumn: "state", interfaceName: "Property" },
    { keyField: "address.zip", matchedColumn: "zip_code", interfaceName: "Property" },
    { keyField: "address.country", matchedColumn: "country", interfaceName: "Property" },
    { keyField: "address.neighborhood", matchedColumn: "neighborhood", interfaceName: "Property" },
    { keyField: "address.latitude", matchedColumn: "latitude", interfaceName: "Property" },
    { keyField: "address.longitude", matchedColumn: "longitude", interfaceName: "Property" },
    { keyField: "pricing.basePrice", matchedColumn: "price", interfaceName: "Property" },
    { keyField: "pricing.cleaningFee", matchedColumn: "cleaning_fee", interfaceName: "Property" },
    { keyField: "pricing.serviceFee", matchedColumn: "service_fee", interfaceName: "Property" },
    { keyField: "availability.minStay", matchedColumn: "min_stay", interfaceName: "Property" },
    { keyField: "availability.maxStay", matchedColumn: "max_stay", interfaceName: "Property" },
    { keyField: "rating", matchedColumn: "rating", interfaceName: "Property" },
    { keyField: "reviewsCount", matchedColumn: "review_count", interfaceName: "Property" },
    { keyField: "type", matchedColumn: "type", interfaceName: "Property" },
    { keyField: "capacity.bedrooms", matchedColumn: "bedrooms", interfaceName: "Property" },
    { keyField: "capacity.bathrooms", matchedColumn: "bathrooms", interfaceName: "Property" },
    { keyField: "capacity.guests", matchedColumn: "maxGuests", interfaceName: "Property" },
    { keyField: "amenities", matchedColumn: "amenities", interfaceName: "Property" },
    { keyField: "imageUrl", matchedColumn: "imageUrl", interfaceName: "Property" },
    { keyField: "images[].url", matchedColumn: "additional_images", interfaceName: "Property" },
    { keyField: null, matchedColumn: "location", interfaceName: null },
    { keyField: null, matchedColumn: "weekend_price", interfaceName: null },
    { keyField: null, matchedColumn: "weekly_price", interfaceName: null },
    { keyField: null, matchedColumn: "monthly_price", interfaceName: null },
    { keyField: null, matchedColumn: "tax_rate", interfaceName: null },
    { keyField: null, matchedColumn: "property_size", interfaceName: null },
    { keyField: null, matchedColumn: "year_built", interfaceName: null },
    { keyField: "bedroomDetails", matchedColumn: "bedroomDetails", interfaceName: "Property" },
    { keyField: null, matchedColumn: "video_url", interfaceName: null },
    { keyField: null, matchedColumn: "virtual_tour_url", interfaceName: null },
    { keyField: "hostId", matchedColumn: "hostId", interfaceName: "Property" },
    { keyField: "hostName", matchedColumn: "hostName", interfaceName: "Property" },
    { keyField: "hostImage", matchedColumn: "hostImage", interfaceName: "Property" },
    { keyField: "bookingWidgetUrl", matchedColumn: "bookingWidgetUrl", interfaceName: "Property" },
    { keyField: null, matchedColumn: "review_widget_code", interfaceName: null },
    { keyField: null, matchedColumn: "calendar_sync_url", interfaceName: null },
    { keyField: null, matchedColumn: "pms_id", interfaceName: null },
    { keyField: null, matchedColumn: "channel_manager_id", interfaceName: null },
    { keyField: null, matchedColumn: "external_source", interfaceName: null },
    { keyField: null, matchedColumn: "last_synced_at", interfaceName: null },
    { keyField: null, matchedColumn: "slug", interfaceName: null },
    { keyField: null, matchedColumn: "meta_title", interfaceName: null },
    { keyField: null, matchedColumn: "meta_description", interfaceName: null },
    { keyField: null, matchedColumn: "canonical_url", interfaceName: null },
    { keyField: null, matchedColumn: "keywords", interfaceName: null },
    { keyField: null, matchedColumn: "is_featured", interfaceName: null },
    { keyField: null, matchedColumn: "is_active", interfaceName: null },
    { keyField: null, matchedColumn: "is_verified", interfaceName: null },
    { keyField: null, matchedColumn: "status", interfaceName: null },
    { keyField: null, matchedColumn: "created_at", interfaceName: null },
    { keyField: null, matchedColumn: "updated_at", interfaceName: null },
    { keyField: null, matchedColumn: "published_at", interfaceName: null }
  ],
  cities: [
    { keyField: null, matchedColumn: "id", interfaceName: null },
    { keyField: null, matchedColumn: "name", interfaceName: null },
    { keyField: null, matchedColumn: "country", interfaceName: null },
    { keyField: null, matchedColumn: "state", interfaceName: null },
    { keyField: null, matchedColumn: "description", interfaceName: null },
    { keyField: null, matchedColumn: "long_description", interfaceName: null },
    { keyField: null, matchedColumn: "latitude", interfaceName: null },
    { keyField: null, matchedColumn: "longitude", interfaceName: null },
    { keyField: null, matchedColumn: "image_url", interfaceName: null },
    { keyField: null, matchedColumn: "additional_images", interfaceName: null },
    { keyField: null, matchedColumn: "property_count", interfaceName: null },
    { keyField: null, matchedColumn: "featured", interfaceName: null },
    { keyField: null, matchedColumn: "slug", interfaceName: null },
    { keyField: null, matchedColumn: "meta_title", interfaceName: null },
    { keyField: null, matchedColumn: "meta_description", interfaceName: null },
    { keyField: null, matchedColumn: "keywords", interfaceName: null },
    { keyField: null, matchedColumn: "created_at", interfaceName: null },
    { keyField: null, matchedColumn: "updated_at", interfaceName: null }
  ],
  reviews: [
    { keyField: null, matchedColumn: "id", interfaceName: null },
    { keyField: "propertyId", matchedColumn: "property_id", interfaceName: "Booking" },
    { keyField: "customerId", matchedColumn: "user_id", interfaceName: "Booking" },
    { keyField: null, matchedColumn: "user_name", interfaceName: null },
    { keyField: null, matchedColumn: "user_image", interfaceName: null },
    { keyField: "rating", matchedColumn: "rating", interfaceName: "Property" },
    { keyField: null, matchedColumn: "title", interfaceName: null },
    { keyField: null, matchedColumn: "comment", interfaceName: null },
    { keyField: null, matchedColumn: "response", interfaceName: null },
    { keyField: null, matchedColumn: "response_date", interfaceName: null },
    { keyField: null, matchedColumn: "is_verified", interfaceName: null },
    { keyField: null, matchedColumn: "date", interfaceName: null }
  ],
  neighborhoods: [
    { keyField: null, matchedColumn: "id", interfaceName: null },
    { keyField: "address.neighborhood", matchedColumn: "name", interfaceName: "Property" },
    { keyField: null, matchedColumn: "city_id", interfaceName: null },
    { keyField: null, matchedColumn: "description", interfaceName: null },
    { keyField: null, matchedColumn: "long_description", interfaceName: null },
    { keyField: "address.latitude", matchedColumn: "latitude", interfaceName: "Property" },
    { keyField: "address.longitude", matchedColumn: "longitude", interfaceName: "Property" },
    { keyField: null, matchedColumn: "image_url", interfaceName: null },
    { keyField: null, matchedColumn: "additional_images", interfaceName: null },
    { keyField: null, matchedColumn: "property_count", interfaceName: null },
    { keyField: null, matchedColumn: "slug", interfaceName: null },
    { keyField: null, matchedColumn: "meta_title", interfaceName: null },
    { keyField: null, matchedColumn: "meta_description", interfaceName: null },
    { keyField: null, matchedColumn: "created_at", interfaceName: null },
    { keyField: null, matchedColumn: "updated_at", interfaceName: null }
  ],
  favorites: [
    { keyField: "customerId", matchedColumn: "user_id", interfaceName: "Booking" },
    { keyField: "propertyId", matchedColumn: "property_id", interfaceName: "Booking" },
    { keyField: null, matchedColumn: "id", interfaceName: null },
    { keyField: null, matchedColumn: "created_at", interfaceName: null }
  ],
  api_integrations: [
    { keyField: null, matchedColumn: "id", interfaceName: null },
    { keyField: null, matchedColumn: "name", interfaceName: null },
    { keyField: null, matchedColumn: "service_type", interfaceName: null },
    { keyField: null, matchedColumn: "api_key", interfaceName: null },
    { keyField: null, matchedColumn: "api_secret", interfaceName: null },
    { keyField: null, matchedColumn: "base_url", interfaceName: null },
    { keyField: null, matchedColumn: "is_active", interfaceName: null },
    { keyField: null, matchedColumn: "last_synced_at", interfaceName: null },
    { keyField: null, matchedColumn: "sync_frequency", interfaceName: null },
    { keyField: null, matchedColumn: "created_at", interfaceName: null },
    { keyField: null, matchedColumn: "updated_at", interfaceName: null }
  ]
};

// server/routes.ts
import { z } from "zod";

// client/src/lib/hospitable/api-client.ts
var HospitableAPI = class {
  baseUrl;
  apiToken;
  defaultHeaders;
  defaultCache;
  defaultRevalidate;
  constructor(config) {
    this.baseUrl = config.baseUrl.endsWith("/") ? config.baseUrl.slice(0, -1) : config.baseUrl;
    this.apiToken = config.apiToken;
    this.defaultHeaders = {
      "Authorization": `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Connect-Version": "2024-01",
      ...config.defaultHeaders
    };
    this.defaultCache = config.defaultCache ?? "no-store";
    this.defaultRevalidate = config.defaultRevalidate ?? 60;
  }
  async request(path3, options = {}) {
    console.log(`The base url is: ${this.baseUrl}`);
    const fullPath = path3.startsWith("/") ? path3 : `/${path3}`;
    const url = new URL(fullPath, this.baseUrl);
    const fetchOptions = {
      method: options.method ?? "GET",
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : void 0,
      cache: options.cache ?? this.defaultCache
    };
    console.log(`[HospitableAPI] ${fetchOptions.method} ${url.toString()}`);
    if (fetchOptions.body) {
      console.log(`[HospitableAPI] Request body: ${fetchOptions.body}`);
    }
    try {
      const response = await fetch(url.toString(), fetchOptions);
      const responseText = await response.text();
      console.log(`[HospitableAPI] Response status: ${response.status}`);
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: `Non-JSON error. Status: ${response.status}`, raw: responseText };
        }
        const errorDetails = {
          name: "APIError",
          message: errorData.message || `HTTP error! status: ${response.status}`,
          code: errorData.code || "API_ERROR",
          status: response.status,
          raw: responseText
        };
        console.error("[HospitableAPI] Error details:", errorDetails);
        throw errorDetails;
      }
      return JSON.parse(responseText);
    } catch (error) {
      console.error("[HospitableAPI] API request failed:", error);
      const hospError = {
        name: error.name || "APIError",
        message: error.message || "Unknown API error",
        code: error.code || "API_ERROR",
        status: error.status || 500
      };
      throw hospError;
    }
  }
  async getProperties(customerId) {
    const response = await this.request(`/api/v1/customers/${customerId}/listings`);
    const reconciled = reconcileJson(
      response,
      "Property",
      "/api/v1/customers/{customer}/listings/{listing}",
      api_matched_key_default,
      void 0,
      true
    );
    const finalReconciled = [];
    for (const property of reconciled) {
      const propertyId = property.id;
      const propertyResponse = await this.getProperty(propertyId, customerId);
      finalReconciled.push(propertyResponse);
      console.log(`Fetched property ${propertyId} from Hospitable API`);
      let alreadyExists = false;
      try {
        const checkRes = await fetch(`/api/properties/${customerId}/${propertyId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (checkRes.ok) {
          const respJson = await checkRes.json();
          console.log(`Property ${propertyId} exists in DB:`, respJson);
          const respText = await checkRes.text();
          console.log(`Property ${propertyId} exists in DB:`, respText);
          console.log(`Property ${propertyId} already exists in DB, skipping save.`);
          alreadyExists = true;
        } else if (checkRes.status !== 404) {
          const errText = await checkRes.text();
          console.error(`Unexpected response when checking property: ${checkRes.status}`, errText);
        }
      } catch (err) {
        console.error(`Failed to check if property ${propertyId} exists:`, err);
      }
      if (!alreadyExists) {
        try {
          const reconciledProperty = reconcileJsonToSchema(
            propertyResponse,
            "Property",
            "properties",
            api_json_db_matchup_default
          );
          console.log(JSON.stringify(reconciledProperty));
          const createRes = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reconciledProperty)
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
  async getProperty(id, customerId) {
    const propResponse = await this.request(`/api/v1/customers/${customerId}/listings/${id}`);
    const imageResponse = await this.request(`/api/v1/customers/${customerId}/listings/${id}/images`);
    const pricingResponse = await this.request(`/api/v1/listings/${id}/calendar`);
    const reconciled = reconcileJson(propResponse, "Property", "/api/v1/customers/{customer}/listings/{listing}", api_matched_key_default, void 0, false);
    const reconciledMiddle = reconcileJson(imageResponse, "Property", "/api/v1/customers/{customer}/listings/{listing}/images", api_matched_key_default, reconciled, false, true);
    const reconciledFinal = reconcileJson(pricingResponse, "Property", "/api/v1/listings/{listing}/calendar", api_matched_key_default, reconciledMiddle, false);
    return reconciledFinal;
  }
  async createProperty(property) {
    const response = await this.request("/properties", {
      method: "POST",
      body: property
    });
    return response.data;
  }
  async updateProperty(id, property) {
    const response = await this.request(`/properties/${id}`, {
      method: "PATCH",
      body: property
    });
    return response.data;
  }
  async deleteProperty(id) {
    await this.request(`/properties/${id}`, {
      method: "DELETE"
    });
  }
  // Customer endpoints
  async getCustomers() {
    const response = await this.request("/customers");
    return response.data;
  }
  async getCustomer(id) {
    const response = await this.request(`/customers/${id}`);
    return response.data;
  }
  async createCustomer(customer) {
    const response = await this.request("/customers", {
      method: "POST",
      body: customer
    });
    return response.data;
  }
  // Booking endpoints
  async getBookings(filters) {
    const params = new URLSearchParams();
    if (filters?.propertyId) params.append("propertyId", filters.propertyId);
    if (filters?.customerId) params.append("customerId", filters.customerId);
    const response = await this.request(`/bookings?${params.toString()}`);
    return response.data;
  }
  async createBooking(booking) {
    const response = await this.request("/bookings", {
      method: "POST",
      body: booking
    });
    return response.data;
  }
  async updateBookingStatus(id, status) {
    const response = await this.request(`/bookings/${id}/status`, {
      method: "PATCH",
      body: { status }
    });
    return response.data;
  }
};

// client/src/lib/hospitable/config.ts
var getEnv = (key, defaultValue = "") => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  } else if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};
var HOSPITABLE_CONFIG = {
  API_BASE_URL: getEnv("VITE_HOSPITABLE_API_URL", "https://connect.hospitable.com/api/v1"),
  API_VERSION: "2024-01",
  DEFAULT_CACHE_DURATION: 60
  // seconds
};
console.log("Using Hospitable API base URL:", HOSPITABLE_CONFIG.API_BASE_URL);
function getServerConfig() {
  const platformToken = getEnv("HOSPITABLE_PLATFORM_TOKEN");
  if (!platformToken) {
    throw new Error("HOSPITABLE_PLATFORM_TOKEN is not set. Please add it to your environment variables.");
  }
  return {
    PLATFORM_TOKEN: platformToken
  };
}

// client/src/lib/hospitable/server-utils.ts
function createServerApiClient() {
  try {
    const { PLATFORM_TOKEN } = getServerConfig();
    return new HospitableAPI({
      baseUrl: HOSPITABLE_CONFIG.API_BASE_URL,
      apiToken: PLATFORM_TOKEN,
      defaultCache: "no-store"
      // For server-side, default to no caching
    });
  } catch (error) {
    console.error("Failed to create server API client:", error);
    throw error;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/properties", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const properties2 = await storage.getProperties(limit, offset);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("/api/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 4;
      const properties2 = await storage.getFeaturedProperties(limit);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });
  app2.get("/api/properties/search", async (req, res) => {
    try {
      const query = req.query.q || "";
      const filters = req.query.filters ? JSON.parse(req.query.filters) : void 0;
      const properties2 = await storage.searchProperties(query, filters);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search properties" });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
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
  app2.post("/api/properties", async (req, res) => {
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
  app2.get("api/properties/:user_id", async (req, res) => {
    try {
      const userId = req.params.user_id;
      console.log("Fetching properties for user:", userId);
      const properties2 = await storage.getPropertiesByCustomer(userId);
      if (!properties2) {
        return res.status(404).json({ message: "No properties found for this user" });
      }
      res.json(properties2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user ID", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("api/properties/:user_id/:id", async (req, res) => {
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
  app2.patch("/api/properties/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const propertyData = req.body;
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
  app2.get("/api/cities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const cities2 = await storage.getCities(limit);
      res.json(cities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  app2.get("/api/cities/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 4;
      const cities2 = await storage.getFeaturedCities(limit);
      res.json(cities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured cities" });
    }
  });
  app2.get("/api/cities/:name", async (req, res) => {
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
  app2.post("/api/cities", async (req, res) => {
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
  app2.get("/api/cities/:name/properties", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const properties2 = await storage.getPropertiesByCity(req.params.name, limit, offset);
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch city properties" });
    }
  });
  app2.get("/api/cities/:id/neighborhoods", async (req, res) => {
    try {
      const cityId = parseInt(req.params.id);
      const neighborhoods2 = await storage.getNeighborhoods(cityId);
      res.json(neighborhoods2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch neighborhoods" });
    }
  });
  app2.get("/api/properties/:id/reviews", async (req, res) => {
    try {
      const propertyId = req.params.id;
      const reviews2 = await storage.getReviews(propertyId);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
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
  app2.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites2 = await storage.getFavorites(userId);
      res.json(favorites2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  app2.post("/api/favorites", async (req, res) => {
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
  app2.delete("/api/favorites", async (req, res) => {
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
  app2.get("/api/favorites/check", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      const propertyId = parseInt(req.query.propertyId);
      if (isNaN(userId) || isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid userId or propertyId" });
      }
      const isFavorite = await storage.isFavorite(userId, propertyId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });
  const hospitable = {
    // properties: '/api/hospitable/properties',
    // property: '/api/hospitable/properties/:id',
    // customers: '/api/hospitable/customers',
    // customer: '/api/hospitable/customers/:id',
    bookings: "/api/hospitable/bookings",
    booking: "/api/hospitable/bookings/:id",
    // New dynamic customer routes:
    properties: "/api/hospitable/customers/:customerId/listings",
    property: "/api/hospitable/customers/:customerId/listings/:id",
    customers: "/api/hospitable/customers",
    customer: "/api/hospitable/customers/:id"
  };
  const requireHospitableToken = (req, res, next) => {
    try {
      createServerApiClient();
      next();
    } catch (error) {
      res.status(500).json({
        message: "Hospitable API connection error",
        error: error.message || "Missing API token"
      });
    }
  };
  app2.use([
    hospitable.properties,
    hospitable.property,
    hospitable.customers,
    hospitable.customer,
    hospitable.bookings,
    hospitable.booking
  ], requireHospitableToken);
  app2.get(hospitable.properties, async (req, res) => {
    const customerId = req.params.customerId;
    if (!customerId) {
      return res.status(400).json({ message: "Missing customerId in request URL." });
    }
    try {
      const api = createServerApiClient();
      const properties2 = await api.getProperties(customerId);
      res.json(properties2);
    } catch (error) {
      console.error("Hospitable API Error (getProperties):", error);
      res.status(500).json({
        message: "Failed to fetch properties from Hospitable",
        error: error.message,
        details: error.code ? { code: error.code, status: error.status } : void 0
      });
    }
  });
  app2.get(hospitable.properties, async (req, res) => {
    const customerId = req.params.customerId;
    if (!customerId) {
      return res.status(400).json({ message: "Missing customerId in request URL." });
    }
    try {
      const api = createServerApiClient();
      const properties2 = await api.getProperties(customerId);
      res.json(properties2);
    } catch (error) {
      console.error("Hospitable API Error (getProperties):", error);
      res.status(500).json({
        message: "Failed to fetch properties from Hospitable",
        error: error.message,
        details: error.code ? { code: error.code, status: error.status } : void 0
      });
    }
  });
  app2.post(hospitable.properties, async (req, res) => {
    try {
      const api = createServerApiClient();
      const property = await api.createProperty(req.body);
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to create property in Hospitable", error: error.message });
    }
  });
  app2.get(hospitable.customers, async (req, res) => {
    try {
      const api = createServerApiClient();
      const customers = await api.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers from Hospitable", error: error.message });
    }
  });
  app2.get(hospitable.customer, async (req, res) => {
    try {
      const api = createServerApiClient();
      const customer = await api.getCustomer(req.params.id);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer from Hospitable", error: error.message });
    }
  });
  app2.get(hospitable.bookings, async (req, res) => {
    try {
      const api = createServerApiClient();
      const filters = {
        propertyId: req.query.propertyId,
        customerId: req.query.customerId
      };
      const bookings = await api.getBookings(filters);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings from Hospitable", error: error.message });
    }
  });
  app2.post(hospitable.bookings, async (req, res) => {
    try {
      const api = createServerApiClient();
      const booking = await api.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking in Hospitable", error: error.message });
    }
  });
  app2.patch(`${hospitable.booking}/status`, async (req, res) => {
    try {
      const api = createServerApiClient();
      const { status } = req.body;
      const booking = await api.updateBookingStatus(req.params.id, status);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status in Hospitable", error: error.message });
    }
  });
  app2.post("/api/customer-lookup", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Missing fields" });
    const existing = await storage.getUserByEmailFullname(email, name);
    if (existing) {
      return res.json({ customer_id: existing.username.replace(/^user_/, "") });
    }
    const hospitableRes = await fetch("https://connect.hospitable.com/api/v1/customers", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.HOSPITABLE_PLATFORM_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connect-Version": "2024-01"
      }
    });
    if (!hospitableRes.ok) {
      const error = await hospitableRes.text();
      console.error("Hospitable API Error:", error);
      return res.status(500).json({ message: "Hospitable API failed", error });
    }
    const { data: customers } = await hospitableRes.json();
    const match = customers.find((c) => c.email === email || c.name === name);
    if (!match) {
      return res.status(404).json({ message: "Customer not found in Hospitable" });
    }
    try {
      const matchedCustomer = { data: match };
      console.log("Reconciliation process started for customer:", matchedCustomer);
      const fromattedResponse = reconcileJson(matchedCustomer, "Customer", "/api/v1/customers/{customer}", api_matched_key_default, void 0, false);
      console.log("Formatted response:", fromattedResponse);
      const reconciled = reconcileJsonToSchema(fromattedResponse, "Customer", "users", api_json_db_matchup_default);
      const { id, ...reconciledWithoutId } = reconciled;
      console.log("Reconciled customer data:", reconciledWithoutId);
      const customer = await storage.createUser({
        username: `user_${reconciled.id}`,
        password: reconciled.id,
        // TODO: Replace with secure password logic
        email: reconciledWithoutId.email ?? null,
        phone: reconciledWithoutId.phone ?? null,
        fullName: reconciledWithoutId.fullName ?? null,
        ...reconciledWithoutId
      });
      console.log("Customer reconciled and saved to DB:", customer);
    } catch (error) {
      console.error("Error reconciling customer data and saving to DB:", error);
    }
    return res.json({ customer_id: match.id });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // to 👇
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    // ✅ expected by serveStatic()
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    console.log("Catch-all hit:", req.originalUrl);
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      console.log("Resolved client path:", clientTemplate);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import http from "http";
import https from "https";
var app = express2();
app.use((req, _res, next) => {
  const fullUrl = `${req.method}: ${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log("[request] Full URL:", fullUrl);
  next();
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
var originalHttpRequest = http.request;
http.request = function(url, options, callback) {
  const method = typeof url === "object" && "method" in url ? url.method : "GET";
  let fullUrl = "";
  if (typeof url === "string") {
    fullUrl = url;
  } else if (url instanceof URL) {
    fullUrl = url.href;
  } else if (typeof url === "object") {
    fullUrl = `${url.protocol || "http:"}//${url.hostname}${url.path || ""}`;
  }
  console.log(`[outgoing request] ${method} ${fullUrl}`);
  return typeof options === "function" ? originalHttpRequest.call(http, url, options) : originalHttpRequest.call(http, url, options, callback);
};
var originalHttpsRequest = https.request;
https.request = function(url, options, callback) {
  const method = typeof url === "object" && "method" in url ? url.method : "GET";
  let fullUrl = "";
  if (typeof url === "string") {
    fullUrl = url;
  } else if (url instanceof URL) {
    fullUrl = url.href;
  } else if (typeof url === "object") {
    fullUrl = `${url.protocol || "https:"}//${url.hostname}${url.path || ""}`;
  }
  console.log(`[outgoing request] ${method} ${fullUrl}`);
  return typeof options === "function" ? originalHttpsRequest.call(https, url, options) : originalHttpsRequest.call(https, url, options, callback);
};
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  ).on("error", (err) => {
    console.error(`\u274C Failed to start server on port ${port}:`, err.message);
    process.exit(1);
  });
})();
