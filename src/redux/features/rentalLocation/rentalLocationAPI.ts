import i18n from 'i18next';
import {apiWithInterceptor} from '../../../utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';
import {IRentalLocationResult} from 'types/rental-location.types';

export const getServices = createAsyncThunk(
  'rentalLocation/services',
  async function (
    _,
    thunkAPI,
  ): Promise<IResponApi<IRentalLocationResult> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/services',
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
export const getRentalLocation = createAsyncThunk(
  'rentalLocation/location',
  async function (
    params: {
      service_id?: number;
      sub_service_id?: number;
      facility_id?: number;
    },
    thunkAPI,
  ): Promise<IResponApi<IRentalLocationResult> | any> {
    try {
      const queryParams = new URLSearchParams();

      if (!!params.service_id) {
        queryParams.append('service_id', String(params.service_id));
      }
      if (!!params.sub_service_id) {
        queryParams.append('sub_service_id', String(params.sub_service_id));
      }
      if (!!params.facility_id) {
        queryParams.append('facility_id', String(params.facility_id));
      }

      const url = `/location${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response: any = await apiWithInterceptor({method: 'get', url});
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAirportLocation = createAsyncThunk(
  'airportLocation/location',
  async function (
    params: any,
    thunkAPI,
  ): Promise<IResponApi<IRentalLocationResult> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/shuttle-airport?location_type=airport&limit=100${
          params?.pickup_location_id
            ? '&pickup_location_id=' + params?.pickup_location_id
            : ''
        }`,
      });

      return response.data?.shuttle;
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

export const getAirportLocationZone = createAsyncThunk(
  'airportLocation/location-zone',
  async function (
    params: any,
    thunkAPI,
  ): Promise<IResponApi<IRentalLocationResult> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/shuttle-airport?location_type=zone&limit=100${
          params?.pickup_location_id
            ? '&pickup_location_id=' + params?.pickup_location_id
            : ''
        }`,
      });

      return response.data?.shuttle;
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
