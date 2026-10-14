/**
 * Helpers for "where are we flying from?" — shared by the routes panel
 * and the planner. Every lookup falls back to a sensible default so a
 * missing or odd departure city can never crash a screen.
 */
import { DEFAULT_REGION, priceFactorOf, regionOf } from '../data/cities.js';

export const DEFAULT_ORIGIN = 'Melbourne (MEL)';

/** The trip's distinct, non-empty departure cities (always at least one). */
export const getOrigins = (trip) => {
  const origins = [...new Set((trip?.origins ?? []).filter(Boolean))];
  return origins.length ? origins : [DEFAULT_ORIGIN];
};

/**
 * Flight details for a destination from a region: { hours, stops, price }.
 * Falls back to the default region if the destination has no data for it.
 */
export const flightsFrom = (destination, region) => destination.flights[region] ?? destination.flights[DEFAULT_REGION];

/** Flight price as a number ("1,580" → 1580). Pass the departure city to get that city's fare, not just the region's. */
export const flightPrice = (destination, region, origin) => {
  const base = Number(String(flightsFrom(destination, region).price).replace(/,/g, '')) || 0;
  return origin ? Math.round((base * priceFactorOf(origin)) / 5) * 5 : base;
};

export { regionOf };
