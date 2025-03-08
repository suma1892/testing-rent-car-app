import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';
import {
  ParamCreateAccountBank,
  ParamUpdateAccountBank,
} from 'types/account-bank.types';
import {slugify} from 'utils/functions';

export const getMyAccountBank = createAsyncThunk(
  'search/getMyAccountBank',
  async (_, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/account-bank',
      });
      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message:
            error?.response.data?.slug || i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createAccountBank = createAsyncThunk(
  'user/createAccountBank',
  async (
    payload: ParamCreateAccountBank,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/account-bank',
        data: payload,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const message = slugify(error?.response?.data?.message, '_');

        showToast({
          message:
            i18n.t(`global.alert.${message}`) ||
            i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateAccountBank = createAsyncThunk(
  'user/updateAccountBank',
  async (
    payload: ParamUpdateAccountBank,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    const {id, ...restPayload} = payload;

    try {
      const response: any = await apiWithInterceptor({
        method: 'put',
        url: `/account-bank/${id}`,
        data: restPayload,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const message = slugify(error?.response?.data?.message, '_');

        showToast({
          message:
            i18n.t(`global.alert.${message}`) ||
            i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
