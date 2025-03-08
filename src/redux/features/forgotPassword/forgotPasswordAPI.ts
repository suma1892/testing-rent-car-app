import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';
import {
  IParamForgotPasswordRequest,
  IParamsResetPassword,
  IResultForgotPasswordRequest,
  IResultResetPassword,
} from 'types/forgot-password.types';

export const forgotPasswordRequest = createAsyncThunk(
  'forgotPassword/forgotPasswordRequest',
  async function (
    params: IParamForgotPasswordRequest,
    thunkAPI,
  ): Promise<IResponApi<IResultForgotPasswordRequest>> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/forgot-password/request',
        data: params,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const responseMessage = error?.response.data?.detail?.[0]?.message;
        const slug = error?.response?.data?.slug;

        showToast({
          message:
            responseMessage === 'Invalid email'
              ? i18n.t('global.alert.invalid_email_format')
              : slug === 'user-not-found'
              ? i18n.t('global.alert.email_not_registered')
              : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data.slug) as any;
    }
  },
);

export const forgotPasswordConfirmation = createAsyncThunk(
  'forgotPassword/forgotPasswordConfirmation',
  async (_, thunkAPI: any): Promise<IResponApi<any>> => {
    try {
      const fpData = thunkAPI.getState().forgotPassword.data;

      const data = {
        token: fpData.token,
        session: fpData.session,
      };

      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/forgot-password/confirmation',
        data,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        showToast({
          message: error?.response?.data?.slug
            ? i18n.t('global.alert.code_incorrect')
            : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data.slug);
    }
  },
);

export const forgotPasswordReset = createAsyncThunk(
  'forgotPassword/forgotPasswordReset',
  async (
    payload: IParamsResetPassword,
    thunkAPI: any,
  ): Promise<IResponApi<IResultResetPassword>> => {
    try {
      const data = {
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        session: payload.session,
      };

      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/authorization/forgot-password',
        data: data,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const responseMessage = error?.response?.data?.detail?.[0]?.message;

        showToast({
          message:
            responseMessage === 'This field must be greater than or equal to 8'
              ? i18n.t('global.alert.password_length')
              : responseMessage === 'This field must be equal to password'
              ? i18n.t(
                  'global.alert.password_and_confirmation_password_do_not_match',
                )
              : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data.slug);
    }
  },
);
