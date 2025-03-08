import {createSlice} from '@reduxjs/toolkit';
import {
  IDisbursements,
  IOrder,
  IOrderDeposit,
  IOrderSummary,
  IRentalZone,
  IZone,
} from 'types/order';
import {RootState} from '../../store';
import {
  createDisbursements,
  createOrder,
  createReturnDeposit,
  getListZone,
  getOrderDeposit,
  getRentalZone,
  getSummaryOrder,
  postDisbursements,
  postDisbursementsReconfirmation,
} from './orderAPI';

interface IInitState {
  status: string;
  isLoading: boolean;
  summaryOrder: IOrderSummary;
  order: IOrder;
  orderDeposit: IOrderDeposit;
  disbursements: IDisbursements;
  isDisbursementSuccess: boolean;
  isReturnDepositSuccess: boolean;
  listZone: IZone;
  listRentalZone: IRentalZone[];
}

const initialState: IInitState = {
  status: '',
  isLoading: false,
  summaryOrder: {
    addons: [],
    booking_price: 0,
    end_booking_date: '',
    price_per_day: 0,
    deposit_e_toll: 0,
    exced_max_passenger_charge: 0,
    end_booking_time: '',
    insurance_fee: 0,
    order_type_id: 0,
    rental_delivery_id: 0,
    rental_delivery_fee: 0,
    rental_return_id: 0,
    rental_return_fee: 0,
    service_fee: 0,
    start_booking_date: '',
    start_booking_time: '',
    total_payment: 0,
    vehicle_id: 0,
    discount_price: 0,
    deposit: 0,
    remainder: null,
    total_dp: 0,
    slash_price: 0,
    order_zone_total_price: 0,
    sub_total: 0,
    order_zone_price: [],
    one_day_order_charge: 0,
    over_time_hour: 0,
    order_voucher: [],
    over_time: 0,
    over_time_price: 0,
    point: undefined,
    promo_disc: 0,
    promo_name: '',
    outside_operational_charge: 0,
    formula_percentage: {
      id: 0,
      value: 0,
    },
    formula_variable: [],
    is_available_dp: false,
  },
  order: {
    booking_price: 0,
    insurance_fee: 0,
    order_type_id: 0,
    rental_delivery_fee: 0,
    service_fee: 0,
    total_payment: 0,
    customer_id: '',
    email: '',
    expired_time: '',
    id: 0,
    order_detail: {
      end_booking_date: '',
      end_booking_time: '',
      is_take_from_rental_office: false,
      passenger_number: 0,
      rental_delivery_location: '',
      rental_return_office_id: 0,
      start_booking_date: '',
      start_booking_time: '',
      vehicle_id: 0,
      special_request: '',
    },
    order_status: 'FAILED',
    phone_number: '',
    transaction_key: '',
    updated_at: '',
    user_name: '',
    wa_number: '',
  },
  orderDeposit: {
    id: 0,
    deposit_confirmation: {
      id: 0,
      order_deposit_id: 0,
      name: '',
      bank: '',
      account_number: '',
      image_transfer: '',
      file_image_transfer: '',
      created_at: '',
      updated_at: '',
    },
    recipient_name: '',
    account_number: '',
    account_bank: '',
  },
  disbursements: {
    transaction_id: '',
    transaction_key: '',
    va_numbers: [],
  },
  isDisbursementSuccess: false,
  isReturnDepositSuccess: false,
  listZone: {
    list_zones: [],
    zone_images: [],
    pagination: {
      limit: 20,
      page: 1,
      total_data: 0,
      last_page: 0,
      sort: 'asc',
    },
  },
  listRentalZone: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetDisbursementStatus: state => {
      return {
        ...state,
        isDisbursementSuccess: false,
      };
    },
  },
  extraReducers: builder => {
    builder

      // vehicles
      .addCase(getSummaryOrder.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getSummaryOrder.fulfilled, (state, action) => {
        state.status = 'idle';
        state.summaryOrder = action.payload || [];
        state.isLoading = false;
      })
      .addCase(getSummaryOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // get order deposit
      .addCase(getOrderDeposit.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getOrderDeposit.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orderDeposit = action.payload || [];
        state.isLoading = false;
      })
      .addCase(getOrderDeposit.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      //CREATE ORDER
      .addCase(createOrder.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'idle';
        state.order = action.payload.data.order || [];
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // post disbursements -> for manual transfer
      .addCase(postDisbursements.pending, state => {
        state.isLoading = true;
        state.isDisbursementSuccess = false;
      })
      .addCase(postDisbursements.rejected, (state, action) => {
        state.isLoading = false;
        state.disbursements = {} as any;
      })
      .addCase(postDisbursements.fulfilled, (state, action) => {
        state.isDisbursementSuccess = true;
        state.isLoading = false;
        state.disbursements = action.payload;
      })

      .addCase(postDisbursementsReconfirmation.pending, state => {
        state.isLoading = true;
        state.isDisbursementSuccess = false;
      })
      .addCase(postDisbursementsReconfirmation.rejected, (state, action) => {
        state.isLoading = false;
        state.disbursements = {} as any;
      })
      .addCase(postDisbursementsReconfirmation.fulfilled, (state, action) => {
        state.isDisbursementSuccess = true;
        state.isLoading = false;
        state.disbursements = action.payload;
      })

      // CREATE disbursements -> for VA number
      .addCase(createDisbursements.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(createDisbursements.fulfilled, (state, action) => {
        state.status = 'idle';
        state.disbursements = action.payload?.data?.disbursement || [];
        state.isLoading = false;
      })
      .addCase(createDisbursements.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
      })

      // create return deposit
      .addCase(createReturnDeposit.pending, state => {
        state.status = 'loading';
        state.isLoading = true;
        state.isReturnDepositSuccess = false;
      })
      .addCase(createReturnDeposit.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isReturnDepositSuccess = true;
        state.isLoading = false;
      })
      .addCase(createReturnDeposit.rejected, (state, action) => {
        state.status = 'failed';
        state.isReturnDepositSuccess = false;
        state.isLoading = false;
      })

      // get list zone
      .addCase(getListZone.pending, state => {
        state.status = 'loading';
        state.listZone = {
          list_zones: [],
          zone_images: [],
          pagination: {
            limit: 20,
            page: 1,
            total_data: 0,
            last_page: 0,
            sort: 'asc',
          },
        };
        state.isLoading = true;
      })
      .addCase(getListZone.fulfilled, (state, action) => {
        state.status = 'idle';
        state.listZone = action.payload;
        state.isLoading = false;
      })
      .addCase(getListZone.rejected, (state, action) => {
        state.status = 'failed';
        state.listZone = {
          list_zones: [],
          zone_images: [],
          pagination: {
            limit: 20,
            page: 1,
            total_data: 0,
            last_page: 0,
            sort: 'asc',
          },
        };
        state.isLoading = false;
      })

      // getRentalZone
      .addCase(getRentalZone.pending, state => {
        state.status = 'loading';
        state.listRentalZone = [];
        state.isLoading = true;
      })
      .addCase(getRentalZone.fulfilled, (state, action) => {
        state.status = 'idle';
        state.listRentalZone = action.payload;
        state.isLoading = false;
      })
      .addCase(getRentalZone.rejected, (state, action) => {
        state.status = 'failed';
        state.listRentalZone = [];
        state.isLoading = false;
      });
  },
});

export const {resetDisbursementStatus} = orderSlice.actions;

export const orderState = (state: RootState) => state.order;
export default orderSlice.reducer;
