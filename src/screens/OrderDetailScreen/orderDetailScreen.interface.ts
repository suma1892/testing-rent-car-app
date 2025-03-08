import {IGarages, ShuttleData} from 'types/global.types';
import {IAirportLocationResult} from 'types/rental-location.types';

export type Form = {
  package_id?: any;
  origin_lat?: any;
  origin_long?: any;
  destination_lat?: any;
  destination_long?: any;
  custom_pickup_detail_location: string | undefined;
  taking_location: ShuttleData | IGarages | null;
  return_location: ShuttleData | IGarages | null;
  special_request?: string;
  custom_delivery_detail_location: string;
  custom_return_detail_location: string;
  jam_sewa: string;
  flight_number: string;
  type: 'FULL' | 'HALF';
  pasengger_number: number;
  point?: string;
  dial_code?: string;
  phone: string;
  code?: string;
  baggage: string;
};
