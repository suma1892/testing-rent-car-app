import {sendOTPAccountDeletetion} from './deleteAccountAPI';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';

type InitState = {
  otp: {
    session?: string;
  };
  isLoading: boolean;
  isLoadingNextPage: boolean;
  isError: boolean;
  errorMessage: any;
};

const initialState: InitState = {
  otp: {},
  isLoading: false,
  isLoadingNextPage: false,
  isError: false,
  errorMessage: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
};

export const deleteAccount = createSlice({
  name: 'deleteAccount',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendOTPAccountDeletetion.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = {};
      })
      .addCase(sendOTPAccountDeletetion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(sendOTPAccountDeletetion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otp = action.payload as any;
      });
  },
});

export const deleteAccountState = (state: RootState) => state.deleteAccount;
export default deleteAccount.reducer;
