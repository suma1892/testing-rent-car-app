import {IOperational} from './vehicles';

export type IAirportVehicles = {
  slash_price: number;
  category: string;
  description: string;
  id: number;
  images: string[];
  max_passenger: number;
  max_suitecase: number;
  price: number;
  title: string;
  transmission: 'manual' | 'matic';
  vehicle_id: number;
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
};
export type IPaginationAirportVehicle = {
  last_page: number;
  limit: number;
  page: number;
  sort: 'string';
  total_data: number;
};
export type IResponAirportVehicles = {
  pagination: IPaginationAirportVehicle;
  packages: IAirportVehicles[];
};
