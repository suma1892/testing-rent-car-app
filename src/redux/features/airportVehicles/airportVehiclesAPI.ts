import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponAirportVehicles} from 'types/airport-vehicles';
import {IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';

export const getAirportVehicles = createAsyncThunk(
  'appData/getAirportVehicles',
  async function (
    params: string,
    thunkAPI: any,
  ): Promise<IResponApi<IResponAirportVehicles> | any> {
    try {
      const currentPage = thunkAPI.getState().airportVehicles.page;
      const currentData = thunkAPI.getState().airportVehicles.data.packages;

      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vehicle-airport-packages?page=${currentPage}&limit=200${params}`,
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
        // showToast({
        //   message:
        //     error?.response.data?.slug || i18n.t('global.alert.error_occurred'),
        //   title: i18n.t('global.alert.warning'),
        //   type: 'error',
        // });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAirportVehiclesById = createAsyncThunk(
  'appData/getAirportVehiclesById',
  async function (
    {
      id,
      pickup_trip,
      pickup_location_id,
      dropoff_location_id,
      location_id
    }: {
      id: number;
      pickup_trip: string;
      pickup_location_id?: number;
      dropoff_location_id?: number;
      location_id?: number;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const obj: any = {
        pickup_trip,
        pickup_location_id,
        dropoff_location_id
      };

      const params = new URLSearchParams(obj).toString();
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/vehicle-airport-packages/${id}?${params}`,
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
