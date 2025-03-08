export type IVehicles = {
  is_valid_for_order: any;
  minimal_rental_day: number;
  brand_name: string;
  disablility_allowed: boolean;
  id: number;
  license_number: string;
  max_passanger: number;
  min_suitcase: number;
  max_suitcase: number;
  name: string;
  pet_allowed: boolean;
  photo: {id: number; name: string}[];
  price: number;
  price_with_driver: number;
  slash_price: number;
  smoke_allowed: boolean;
  status: string;
  year: number;
  discount_price: number;
  old_price: number;
  status_order: 'available' | 'booked';
  transmission: 'manual' | 'matic';
  category: {
    id: number;
    name: string;
  };
  garage_data: {
    address_details: string;
    end_time: string;
    id: number;
    location_id: number;
    location_name: string;
    map_link: string;
    name: string;
    outside_operational_fee: number;
    outside_operational_service: string[];
    outside_operational_status: boolean;
    start_time: string;
    location_time_zone: string;
    operational: IOperational[];
  };
  rental_duration: number;
};

export interface IOperational {
  service: 'airport_transfer' | 'without_driver' | 'with_driver';
  start_time: string;
  end_time: string;
  outside_operational_fee: number;
  outside_operational_status: boolean;
}

export type IPaginationVehicle = {
  last_page: number;
  limit: number;
  page: number;
  sort: 'string';
  total_data: number;
};
export type IResponVehicles = {
  pagination: IPaginationVehicle;
  vehicles: IVehicles[];
};
export type IBrands = {id: number; name: string};
