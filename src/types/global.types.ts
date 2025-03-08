import {AdditonalProduct} from './additional-items.types';
import {ILocation} from './location.types';
import {
  IAirportLocationResult,
  IRentalLocationResult,
} from './rental-location.types';

export type BigBoolean = null | false | true;
export type ApiKind =
  | 'loading'
  | 'ok'
  | 'bad-data'
  | 'not-found'
  | 'timeout'
  | 'cannot-connect'
  | 'server'
  | 'unauthorized'
  | 'forbidden'
  | 'rejected'
  | 'unknown';

export interface IResponApi<T> {
  kind: ApiKind;
  data?: T;
}

export type IRegisterVerificationStep = 'selectMethod' | 'sendOtp' | 'inputOtp';

export type IRegisterVerificationMethod = 'phone' | 'email' | 'wa';

export type IServiceType = 'Sewa Mobil' | 'Sewa Motor' | 'Sewa Sepeda';
export type ISubServiceType = 'Daily' | 'Airport Transfer' | 'Tour';
export type IFacilityType = 'Without Driver' | 'With Driver';

export type ICities = {
  id: number;
  name: string;
};

export type ShuttleData = {
  airport: boolean;
  fee: number;
  id: number;
  location_id: number;
  name: string;
};

export type IShuttle = {
  pagination: {
    last_page: 1;
    limit: 0;
    page: 0;
    sort: null;
    total_data: 15;
  };
  shuttle: ShuttleData[];
};

export type OrderBookingZone = {
  total_price?: number;
  day: number;
  date?: string;
  jam_sewa?: string;
  detail_drop_off_zone_location?: string;
  detail_pickup_location?: string;
  detail_driving_location?: string;
  driving_zone_id: number;
  driving_zone_name?: string; // nama lokasi driving
  driving_zone_price?: number;
  drop_off_zone_id: number;
  drop_off_zone_name?: string; // nama lokasi drop off
  drop_off_zone_price?: number;
  pick_up_zone_id: number;
  pick_up_zone_name?: string; // nama lokasi pick up
  pick_up_zone_price?: number;
  booking_end_time: string;
  booking_start_time: string;
  overtime_duration: number;
  tanggal_sewa?: string;
  is_driver_stay_overnight?: boolean;
  driver_stay_overnight_price?: number;
  pickup_list_zone_id?: number;
  drop_off_list_zone_id?: number;
  driving_list_zone_id?: number;
  zone_name?: {
    // nama zona
    pick_up_zone?: string;
    drop_off_zone?: string;
    driving_zone?: string;
  };
  is_operational_hours_agreement?: boolean;
};

export type IFormDaily = {
  facility_id: string | number;
  pasengger_number: number;
  order_voucher: {
    voucher_id: number;
    discount_price: number;
  }[];
  limit: number;
  refresh_data: boolean;
  sub_service_id: number;
  point: string;
  passanger: number;
  duration: number;
  need_update: boolean;
  price_sort: string;
  location_id: number;
  start_trip: string;
  start_booking_date: string;
  end_booking_date: string;
  end_trip: string;
  location: string;
  page: number;
  brand?: number;
  start_booking_time: string;
  end_booking_time: string;
  vehicle_id: number;
  vehicle_category_id: number;
  with_driver: boolean;
  booking_zones?: IBookingZone[];
  order_booking_zone?: OrderBookingZone[];
  selected_location: IRentalLocationResult;
  additional_item: AdditonalProduct[];
};

export interface IFormAirportTransfer {
  flight_number: string | undefined;
  meet_and_greet_name: string | undefined;
  pickup_location: IAirportLocationResult & ILocation;
  dropoff_location: IAirportLocationResult & ILocation;
  pickup_date: string;
  pickup_time: string;
  limit: number;
  page: number;
  price_sort: string;
  sub_service_id: number;
  passanger: number;
  vehicle_id: number;
  vehicle_category_id: number;
  airport_transfer_package_id: number;
  is_switched: boolean;
  adults: number;
  suitcase: number;
  large_suitcase: number;
  child: number;
}

export interface IBookingZone {
  date: string;
  pickup_location: string;
  detail_pickup_location: string;
  dispatch_location: string;
  detail_dispatch_location: string;
  zone_id: number;
  price: number;
  selectedZoneId: number[];

  // form
  isAdditionalDriver: any;
  taking_location: ShuttleData | IGarages | null;
  return_location: ShuttleData | IGarages | null;
  special_request?: string;
  custom_delivery_detail_location: string;
  custom_return_detail_location: string;
  jam_sewa: string;
  flight_number: string;
  rental_delivery_location_detail: string;
}

export type IGarages = {
  id: 34;
  name: string;
  address_details: string;
  start_time: string;
  end_time: string;
  map_link: string;
};

export type METHOD_PAYMENT =
  | 'Manual Transfer'
  | 'Credit Card'
  | 'Virtual Account'
  | 'E-money'
  | 'QRIS'
  | 'midtrans'
  | 'ITC';

export type IPayments = {
  id: number;
  method: METHOD_PAYMENT;
  description: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  provider: string;
  code: string;
  enabled?: boolean;
  vat: number;
  VATFixed: number;
  VATPercentage: number;
};

export type IBanks = {code: string; id: number; name: string};

export type IUserProfile = {
  email: string;
  id: string;
  name: string;
  refferal: string;
  personal_info: {
    ktp: string;
    sim: string;
    need_review_sim: boolean;
    need_review_ktp: boolean;
  };
  phone: string;
  phone_code: string;
  wa_number: string;
  photo_profile: string;
  account_bank: {
    created_at: string;
    deleted_at: string;
    id: string;
    nama_bank: string;
    nama_rek: string;
    no_rek: string;
    status: string;
    updated_at: string;
    user_id: string;
  };
};

export type IUserData = {
  fullname: string;
  email: string;
  phone: string;
  code: string;
  wa: string;
  wa_code: string;
  password: string;
  password_confirmation: string;
  registration_type: IRegisterVerificationMethod;
};

export type IGlobalConfig = {
  id: string;
  key: string;
  value: string;
};
