import {IVehicles} from './vehicles';

export interface IMyBookingResult {
  data: any[];
  pagination: {
    limit: number;
    next_page: number;
    page: number;
    prev_page: number;
    total: number;
    total_page: number;
  };
}

export interface IParamVehicleOrder {
  id: number;
}

export type IDisbursementsReconfirmationMessage = {
  message: string;
};

export type ORDER_STATUS =
  | 'PENDING'
  | 'FAILED'
  | 'RECONFIRMATION'
  | 'PAID'
  | 'FINISHED'
  | 'COMPLETED'
  | 'CHECKOUT'
  | 'CANCELLED'
  | 'SEARCHING_FOR_DRIVER';

export type IOrder = {
  customer_name_meet_and_greet: any;
  down_payment: number | undefined;
  booking_price: number;
  order_approval_status: any;
  review_identity: any;
  created_at: string;
  currency: string;
  total_amount_order: number;
  disbursement: {
    account_number: string;
    created_at: string;
    disbursement_confirmation_image: string;
    payment: {
      account_number: string;
      code: string;
      method: string;
    };
    payment_method_id: number;
    redirect_url: string;
    sender_bank_name: string;
    sender_name: string;
    updated_at: string;
    va_number: string;
    permata_va_number: string;
    bill_key: string;
  };
  disbursement_reconfirmation_message: IDisbursementsReconfirmationMessage[];
  email: string;
  expired_time: string;
  id: number;
  insurance_fee: number;
  order_cancelation: {
    name: string;
    bank: string;
    bank_account_number: string;
    cancelation_reason: string;
    status: string;
  };
  order_detail: {
    location_id: number;
    start_booking_time: string;
    baggage: number;
    end_booking_date: string;
    end_booking_time: string;
    is_take_from_rental_office: boolean;
    rental_delivery_location: string;
    rental_delivery_location_detail: string;
    rental_delivery_notes: string;
    rental_return_location: string;
    rental_return_notes: string;
    rental_return_location_detail: string;
    special_request: string;
    start_booking_date: string;
    vehicle_id: number;
    without_driver: boolean;
    rental_return_office_id: number;
    loc_time_id: number;
    vehicle: IVehicles;
    origin: {
      lat: string;
      long: string;
    };
    destination: {
      lat: string;
      long: string;
    };
  };
  order_status: ORDER_STATUS;
  order_type_id: number;
  phone_number: string;
  rental_delivery_fee: number;
  rental_return_fee: number;
  service_fee: number;
  total_payment: number;
  order_key: string;
  transaction_key: string;
  updated_at: string;
  user_name: string;
  wa_number: string;
  is_deposit_exists: boolean;
  type: 'HALF' | 'FULL';
  airport_transfer_package_id?: number;
  over_time?: number;
  order_driver_tasks: {
    id: number;
    refund_order: any;
    status:
      | 'ON_PICK_UP_LOCATION'
      | 'BOOKED'
      | 'RUNNING'
      | 'TRANSPORTING_PASSENGER'
      | 'CANCEL';
    task_type: string;
    driver_id: string;
  }[];
};

export type IRefundOrderHistory = {
  id: number;
  refund_date: string;
  refund_amount: number;
  status: 'CREATED' | 'PROCESSED' | 'TRANSFERED' | 'REJECTED';
  transfered_date: string;
  customer_name: string;
  order_key: string;
  payment_method: string;
  provider: string;
  customer_bank_account_name: string;
  customer_bank_name: string;
  customer_bank_number: string;
  rejected_reason: string;
  proof_of_transfer_refund: string;
  refund_order_histories: Array<{
    id: number;
    status: 'CREATED' | 'PROCESSED' | 'TRANSFERED' | 'REJECTED';
    created_at: string;
  }>;
};

export type DriverData = {
  PersonalInfos: {
    date_of_birth: string;
    domicile: string;
    ktp: string;
    letter_of_agreement: string;
    need_review_ktp: boolean;
    need_review_sim: boolean;
    selfie: string;
    sim: string;
  };
  account_bank: {
    created_at: string;
    deleted_at: string | null;
    id: string;
    nama_bank: string;
    nama_rek: string;
    no_rek: string;
    status: string;
    updated_at: string;
    user_id: string;
  };
  email: string;
  id: string;
  is_deactivated: boolean;
  is_influencer: boolean;
  is_influencer_active: boolean;
  name: string;
  phone: string;
  phone_code: string;
  referral: string;
  role: string;
  role_id: number;
  status: string;
  user_location: {
    created_at: string;
    currency: string;
    id: number;
    is_active: boolean;
    location_id: number;
    location_name: string;
    user_id: string;
  };
  vehicle: {
    driver_id: string;
    id: number;
    license_number: string;
    name: string;
    vehicle_package_id: number;
  };
  wa_code: string;
  wa_number: string;
};
