import i18n from 'i18next';
import {apiWithInterceptor} from 'utils/interceptorV2';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {IParamsReferralCode, IReferralCode} from 'types/referral-code.types';
import {IResponApi} from 'types/global.types';
import {ParamChangePassword, ParamEditUser, ParamUploadFile} from 'types/user';
import {showToast} from 'utils/Toast';

export const editUser = createAsyncThunk(
  'user/editUser',
  async (
    payload: ParamEditUser,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'put',
        url: '/profile',
        data: payload,
      });

      return response.data;
    } catch (error: any) {
      if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
        const slug = error?.response?.data?.slug;

        if (slug === 'phone-is-duplicated') {
          showToast({
            message: i18n.t('global.alert.duplicate_phone'),
            title: i18n.t('global.alert.warning'),
            type: 'error',
          });
          return thunkAPI.rejectWithValue(error.response.data);
        }

        showToast({
          message:
            slug === 'incorrect-credential'
              ? i18n.t('global.alert.password_incorrect')
              : i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const uploadFile = createAsyncThunk(
  'user/uploadFile',
  async (
    payload: ParamUploadFile,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    const {file, name} = payload;

    try {
      const form = new FormData();
      form.append('file', {
        name: `${name}.${file.fileName?.split('.')?.[1]}`,
        uri: file.uri,
        type: file.type,
      });

      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/profile/document',
        data: form,
      });

      return {
        [name]: response.data?.file,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (
    payload: ParamChangePassword,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'put',
        url: '/authorization/change-password',
        data: payload,
      });

      return response.data;
    } catch (error: any) {
      const slug = error?.response?.data?.slug;

      if (slug !== 'unable-to-verify-jwt') {
        let message = error?.response?.data?.message;
        if (
          slug === 'password-doesnt-match' &&
          message === 'old password is not match'
        ) {
          message = i18n.t('global.alert.old_password_is_not_match');
        }
        if (slug === 'validation-form-register') {
          message = i18n.t('global.alert.password');
        }

        showToast({
          message: message || i18n.t('global.alert.password'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getReferrer = createAsyncThunk(
  'user/getReferrer',
  async function (params, thunkAPI): Promise<IResponApi<IReferralCode> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/referrers',
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

export const checkAvailableReferralCode = createAsyncThunk(
  'user/checkAvailableReferralCode',
  async function (
    params: {referralCode: string; showToast?: boolean},
    thunkAPI,
  ): Promise<IResponApi<IReferralCode> | any> {
    try {
      const {referralCode} = params;

      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/users/referrers/${referralCode}`,
      });
      return response.data;
    } catch (error: any) {
      if (
        error?.response.data?.slug !== 'unable-to-verify-jwt' &&
        params.showToast
      ) {
        const message =
          error?.response.data?.slug === 'user-not-found'
            ? i18n.t('referral_code.referral_is_not_found')
            : error?.response.data?.slug;

        showToast({
          message: message || i18n.t('global.alert.error_occurred'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const setReferrer = createAsyncThunk(
  'user/setReferrer',
  async (
    payload: IParamsReferralCode,
    thunkAPI: any,
  ): Promise<IResponApi<any> | any> => {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/referrers',
        data: payload,
      });

      return response.data;
    } catch (error: any) {
      if (
        error?.response.data?.slug !== 'unable-to-verify-jwt' &&
        payload.show_toast
      ) {
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
