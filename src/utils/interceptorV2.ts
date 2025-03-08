import Config from 'react-native-config';
import store from 'redux/store';
import {ApisauceConfig, create} from 'apisauce';
import {logout} from 'redux/features/auth/authSlice';
import {refreshToken} from 'redux/features/auth/authAPI';

type ApiConfig = {
  method: ApisauceConfig['method'];
  url: ApisauceConfig['url'];
  data?: ApisauceConfig['data'];
  params?: ApisauceConfig['params'];
};

export const apiWithInterceptor = async (config: ApiConfig) => {
  const api = create({} as any);

  api.axiosInstance.interceptors.request.use(
    request => {
      try {
        const TOKEN = store.getState().auth.auth.access_token;
        const CURRENCY = store.getState().utils.currency;
        console.log('CURRENCY ', CURRENCY);
        request.baseURL = Config.URL_API;
        request.headers.Authorization = 'Bearer ' + TOKEN;
        request.timeout = 15000;
        request.headers['app-currency'] = CURRENCY;
        console.log(`${request.method} ${Config.URL_API}/${request.url}`);
        return request;
      } catch (error) {}
    },
    error => {
      return Promise.reject(error);
    },
  );

  api.axiosInstance.interceptors.response.use(
    function (successRes) {
      return successRes;
    },
    async function (error) {
      try {
        console.log('message', error.response.data);
        console.log(error.response.status);

        if (
          error.response.status === 401 &&
          error.response.data?.slug === 'unable-to-verify-jwt'
        ) {
          const refresh_token = store?.getState()?.auth?.auth.refresh_token;
          const isLogin = store?.getState()?.auth?.isSignIn;

          if (
            refresh_token &&
            error.response.data?.slug !== 'refresh-token-invalid'
          ) {
            await store.dispatch(refreshToken(refresh_token as any));
            return api.axiosInstance.request(error.config);
          } else if (!refresh_token && isLogin) {
          } else {
            store.dispatch(logout());
          }
        }
        return Promise.reject(error);
      } catch (e) {}
    },
  );

  const res = await api.axiosInstance.request(config);

  return res;
};
