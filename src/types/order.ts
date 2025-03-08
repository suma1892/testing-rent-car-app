import {OrderBookingZone} from './global.types';

export type OrderZonePrice = {
  overtime_price: number;
  day: number;
  pick_up_zone_price: number;
  drop_off_zone_price: number;
  driving_zone_price: number;
  total_price: number;
  driver_stay_overnight_price: number;
  booking_start_time?: string;
  booking_end_time?: string;
  overtime_duration?: number;
  outside_operational_charge: number;
};

export type IOrderSummary = {
  addons: addons;
  promo_disc: number;
  promo_name: string | undefined;
  is_available_dp: boolean;
  outside_operational_charge: number;
  point: any;
  one_day_order_charge: number;
  over_time_hour: number;
  sub_total: number | undefined;
  exced_max_passenger_charge: number | undefined;
  deposit_e_toll: number | undefined;
  remainder: any;
  total_dp: number;
  booking_price: number;
  end_booking_date: string;
  end_booking_time: string;
  price_per_day: number;
  order_voucher: {
    discount_price: number;
    voucher_id: number;
  }[];
  insurance_fee: number;
  order_type_id: number;
  rental_delivery_id: number;
  rental_delivery_fee: number;
  rental_return_id: number;
  rental_return_fee: number;
  service_fee: number;
  start_booking_date: string;
  start_booking_time: string;
  total_payment: number;
  vehicle_id: number;
  discount_price: number;
  slash_price: number;
  deposit: number;
  order_zone_total_price: number;
  order_zone_price?: OrderZonePrice[];
  over_time: number;
  over_time_price: number;
  promotion?: {
    id: number;
  };
  formula_variable: Array<{
    id: number;
    name: string;
    value: number;
  }>;
  formula_percentage: {
    id: number;
    value: number;
  };
};

type addons = {
  id: number;
  name?: string;
  description?: string;
  unit_price?: number;
  created_at?: string;
  varieties: {
    id: number;
    quantity: number;
  }[];
}[];
export type IPayloadSummary = {
  order_type_id: number;
  end_booking_date: string;
  end_booking_time: string;
  point?: string | number;
  start_booking_date: string;
  voucher_ids: number[];
  start_booking_time: string;
  vehicle_id: number;
  without_driver: number;
  rental_return_id?: number;
  rental_delivery_id?: number;
  vehicle_category_id?: number;
  booking_zone?: number[];
  pasengger_number?: number;
  order_booking_zone?: OrderBookingZone[];
  overtime?: number;
  location_id?: number;
  sub_services_id?: number;
  addons: addons;
};

export type IParamOrder = {
  order_type_id: number;
  user_name: string;
  phone_number: string;
  wa_number: string;
  email: string;
  booking_price: number;
  service_fee: number;
  rental_delivery_fee: number;
  rental_return_fee: number;
  insurance_fee: number;
  total_payment: number;
  deposit: number;
  refferal_code: string;
  type: 'FULL' | 'HALF';
  order_detail: {
    vehicle_id: number;
    passenger_number?: number;
    is_take_from_rental_office: boolean;
    rental_delivery_location: string;
    rental_delivery_location_detail: string;
    special_request?: string;
    end_booking_date: string;
    end_booking_time: string;
    start_booking_date: string;
    start_booking_time: string;
    rental_return_location: string;
    rental_return_location_detail: string;
    flight_number: string;
    landing_time: string;
    additionals: Array<{
      additional_id: number | undefined;
      price: number | undefined;
      quantity: number | undefined;
    }>;
  };
};

export type ORDER_STATUS = 'PENDING' | 'FAILED';

export type IOrder = {
  order_type_id: number;
  user_name: string;
  phone_number: string;
  wa_number: string;
  email: string;
  booking_price: number;
  service_fee: number;
  rental_delivery_fee: number;
  insurance_fee: number;
  total_payment: number;
  expired_time: string;
  customer_id: string;
  id: number;
  order_status: ORDER_STATUS;
  transaction_key: string;
  updated_at: string;
  order_detail: {
    vehicle_id: number;
    passenger_number: number;
    is_take_from_rental_office: boolean;
    rental_delivery_location: string;
    rental_return_office_id: number;
    special_request?: string;
    end_booking_date: string;
    end_booking_time: string;
    start_booking_date: string;
    start_booking_time: string;
  };
};

export type IDisbursements = {
  transaction_id: string;
  transaction_key: string;
  va_numbers: {
    bank: string;
    va_number: string;
  }[];
  deep_link?: string;
  qr_code?: string;
};

export type IOrderDeposit = {
  id: number;
  deposit_confirmation: {
    id: number;
    order_deposit_id: number;
    name: string;
    bank: string;
    account_number: string;
    image_transfer: string;
    file_image_transfer: string;
    created_at: string;
    updated_at: string;
  };
  recipient_name: string;
  account_number: string;
  account_bank: string;
};

export interface Category {
  category_id: number;
  category_name: string;
  price: number;
}

export interface ZoneImage {
  id: number;
  url: string;
  sequence: number;
  location_id: number;
}

export interface IListZone {
  id: number;
  location_id: number;
  name: string;
  name_location: string;
  name_zone: string;
  zone_id: 5;
}

export interface IZone {
  list_zones: IListZone[];
  zone_images: ZoneImage[];
  pagination: {
    limit: number;
    page: number;
    total_data: number;
    last_page: number;
    sort: string | null;
  };
}

export interface IRentalZone {
  name: string;
  id: number;
  category: Category[];
  location_id: number;
  list: IListZone[];
}
