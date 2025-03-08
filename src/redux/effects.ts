import {apiWithInterceptor} from 'utils/interceptorV2';
import {showToast} from 'utils/Toast';
import i18next, {t} from 'i18next';

export const getPlayerId = async (token: string) => {
  try {
    try {
      await createPlayer({
        token: token,
      });
    } catch (error) {
      console.log('err1 = ', error);
      // Alert.alert('warning', JSON.stringify(error));
    }
  } catch (error) {
    console.log('err2 = ', error);
    // Alert.alert('warning', JSON.stringify(error));
  }
};

export const createPlayer = async (body: any) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'post',
      url: '/notifications/players/token',
      data: {
        token: body.token,
      },
    });

    return response;
  } catch (error) {
    console.log('err 0= ', JSON.stringify(error));
    // Alert.alert('Peringatan', JSON.stringify(error));
  }
};

export const getLoyalty = async () => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: '/loyalty-experiences',
    });
    // console.log('ressResponse = ', JSON.stringify(response));
    // Alert.alert('success '+ response?.status, JSON.stringify(response?.config?.data));
    return response.data;
  } catch (error) {
    // console.log('err 0= ', JSON.stringify(error));
    // Alert.alert('Peringatan', JSON.stringify(error));
  }
};

export const getFinishedOrder = async () => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `/orders/my-booking?page=${1}&limit=10&order_by=created_at&order_seq=DESC&status=FINISHED`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getHistoryPoint = async () => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `loyalty-point-history`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getOrderDisbursement = async (transactionKey: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `orders/${transactionKey}/disbursement`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const updateRefundOrder = async (params: any) => {
  const response: any = await apiWithInterceptor({
    method: 'put',
    url: `refund-orders/${params?.id}`,
    data: params,
  });
  console.log('response udpate refund ', JSON.stringify(response));
  return true;
};

export const getRefundOrderHistory = async (transactionKey: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `orders/${transactionKey}/refund-order-history`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getOrderByTrxId = async (transactionKey: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `orders/${transactionKey}`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getDetailTrip = async (id: string, date: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `vehicle-airport-packages/${id}?pickup_trip=${date}`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getSelectedBookingZone = async (id: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `orders/${id}/booking-zones`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getZone = async () => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `zone`,
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const checkedEmail = async (email: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'post',
      url: 'authorization/checkemail',
      data: {
        email: email,
      },
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const resetPasswordReqOtp = async (email: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'post',
      url: 'authorization/forgot-password/request',
      data: {
        email: email,
      },
    });
    return response?.data;
  } catch (error: any) {
    console.warn(error?.response);
    return new Error(error?.response?.data?.slug || 'data-not-found');
  }
};

export const resetPasswordOtpConfirmation = async (payload: {
  session: string;
  token: string;
}) => {
  try {
    await apiWithInterceptor({
      method: 'post',
      url: 'authorization/forgot-password/confirmation',
      data: payload,
    });

    return true;
  } catch (error: any) {
    showToast({
      message: t('Account.invalid_otp'),
      title: t('global.alert.warning'),
      type: 'error',
    });
  }
};

export const resetPassword = async (payload: {
  session: string;
  token: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const response = await apiWithInterceptor({
      method: 'post',
      url: 'authorization/forgot-password',
      data: payload,
    });
    return response.status === 200;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getLocationId = async (locationId: number) => {
  try {
    const response = await apiWithInterceptor({
      method: 'get',
      url: 'location/' + locationId,
    });
    return response.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getDetailVoucher = async (id: number) => {
  try {
    const response = await apiWithInterceptor({
      method: 'get',
      url: 'vouchers/' + id,
    });
    return response.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const matchingPassword = async (payload: {password: string}) => {
  try {
    const response = await apiWithInterceptor({
      method: 'post',
      url: '/profile/confirm-password',
      data: payload,
    });

    return response.data;
  } catch (error: any) {
    console.warn(error?.response);
    return error.response;
  }
};

export const checkTransaction = async () => {
  try {
    const response = await apiWithInterceptor({
      method: 'get',
      url: '/profile/check-transaction',
    });
    return response.data;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const confirmOTPAccountDeletion = async (payload: {
  session: string;
  token: string;
}) => {
  try {
    await apiWithInterceptor({
      method: 'post',
      url: '/profile/delete-account/confirm',
      data: payload,
    });

    return true;
  } catch (error: any) {
    console.warn(error?.response);
  }
};

export const getClaimedVoucherEffect = async (params: any) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: '/vouchers/my-voucher',
      params: params,
    });

    return response.data?.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getSnK = async (params: {
  location_id: number;
  sub_service_id: number | string;
  language: 'EN' | 'ID' | 'CN';
}) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `term-conditions?location_id=${params?.location_id}&sub_service_id=${params?.sub_service_id}&language=${params?.language}`,
      params: params,
    });

    return response.data?.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getVehicleById = async (id: number) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `/vehicles/${id}`,
    });

    return response.data;
  } catch (error: any) {}
};

export const getAddonById = async (id: string) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `/orders/${id}/addons`,
    });

    return response.data;
  } catch (error: any) {}
};

