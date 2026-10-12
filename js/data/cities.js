/**
 * Mock city / airport list for the departure autocomplete.
 * `region` drives flight times, prices and currency (AU, EU, NA, AS).
 */

/** @type {{name:string,country:string,code:string,region:'AU'|'EU'|'NA'|'AS'}[]} */
export const CITIES = [
  { name: 'Melbourne', country: 'Australia', code: 'MEL', region: 'AU' },
  { name: 'Sydney', country: 'Australia', code: 'SYD', region: 'AU' },
  { name: 'Brisbane', country: 'Australia', code: 'BNE', region: 'AU' },
  { name: 'Perth', country: 'Australia', code: 'PER', region: 'AU' },
  { name: 'Adelaide', country: 'Australia', code: 'ADL', region: 'AU' },
  { name: 'Auckland', country: 'New Zealand', code: 'AKL', region: 'AU' },
  { name: 'London', country: 'United Kingdom', code: 'LHR', region: 'EU' },
  { name: 'Manchester', country: 'United Kingdom', code: 'MAN', region: 'EU' },
  { name: 'Dublin', country: 'Ireland', code: 'DUB', region: 'EU' },
  { name: 'Paris', country: 'France', code: 'CDG', region: 'EU' },
  { name: 'Berlin', country: 'Germany', code: 'BER', region: 'EU' },
  { name: 'Amsterdam', country: 'Netherlands', code: 'AMS', region: 'EU' },
  { name: 'New York', country: 'United States', code: 'JFK', region: 'NA' },
  { name: 'Los Angeles', country: 'United States', code: 'LAX', region: 'NA' },
  { name: 'Toronto', country: 'Canada', code: 'YYZ', region: 'NA' },
  { name: 'Chicago', country: 'United States', code: 'ORD', region: 'NA' },
  { name: 'Singapore', country: 'Singapore', code: 'SIN', region: 'AS' },
  { name: 'Tokyo', country: 'Japan', code: 'HND', region: 'AS' },
  { name: 'Hong Kong', country: 'Hong Kong', code: 'HKG', region: 'AS' },
  { name: 'Bangkok', country: 'Thailand', code: 'BKK', region: 'AS' },
  { name: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL', region: 'AS' },
  { name: 'Dubai', country: 'UAE', code: 'DXB', region: 'AS' },
];

export const DEFAULT_REGION = 'AU';

export const CURRENCY_SYMBOL = { AU: 'A$', EU: '€', NA: 'US$', AS: 'US$' };

/** Region for a free-text departure ("Melbourne (MEL)"). Unknown text → AU. */
export const regionOf = (text) => {
  const lower = (text || '').toLowerCase();
  const match = CITIES.find((city) => lower.startsWith(city.name.toLowerCase()));
  return match ? match.region : DEFAULT_REGION;
};

/** "Melbourne (MEL)" → "Melbourne". */
export const cityName = (text) => (text || '').replace(/\s*\(.*\)/, '');

/** Autocomplete matches for what the user has typed so far. */
export const searchCities = (query, limit = 6) => {
  const q = (query || '').toLowerCase();
  return CITIES.filter(
    (city) =>
      !q ||
      city.name.toLowerCase().startsWith(q) ||
      city.code.toLowerCase() === q ||
      city.country.toLowerCase().startsWith(q),
  ).slice(0, limit);
};
