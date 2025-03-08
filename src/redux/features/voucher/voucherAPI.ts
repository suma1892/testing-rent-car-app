import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';

interface IParams {
  is_reedemed: 1 | 0;
  start_date: string;
  end_date: string;
  order_type?: string;
}

export const getUnclaimedVoucherList = createAsyncThunk(
  'voucher/getUnclaimedVoucherList',
  async (params: IParams, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vouchers?is_reedemed=${params?.is_reedemed}&start_date=${
          params?.start_date
        }&end_date=${params?.end_date}&order_type=${params?.order_type || ''}`,
        params: params,
      });

      return response.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getClaimedVoucherList = createAsyncThunk(
  'voucher/getClaimedVoucherList',
  async (params: IParams, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/vouchers/my-voucher',
        params: params,
      });

      return response.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const claimVoucher = async (voucherId: number) => {
  try {
    const res = await apiWithInterceptor({
      method: 'POST',
      url: 'voucher-redeems',
      data: {
        voucher_id: voucherId,
      },
    });

    return res?.data;
  } catch (error: any) {
    console.warn(error?.response);
    return error.response;
  }
};