export const getDetailsFromCoordinates = async (
  latitude: any,
  longitude: any,
) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: url,
    });

    return response.data;
  } catch (error: any) {}
};

export const getPackageOneWayService = async ({
  origin_latitude,
  origin_longitude,
  destination_latitude,
  destination_longitude,
  location_id,
}: {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  location_id: number;
}) => {
  const url = `packages?origin_latitude=${origin_latitude}&origin_longitude=${origin_longitude}&dest_latitude=${destination_latitude}&dest_longitude=${destination_longitude}&location_id=${location_id}
`;
  console.log('url ', url);
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: url,
    });

    return response.data;
  } catch (error: any) {}
};

export const cancelOrderOneWay = async (payload: {
  transactionKey: string;
  name: string;
  bank: string;
  bank_account_number: string;
  cancelation_reason: string;
}) => {
  try {
    console.log('payload  ', payload);
    const response: any = await apiWithInterceptor({
      method: 'put',
      url: `orders/${payload.transactionKey}/cancel`,
      data: payload,
    });

    return response;
  } catch (error) {
    console.log('err 0= ', JSON.stringify(error));
    // Alert.alert('Peringatan', JSON.stringify(error));
  }
};

export const getPackageDetail = async ({
  origin_latitude,
  origin_longitude,
  dest_latitude,
  dest_longitude,
  location_id,
}: {
  origin_latitude: string;
  origin_longitude: string;
  dest_latitude: string;
  dest_longitude: string;
  location_id: number;
}) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `packages?origin_latitude=${origin_latitude}&origin_longitude=${origin_longitude}&dest_latitude=${dest_latitude}&dest_longitude=${dest_longitude}&location_id=${location_id}`,
    });

    return response.data;
  } catch (error: any) {}
};

export const getDistanceMaps = async ({
  origin_latitude,
  origin_longitude,
  dest_latitude,
  dest_longitude,
}: {
  origin_latitude: string;
  origin_longitude: string;
  dest_latitude: string;
  dest_longitude: string;
}) => {
  const url = `http://router.project-osrm.org/route/v1/driving/${origin_longitude},${origin_latitude};${dest_longitude},${dest_latitude}?overview=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data || null;
  } catch (error) {
    console.error('Error fetching distance:', error);
    return null;
  }
};

export const getDriverById = async (id: any) => {
  try {
    const response: any = await apiWithInterceptor({
      method: 'get',
      url: `users/${id}`,
    });
    // console.log('res = ', response?.data);
    return response?.data;
  } catch (error: any) {}
};

export async function getLatLong(location: string | number | boolean) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location,
      )}&format=json`,
    );

    if (!response.ok) {
      throw new Error('Gagal mengambil data lokasi');
    }

    const data = await response.json();

    if (data.length > 0) {
      const {lat, lon} = data[0];
      return {latitude: parseFloat(lat), longitude: parseFloat(lon)};
    } else {
      throw new Error('Lokasi tidak ditemukan');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

export const uploadDriverTaskImages = async (files: string[]) => {
  try {
    const getFileInfoFromUrl = (url: string) => {
      const fileName = url.split('/').pop() || 'unknown_file';
      const extension = fileName.split('.').pop();
      const type = extension
        ? `image/${extension}`
        : 'application/octet-stream';
      return {fileName, uri: url, type};
    };

    const uploadPromises = files.map(fileUrl => {
      const file = getFileInfoFromUrl(fileUrl);

      const form = new FormData();
      form.append('file', {
        name: file.fileName,
        uri: file.uri,
        type: file.type,
      });

      return apiWithInterceptor({
        method: 'post',
        url: '/driver-tasks/upload',
        data: form,
      });
    });

    const responses = await Promise.all(uploadPromises);

    return responses.map((response: any) => response.data);
  } catch (error: any) {
    if (error?.response.data?.slug !== 'unable-to-verify-jwt') {
      showToast({
        title: i18next.t('failed'),
        type: 'error',
        message: error?.response?.data?.message || i18next.t('error_occured'),
      });
    }
    return error?.response?.data;
  }
};
