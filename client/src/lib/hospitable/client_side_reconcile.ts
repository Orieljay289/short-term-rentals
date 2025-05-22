import { Property, Customer, Booking } from './types';
import reconciliationMap from './api_matched_key.json';

function getValueFromPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;

    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const arrayKey = match[1];
      const index = parseInt(match[2], 10);
      return acc[arrayKey]?.[index];
    }

    return acc[key];
  }, obj);
}

function setValueAtPath(obj: any, path: string, value: any): void {
  const keys = path.split('.');
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

function convertCentsToDollars(value: any): any {
  console.log('Converting value:', value);
  return typeof value === 'number' ? value / 100 : value;
}

function convertPriceFields(obj: any): void {
  const priceKeys = [
    'basePrice',
    'cleaningFee',
    'serviceFee',
    'totalPrice',
    'subtotal',
    'payout',
    'amount',
  ];

  const converted = new Set<string>();

  for (const key of priceKeys) {
    if (typeof obj[key] === 'number' && !converted.has(key)) {
      obj[key] = convertCentsToDollars(obj[key]);
      converted.add(key);
    }

    if (obj.pricing && typeof obj.pricing === 'object' && typeof obj.pricing[key] === 'number' && !converted.has(`pricing.${key}`)) {
      obj.pricing[key] = convertCentsToDollars(obj.pricing[key]);
      converted.add(`pricing.${key}`);
    }
  }

  // Recurse only into non-price nested fields
  for (const k in obj) {
    if (
      typeof obj[k] === 'object' &&
      obj[k] !== null &&
      k !== 'pricing' && // prevent double convert
      !priceKeys.includes(k)
    ) {
      convertPriceFields(obj[k]);
    }
  }
}


/**
 * Generic reconciliation function that transforms Hospitable API JSON into structured interface objects.
 *
 * @param wrappedData - API response shape: { data: object | object[] }
 * @param interfaceName - Interface name from types.ts (e.g. 'Property')
 * @param endpoint - API endpoint string used for matching mapping entries
 * @param reconciliationMap - Parsed contents of api_matched_key.json
 * @param existing - Optional object(s) to merge into (partial T or T[])
 * @param isList - Set to true if the response contains an array of objects
 */

export function reconcileJson<T>(
  wrappedData: { data: any },
  interfaceName: string,
  endpoint: string,
  reconciliationMap: Record<string, { jsonField: string | null; matchedKey: string; APIEndpoint: string | null }[]>,
  existing: Partial<T>[] | undefined,
  isList: true,
  isDataArray?: boolean
): T[];

export function reconcileJson<T>(
  wrappedData: { data: any },
  interfaceName: string,
  endpoint: string,
  reconciliationMap: Record<string, { jsonField: string | null; matchedKey: string; APIEndpoint: string | null }[]>,
  existing?: Partial<T>,
  isList?: false,
  isDataArray?: boolean
): T;

export function reconcileJson<T = unknown>(
  wrappedData: { data: any },
  interfaceName: string,
  endpoint: string,
  reconciliationMap: Record<string, { jsonField: string | null; matchedKey: string; APIEndpoint: string | null }[]>,
  existing?: Partial<T> | Partial<T>[],
  isList: boolean = false,
  isDataArray: boolean = false
): T | T[] {
  const mapping = reconciliationMap[interfaceName];
  if (!mapping) {
    throw new Error(`No reconciliation map found for interface "${interfaceName}"`);
  }

  const filteredMapping = mapping.filter(
    (entry) => entry.APIEndpoint === endpoint && entry.jsonField !== null
  );

  const data = wrappedData.data;

  // 🔁 List mode
  if (isList) {
    if (!Array.isArray(data)) {
      throw new Error(`Expected wrappedData.data to be an array because isList is true`);
    }

    return data.map((item, index) => {
      const base = Array.isArray(existing) ? existing[index] : undefined;
      const result: Record<string, any> = base ? structuredClone(base) : {};

      for (const entry of filteredMapping) {
        const fieldPath = entry.jsonField!;
        const value = fieldPath === '' ? item : getValueFromPath(item, fieldPath.replace(/^data\./, ''));
        if (value !== undefined) {
          setValueAtPath(result, entry.matchedKey, value);
        }
      }

      convertPriceFields(result);
      return result as T;
    });
  }

  // 🧩 Single object mode
  const result: Record<string, any> = existing ? structuredClone(existing) : {};
  const dataObj = data;

  for (const entry of filteredMapping) {
    const fieldPath = entry.jsonField!;
    const value =
      isDataArray && fieldPath === 'data'
        ? data
        : fieldPath === ''
        ? dataObj
        : getValueFromPath(dataObj, fieldPath.replace(/^data\./, ''));

    if (value !== undefined) {
      setValueAtPath(result, entry.matchedKey, value);
    }
  }

  convertPriceFields(result);
  return result as T;
}