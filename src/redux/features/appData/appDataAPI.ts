import Blob from 'rn-fetch-blob';
import Config from 'react-native-config';
import i18n from 'i18next';
import store from 'redux/store';
import {apiWithInterceptor} from '../../../utils/interceptorV2';
import {create} from 'apisauce';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {ICities, IResponApi} from 'types/global.types';
import {showToast} from 'utils/Toast';

export const getGlobalConfigs = createAsyncThunk(
  'appData/getGlobalConfigs',
  async function (params, thunkAPI): Promise<IResponApi<ICities> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/configs',
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

export const getAllCities = createAsyncThunk(
  'appData/getAllCities',
  async function (params, thunkAPI): Promise<IResponApi<ICities> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/location',
      });

      return response.data;
    } catch (error: any) {
      // showToast({
      //   message:
      //     error?.response.data?.slug || i18n.t('global.alert.error_occurred'),
      //   title: i18n.t('global.alert.warning'),
      //   type: 'error',
      // });
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getShuttle = createAsyncThunk(
  'appData/getShuttle',
  async function (params: any, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/shuttle?location_id=' + params,
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

export const getUser = createAsyncThunk(
  'appData/getUser',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/profile?includes=PersonalInfos&includes=AccountBanks',
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getRefferalPoint = createAsyncThunk(
  'appData/getRefferalPoint',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/referral-point',
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getGarages = createAsyncThunk(
  'appData/getGarages',
  async function (params: any, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/garages?location_id=' + params,
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

export const getPayments = createAsyncThunk(
  'appData/getPayments',
  async function (
    params: {
      total_payment: number;
      location_id?: number;
      currency: string;
    },
    thunkAPI,
  ): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: `/payments?total_payment=${params?.total_payment}&location_id=${params?.location_id}&currency=${params?.currency}`,
      });

      console.log('response.data ', response.data);
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

export const getBanks = createAsyncThunk(
  'appData/getBanks',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/banks',
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

export const getAboutUsImage = createAsyncThunk(
  'appData/getAboutUsImage',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/about-us',
      });

      return response.data.map((x: any) => {
        return {...x, img: Config.URL_IMAGE + x.image};
      });
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

export const getBanners = createAsyncThunk(
  'appData/getBanners',
  async function (params, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'get',
        url: '/banner',
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

export const downloadEticket = async (params: string) => {
  const {config, fs} = Blob;
  const downloadDir = fs.dirs.DownloadDir;
  const PATH =
    downloadDir +
    '/e-ticket-' +
    Math.floor(new Date().getTime() + new Date().getSeconds() / 2) +
    '.pdf';
  // const options = {
  //   fileCache: true,
  //   // path: PATH,
  //   useDownloadManager: true,
  //   notification: true,
  //   mediaScannable: true,
  // };
  const options = {
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: PATH,
      description: 'Downloading PDF document',
      mediaScannable: true,
    },
  };
  const TOKEN = store.getState().auth.auth.access_token;

  config(options)
    .fetch('GET', `${Config.URL_API}/orders/${params}/invoice`, {
      Authorization: 'Bearer ' + TOKEN,
      'Content-Type': 'multipart/form-data',
    })
    .then(res => {
      if (res.respInfo.status === 500) {
        showToast({
          message: i18n.t('global.alert.error_download_e_ticket'),
          title: i18n.t('global.alert.warning'),
          type: 'error',
        });
      } else {
        showToast({
          message:
            i18n.t('global.alert.success_download_e_ticket') + res.path(),
          title: i18n.t('global.alert.success'),
          type: 'success',
        });
      }
    })
    .catch(error => {
      showToast({
        message:
          error?.response?.data?.slug! || i18n.t('global.alert.error_occurred'),
        title: i18n.t('global.alert.warning'),
        type: 'error',
      });
    });
};

export const sendCallCenter = createAsyncThunk(
  'appData/sendCallCenter',
  async function (params: any, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const response: any = await apiWithInterceptor({
        method: 'post',
        url: '/contact',
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

export const getArtikels = createAsyncThunk(
  'appData/getArtikels',
  async function (lang: string, thunkAPI): Promise<IResponApi<any> | any> {
    try {
      const api = create({
        baseURL: 'https://blog.getandride.com',
        // headers: { Accept: 'application/vnd.github.v3+json' },
      });

      // start making calls
      const response = await api.get(
        `/wp-json/wp/v2/posts${lang === 'en' ? '?categories=337' : ''}`,
      );

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
