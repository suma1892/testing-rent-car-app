import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';

export const sendOTPAccountDeletetion = createAsyncThunk(
  'voucher/sendOTPAccountDeletetion',
  async (_, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/profile/delete-account/send-otp',
        data: {
          type: 'email',
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const confirmOTPAccountDeletion = createAsyncThunk(
  'voucher/confirmOTPAccountDeletion',
  async (
    params: {
      session: string;
      token: string;
    },
    thunkAPI: any,
  ): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/profile/delete-account/confirm',
        data: params,
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
