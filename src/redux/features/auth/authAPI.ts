import i18n, {t} from 'i18next';
import store from 'redux/store';
import {apiWithInterceptor} from '../../../utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {logout} from './authSlice';
import {showToast} from 'utils/Toast';
import {
  IParamConfirmation,
  IParamLogin,
  IParamRegister,
  IResultLogin,
} from 'types/auth.types';
import {err} from 'react-native-svg/lib/typescript/xml';

export const authLogin = createAsyncThunk(
  'auth/login',
  async function (
    params: IParamLogin,
    thunkAPI,
  ): Promise<IResponApi<IResultLogin> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization',
        data: {...params, scope: 'app'},
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const responseMessage = error?.response?.data?.message;

        showToast({
          message:
            responseMessage === 'authozation failed'
              ? i18n.t('global.alert.login_failed')
              : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const authRegister = createAsyncThunk(
  'auth/register',
  async function (
    params: IParamRegister,
    thunkAPI,
  ): Promise<IResponApi<IResultLogin> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/register',
        data: {...params},
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

export const authRegisterConfirmation = createAsyncThunk(
  'auth/registerConfirmation',
  async function (
    params: IParamConfirmation,
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/register/confirmation',
        data: {...params},
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message:
            error?.response.data?.slug === 'invalid-verification-code'
              ? i18n.t('register.wrong-otp-code')
              : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async function (params: string, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/refresh',
        data: {refresh_token: params},
      });
      // console.log('response token 123 ', response, typeof response);
      if (!response || response === 'undefined' || response === undefined) {
        console.log('masuk respon kosong');
        thunkAPI.rejectWithValue(response);
        return;
      }
      // console.log('response.data tken ', response);
      return response.data;
    } catch (error: any) {
      console.log('refreshToken errr ', error);
      // store.dispatch(logout());
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
