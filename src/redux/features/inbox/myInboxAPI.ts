import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';

export const getInboxes = createAsyncThunk(
  'inbox/getInboxes',
  async (_, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/inboxes',
      });

      return response.data;
    } catch (error: any) {
      // showToast({
      //   message: error?.response.data?.slug || i18n.t('global.alert.error_occurred'),
      //   title: i18n.t('global.alert.warning'),
      //   type: 'error',
      // });
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getInboxDetail = createAsyncThunk(
  'inbox/inbocDetail',
  async (id: number | string, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/inboxes/${id}`,
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
