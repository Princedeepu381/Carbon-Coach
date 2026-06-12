// src/lib/emissionFactors.ts

/**
 * Carbon emission factors for various activities
 * All values are in kg CO2 per unit (km, meal, kWh, item, etc.)
 * Based on India-specific data where applicable
 */
export const EMISSION_FACTORS = {
  transport: {
    car_petrol: 0.21,         // kg CO2 per km
    car_diesel: 0.17,
    car_electric: 0.05,
    bus: 0.089,
    metro: 0.041,
    bicycle: 0.0,
    walking: 0.0,
    flight_domestic: 0.255,   // kg CO2 per km
    flight_long: 0.195,
    auto_rickshaw: 0.097,
  },
  food: {
    beef_meal: 3.0,          // kg CO2 per meal
    chicken_meal: 0.9,
    fish_meal: 0.51,
    vegetarian_meal: 0.45,
    vegan_meal: 0.28,
    dairy_meal: 1.2,
    food_delivery: 0.08,     // packaging overhead per delivery order
  },
  energy: {
    electricity_kwh: 0.233,   // India average grid factor
    gas_kwh: 0.184,
    ac_per_hour: 1.23,
    led_bulb_per_hour: 0.009,
  },
  shopping: {
    clothing_item: 10.0,      // average carbon footprint of a fast fashion piece
    electronics_item: 70.0,   // average footprint of small electronics
    electronics_laptop: 300.0,
    online_delivery: 0.5,    // packaging & transport per package
  },
};

export type CategoryType = keyof typeof EMISSION_FACTORS;

/**
 * Calculates carbon emissions for a given activity
 * @param category - Activity category (transport, food, energy, shopping)
 * @param subType - Specific activity type within the category
 * @param quantity - Amount of activity (km, meals, kWh, items)
 * @returns Carbon emission in kg CO2
 * @throws Error if quantity is negative or category is unknown
 */
export function calculateEmission(category: CategoryType, subType: string, quantity: number): number {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }
  
  const categoryFactors = EMISSION_FACTORS[category];
  if (!categoryFactors) {
    throw new Error(`Unknown category: ${category}`);
  }

  const factor = (categoryFactors as Record<string, number>)[subType];
  if (factor === undefined) {
    return 0; // Default factor is 0 if subtype not found (e.g. customized entries)
  }

  return quantity * factor;
}
