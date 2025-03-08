import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {getClaimedVoucherList, getUnclaimedVoucherList} from './voucherAPI';

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  value_type: string;
  value: number;
  status: string;
  quota: number;
  start_date: string;
  end_date: string;
  image: string;
  is_reedemed: boolean;
}

type InitState = {
  data: Voucher[];
  claimed_voucher: Voucher[];
  detail: any;
  isLoading: boolean;
  isLoadingNextPage: boolean;
  isError: boolean;
  errorMessage: any;
  page: number;
  error_voucher_message: string;
};

const initialState: InitState = {
  data: [],
  detail: {},
  claimed_voucher: [],
  isLoading: false,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
  page: 1,
  error_voucher_message: '',
};

export const voucher = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    // reducers goes here
    setPage: (state, action) => {
      return {...state, isLoadingNextPage: true, page: action.payload};
    },
    setErrorVoucher: (state, action) => {
      return {...state, error_voucher_message: action.payload};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUnclaimedVoucherList.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.isError = false;
        state.errorMessage = {};
      })
      .addCase(getUnclaimedVoucherList.rejected, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getUnclaimedVoucherList.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.data = action.payload as unknown as Voucher[];
      })
      .addCase(getClaimedVoucherList.pending, state => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.isError = false;
        state.errorMessage = {};
      })
      .addCase(getClaimedVoucherList.rejected, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getClaimedVoucherList.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.isLoading = false;
        } else {
          state.isLoadingNextPage = false;
        }
        state.claimed_voucher = action.payload as unknown as Voucher[];
      });
  },
});

export const {setPage, setErrorVoucher} = voucher.actions;
export const voucherState = (state: RootState) => state.voucher;
export default voucher.reducer;
