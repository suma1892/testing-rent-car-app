import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {NotificationDataResult} from 'types/notification';
import {showToast} from 'utils/Toast';

export const getNotificationSettings = createAsyncThunk(
  'notifications/getSettings',
  async (_, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/settings/notifications',
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
      return thunkAPI.rejectWithValue(error.response.data.data.message);
    }
  },
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (
    payload: NotificationDataResult[],
    thunkAPI: any,
  ): Promise<IResponApi<any>> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'put',
        url: '/settings/notifications',
        data: {
          settings: payload,
        },
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
      return thunkAPI.rejectWithValue(error.response.data.data.message);
    }
  },
);
