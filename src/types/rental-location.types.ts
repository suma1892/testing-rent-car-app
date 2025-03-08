export interface IRentalLocationResult {
  currency: any;
  id: number;
  name: string;
  time_zone: string;
  time_zone_identifier: string;
}

export interface IAirportLocationResult {
  garages: any;
  airport_location_type: {
    id: number;
    name: string;
  };
  airport_location_type_id: number;
  id: number;
  location: {
    is_special_airport_transfer: boolean;
    currency: any;
    id: number;
    name: string;
    time_zone: string;
    time_zone_identifier: string;
  };
  location_id: number;
  name: string;
  time_zone: string;
  time_zone_identifier: string;
}

export interface Facility {
  id: number;
  name: string;
  location: string | null;
  icon: string;
  facilities: Facility[] | null;
}

export interface SubService {
  id: number;
  name: string;
  location: string | null;
  icon: string;
  facilities: Facility[];
}

export interface IService {
  id: number;
  name: string;
  sub_services: SubService[];
  icon: string;
}
