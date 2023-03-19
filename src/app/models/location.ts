export interface Location {
  id: string;
  name: string;
  description: string;
  lat: number | null;
  lng: number | null;
  type: LocationType | null;
  logo: string | null;
}

export enum LocationType {
  BUSINESS = 'Business',
  BANK = 'Bank',
  BAR = 'Bar',
  GYM = 'Gym',
  PARK = 'Park',
}
export const locationTypes = [
  LocationType.BANK,
  LocationType.BAR,
  LocationType.BUSINESS,
  LocationType.GYM,
  LocationType.PARK,
];
