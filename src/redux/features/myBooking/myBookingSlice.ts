import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {IOrder, IRefundOrderHistory} from 'types/my-booking.types';
import {getOrderById, getOrders, getRefundOrderHistories, getVehicleOrder} from './myBookingAPI';

interface IInitState {
  data: {
    data: any[];
    pagination: {
      limit: number;
      next_page: number;
      page: number;
      prev_page: number;
      total: number;
      total_page: number;
    };
  };
  vehicleData: any[];
  selected: IOrder | null;
  refundOrderHistories: IRefundOrderHistory[];
  isSelectedLoading: boolean;
  page: number;
  isLoading: boolean;
  isLoadingNextPage: boolean;
  isError: boolean;
  errorMessage: any;
}

const initialState: IInitState = {
  data: {
    data: [],
    pagination: {
      limit: 0,
      next_page: 0,
      page: 0,
      prev_page: 0,
      total: 0,
      total_page: 0,
    },
  },
  vehicleData: [],
  selected: null,
  refundOrderHistories: [],
  isSelectedLoading: false,
  page: 1,
  isLoading: false,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: '', // kalo retry setelah error, harus hapus errorMessage dan isError!
};

export const booking = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // reducers goes here
    resetSelected: state => {
      return {
        ...state,
        isSelectedLoading: false,
        selected: null,
      };
    },
    setPage: (state, action) => {
      return {
        ...state,
        isLoadingNextPage: action.payload !== 1,
        page: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOrders.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getOrders.rejected, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.data = action.payload as any;
      })
      .addCase(getOrderById.pending, state => {
        state.isSelectedLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isSelectedLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isSelectedLoading = false;
        state.selected = action.payload as any;
      })
      .addCase(getRefundOrderHistories.pending, state => {
        state.isSelectedLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getRefundOrderHistories.rejected, (state, action) => {
        state.isSelectedLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getRefundOrderHistories.fulfilled, (state, action) => {
        state.isSelectedLoading = false;
        state.refundOrderHistories = action.payload as any;
      })
      .addCase(getVehicleOrder.pending, state => {
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(getVehicleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getVehicleOrder.fulfilled, (state, action: any) => {
        state.isLoading = false;

        // const isFound = state.vehicleData.find(
        //   vehicle => vehicle.id == action.payload.id,
        // );
        // if (isFound) return;
        state.vehicleData = [action.payload];
      });
  },
});

export const {resetSelected, setPage} = booking.actions;
export const bookingState = (state: RootState) => state.myBooking;
export default booking.reducer;
