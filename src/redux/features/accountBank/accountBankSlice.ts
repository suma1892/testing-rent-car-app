import { createSlice } from '@reduxjs/toolkit';
import { createAccountBank, getMyAccountBank, updateAccountBank } from './accountBankAPI';
import { RootState } from 'redux/store';

type DataResult = {
  created_at: string;
  deleted_at: string | null;
  id: string;
  nama_rek: string;
  nama_bank: string;
  no_rek: string;
  status: string;
  updated_at: string;
  user_id: string;
};

interface IInitState {
  data: DataResult | null;
  isLoading: boolean;
  isError: boolean;
  errorResponse: any;
  isUpdateSuccess: boolean;
}

const initialState: IInitState = {
  data: {
    created_at: '',
    deleted_at: null,
    id: '',
    nama_rek: '',
    nama_bank: '',
    no_rek: '',
    status: '',
    updated_at: '',
    user_id: '',
  },
  isLoading: false,
  isError: false,
  errorResponse: {}, // kalo retry setelah error, harus hapus errorResponse dan isError!
  isUpdateSuccess: false,
};

export const accountBank = createSlice({
  name: 'accountBank',
  initialState,
  reducers: {
    // reducers goes here
    resetAccountBank: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMyAccountBank.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
      })
      .addCase(getMyAccountBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload as any;
      })
      .addCase(getMyAccountBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload as any;
      })

      // create account bank
      .addCase(createAccountBank.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
        state.isUpdateSuccess = false;
      })
      .addCase(createAccountBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload;
        state.isUpdateSuccess = false;
      })
      .addCase(createAccountBank.fulfilled, state => {
        state.isLoading = false;
        state.isUpdateSuccess = true;
      })

      // create account bank
      .addCase(updateAccountBank.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
        state.isUpdateSuccess = false;
      })
      .addCase(updateAccountBank.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload;
        state.isUpdateSuccess = false;
      })
      .addCase(updateAccountBank.fulfilled, state => {
        state.isLoading = false;
        state.isUpdateSuccess = true;
      });
  },
});

export const { resetAccountBank } = accountBank.actions;
export const accountBankState = (state: RootState) => state.accountBank;
export default accountBank.reducer;
