// reconcileJsonToSchema.ts
// Update the import path below to the correct location of your types file
import { Property, Customer, Booking } from '../client/src/lib/hospitable/types';
// If the above path is incorrect, adjust it to match your project structure
import {
  InsertProperty,
  InsertCity,
  InsertReview,
  InsertNeighborhood,
  InsertFavorite,
  InsertApiIntegration
} from './schema';

/**
 * Utility function to get value from nested key path (dot notation)
 */
function getValueFromPath(obj: any, path: string): any {
  if (!path) return undefined;

  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];

    // Handle array mapping: images[].url
    if (key.endsWith('[]')) {
      const arrayKey = key.replace('[]', '');
      const nextKey = parts[i + 1];

      if (!Array.isArray(current[arrayKey])) return undefined;

      if (nextKey) {
        // Map to inner property like `url`
        return current[arrayKey].map(item => getValueFromPath(item, parts.slice(i + 1).join('.')));
      } else {
        // Map to item directly
        return current[arrayKey];
      }
    }

    // Handle array indexing: images[0].url
    const match = key.match(/(\w+)\[(\d+)\]/); // <-- FIXED regex
    if (match) {
      const [, arrayKey, indexStr] = match;
      const index = parseInt(indexStr, 10);
      if (!Array.isArray(current[arrayKey])) return undefined;
      current = current[arrayKey][index];
    } else {
      current = current?.[key];
    }

    if (current === undefined || current === null) return undefined;
  }

  return current;
}

/**
 * Reconcile JSON from API format to DB schema format
 */
export function reconcileJsonToSchema<T>(
  input: T,
  interfaceName: string,
  tableName: string,
  api_json_db_matchup: Record<string, Array<{ keyField: string | null; matchedColumn: string; interfaceName: string | null }>>
): Record<string, any> {
  const fieldMappings = api_json_db_matchup[tableName] || [];

  const reconciled: Record<string, any> = {};

  for (const mapping of fieldMappings) {
    if (mapping.interfaceName === interfaceName && mapping.keyField) {
      let value = getValueFromPath(input, mapping.keyField);

      reconciled[mapping.matchedColumn] = value;
    }
  }

  // Post-processing logic specific to the "properties" table
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

    reconciled["rating"] = reconciled["rating"] ?? 0.0;
    reconciled["reviewCount"] = reconciled["reviewCount"] ?? 0;
  }

  return reconciled;
}

export function reconcileJsonToSchemaAlter(
  dbJson: Record<string, any>,
  interfaceName: string,
  tableName: string,
  api_json_db_matchup: Record<string, Array<{ keyField: string | null; matchedColumn: string; interfaceName: string | null }>>
): Record<string, any> {
  const fieldMappings = api_json_db_matchup[tableName] || [];
  const reconstructed: Record<string, any> = {};

  function setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.endsWith('[]')) {
        const arrayKey = key.replace('[]', '');
        current[arrayKey] = value;
        return;
      }
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
  }

  for (const mapping of fieldMappings) {
    if (mapping.interfaceName === interfaceName && mapping.keyField && mapping.matchedColumn in dbJson) {
      const value = dbJson[mapping.matchedColumn];
      setNestedValue(reconstructed, mapping.keyField, value);
    }
  }

  return reconstructed;
}

// Example Usage:
// const formatted = reconcileJsonToSchema(apiResponseJson, 'Property', 'properties', api_json_db_matchup);
