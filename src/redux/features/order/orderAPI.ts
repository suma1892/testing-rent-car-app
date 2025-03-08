import i18n, {t} from 'i18next';
import {apiWithInterceptor} from '../../../utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IParamOrder, IPayloadSummary} from 'types/order';
import {IResponApi} from 'types/global.types';
import {IResponVehicles} from 'types/vehicles';
import {showToast} from 'utils/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from 'redux/store';
import {setErrorVoucher} from '../voucher/voucherSlice';
import {createNavigationContainerRef} from '@react-navigation/native';
import {navigate} from 'navigator/navigationService';
// export const navigationRef = createNavigationContainerRef();
import {navigationRef} from 'navigator/navigationService';

export const getSummaryOrder = createAsyncThunk(
  'appData/getSummaryOrder',
  async function (
    data: IPayloadSummary,
    thunkAPI,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      if (data?.rental_delivery_id === 0 || data?.rental_return_id === 0)
        return;
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/orders/summary',
        data,
      });
      store.dispatch(setErrorVoucher(''));
      // console.log('response.data = ', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response.data?.message?.includes('voucher not eligible')) {
        store.dispatch(setErrorVoucher(t('voucher.error_eligible') as string));
      } else if (
        error.response.data?.message?.includes('minimum rent day not meet')
      ) {
        store.dispatch(
          setErrorVoucher(t('voucher.error_day_not_meet') as string),
        );
      } else if (
        error.response.data?.message?.includes('order type not meet')
      ) {
        store.dispatch(setErrorVoucher(t('voucher.error_type') as string));
      } else if (
        error.response.data?.message?.includes('not in valid date range')
      ) {
        store.dispatch(
          setErrorVoucher(t('voucher.error_date_range') as string),
        );
      } else if (
        error.response.data?.message?.includes('not meet the condition')
      ) {
        store.dispatch(
          setErrorVoucher(t('voucher.error_not_meet_condition') as string),
        );
      } else if (error.response.data?.message?.includes('quota is full')) {
        store.dispatch(setErrorVoucher(t('voucher.error_quota') as string));
      } else if (
        error.response.data?.message?.includes(
          "voucher can't be use because has promotion",
        )
      ) {
        store.dispatch(setErrorVoucher(t('voucher.error_combine') as string));
      } else {
        store.dispatch(setErrorVoucher(''));
      }
      console.log('err summary ', error?.response?.data?.slug);
      if (error?.response?.data?.slug === 'internal-server-error') {
        console.log('masuk ke internal-server-error');
        navigationRef.navigate('MainTab', {screen: 'Home'});
        showToast({
          message: i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getRentalZone = createAsyncThunk(
  'appData/getRentalZone',
  async function (
    params: string,
    thunkAPI,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/zone${params}`,
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

export const getListZone = createAsyncThunk(
  'appData/getListZone',
  async function (
    params: {
      locationId: number;
      categoryId: number;
    },
    thunkAPI,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/list-zone?all=true&location_id=${params.locationId}&category_id=${params.categoryId}`,
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

export const createOrder = createAsyncThunk(
  'appData/createOrder',
  async function (
    params: IParamOrder,
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: 'orders',
        data: params,
      });

      return response.data;
    } catch (error: any) {
      if (
        error?.response?.data?.message
          ?.toLowerCase()
          ?.includes(
            'Error insert order to db: Error insert trip schedule to db: vehicle is not available'.toLowerCase(),
          )
      ) {
        navigate('MainTab', {screen: 'Home'} as any);
        showToast({
          message: i18n.t('myBooking.err_duplicate_order'),
          title: i18n.t('myBooking.err_duplicate_order_title'),
          type: 'warning',
        });
        return;
      }
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message:
            error?.response.data?.slug === 'Error validate req payload'
              ? t('detail_order.message_error')
              : error?.response.data?.slug ||
                i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const postDisbursements = createAsyncThunk(
  'order/postDisbursements',
  async (payload: any = {}, thunkAPI: any): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/disbursements',
        data: payload,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message:
            error?.response.data?.message ||
            error?.response.data?.slug ||
            i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const postDisbursementsReconfirmation = createAsyncThunk(
  'order/postDisbursementsReconfirmation',
  async (
    payload: {
      reconfirmation_image: string;
      sender_bank_name: string;
      sender_name: string;
      transaction_key: string;
      time_zone: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/disbursements/reconfirmation',
        data: payload,
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

export const createDisbursements = createAsyncThunk(
  'appData/createDisbursements',
  async function (
    params: {
      payment_type_id: number;
      transaction_key: string;
      card_token_id?: string;
      card_owner_name?: string;
      vat?: number;
      time_zone: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/disbursements',
        data: params,
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

export const cancelOrder = createAsyncThunk(
  'cancel/cancelOrder',
  async function (
    params: {
      name: string;
      bank: string;
      bank_account_number: string;
      cancelation_reason: string;
      transaction_key: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'put',
        url: `/orders/${params?.transaction_key}/cancel`,
        data: {
          name: params.name,
          bank: params.bank || 'Mandiri',
          bank_account_number: params.bank_account_number,
          cancelation_reason: params.cancelation_reason,
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
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const refundOrder = createAsyncThunk(
  'cancel/refundOrder',
  async function (
    params: {
      name: string;
      bank: string;
      bank_account_number: string;
      transaction_key: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: `/orders/refund-orders`,
        data: {
          order_transaction_key: params.transaction_key,
          customer_bank_account_name: params.name,
          customer_bank_name: params.bank,
          customer_bank_number: params.bank_account_number,
        },
      });

      return true;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message:
            error?.response.data?.slug || i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return false;
    }
  },
);

export const getOrderDeposit = createAsyncThunk(
  'appData/getOrderDeposit',
  async function (
    transaction_key: string,
    thunkAPI,
  ): Promise<IResponApi<IResponVehicles> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/orders/${transaction_key}/deposits`,
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

export const createReturnDeposit = createAsyncThunk(
  'appData/createReturnDeposit',
  async function (
    params: {
      transaction_key: string;
      recipient_name: string;
      account_number: number;
      account_bank: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const {transaction_key, ...restParams} = params;

      const response: any = await apiWithInterceptor({
        method: 'post',
        url: `/orders/${transaction_key}/deposits`,
        data: restParams,
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
