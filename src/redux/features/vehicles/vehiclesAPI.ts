import i18n from 'i18next';
import {apiWithInterceptor} from '../../../utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {IResponVehicles} from 'types/vehicles';
import {showToast} from 'utils/Toast';

export const getVehicles = createAsyncThunk(
  'appData/getVehicles',
  async function (
    params: string,
    thunkAPI: any,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      const currentPage = thunkAPI.getState().vehicles.page;
      const currentData = thunkAPI.getState().vehicles.data.vehicles;

      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vehicles?page=${currentPage}&limit=200${params}`,
      });

      if (currentPage > 1) {
        return {
          ...response.data,
          vehicles: [...currentData, ...(response.data?.vehicles || [])],
        };
      }
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

export const getTypeOfVehicles = createAsyncThunk(
  'appData/getTypeVehicles',
  async function (
    params: string,
    thunkAPI,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vehicles/list${params}`,
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

export const getBrands = createAsyncThunk(
  'appData/getBrands',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/brands',
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

export const getVehiclesById = createAsyncThunk(
  'appData/getVehiclesById',
  async function (
    {
      id,
      support_driver,
      start_trip,
      end_trip,
    }: {
      id: number;
      support_driver: boolean;
      start_trip: string;
      end_trip: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const obj: any = {};

      if (support_driver) {
        obj['support_driver'] = support_driver.toString();
      }

      if (start_trip) {
        obj['start_trip'] = start_trip;
      }

      if (end_trip) {
        obj['end_trip'] = end_trip;
      }

      const params = new URLSearchParams(obj).toString();
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vehicles/${id}?${params}`,
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
