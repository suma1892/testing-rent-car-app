import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {changePassword, checkAvailableReferralCode, editUser, getReferrer, setReferrer, uploadFile} from './userAPI';
import { IReferralCode } from 'types/referral-code.types';

type InitState = {
  data: any;
  isLoading: boolean;
  isUpdateSuccess: boolean;
  isChangePasswordSuccess: boolean;
  isSetReferrerSuccess: boolean;
  isError: boolean;
  errorResponse: any;
  referrer: IReferralCode;
};

const initialState: InitState = {
  data: {},
  isLoading: false,
  isUpdateSuccess: false,
  isChangePasswordSuccess: false,
  isSetReferrerSuccess: false,
  isError: false,
  errorResponse: {}, // kalo retry setelah error, harus hapus errorMessage dan isError!
  referrer: {
    referral_code: '',
    user_id: '',
    referrer_id: '',
  },
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: state => {
      return {
        ...state,
        isUpdateSuccess: false,
        isChangePasswordSuccess: false,
        isSetReferrerSuccess: false,
      };
    },
    setUserData: (state, action) => {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(editUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
        state.isUpdateSuccess = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload;
        state.isUpdateSuccess = false;
      })
      .addCase(editUser.fulfilled, state => {
        state.isLoading = false;
        state.isUpdateSuccess = true;
      })

      // upload file
      .addCase(uploadFile.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        } as any;
      })

      // change password
      .addCase(changePassword.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
        state.isChangePasswordSuccess = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload as any;
      })
      .addCase(changePassword.fulfilled, state => {
        state.isLoading = false;
        state.isChangePasswordSuccess = true;
      })

      // get referrer
      .addCase(getReferrer.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
      })
      .addCase(getReferrer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload as any;
      })
      .addCase(getReferrer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.referrer = action.payload;
      })

      // set referrer
      .addCase(setReferrer.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
        state.isSetReferrerSuccess = false;
      })
      .addCase(setReferrer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload as any;
      })
      .addCase(setReferrer.fulfilled, state => {
        state.isLoading = false;
        state.isSetReferrerSuccess = true;
      })

      // check available referral code
      .addCase(checkAvailableReferralCode.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.errorResponse = {};
      })
      .addCase(checkAvailableReferralCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorResponse = action.payload as any;
      })
      .addCase(checkAvailableReferralCode.fulfilled, state => {
        state.isLoading = false;
      });
  },
});

export const {resetUser, setUserData} = user.actions;

export const userState = (state: RootState) => state.user;
export default user.reducer;
