import i18n, {t} from 'i18next';
import moment from 'moment';
import {enUS, id, zhCN} from 'date-fns/locale';
import {addDays, format, isAfter, isBefore, parse} from 'date-fns';
import {IOrder} from 'types/my-booking.types';
import {NavigationState, Route} from '@react-navigation/native';
import {Platform, PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import momentTz from 'moment-timezone';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export const slugify = (str: string, slugType: string = '-') => {
  if (str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, slugType)
      .replace(/^-+|-+$/g, '');
  }

  return '';
};

export const idrFormatter = (price?: number) => {
  if (price) {
    const rupiah = price.toLocaleString('id-ID', {
      currency: 'IDR',
      style: 'currency',
      // maximumSignificantDigits: 20,
    });
    const idr = rupiah.replace('Rp', 'IDR');
    const final = idr.replace(',00', ',-');
    return final;
  }

  return 'IDR 0';
};

export const passwordValidation = (p1: string, p2: string) =>
  p1 === p2 && /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/.test(p1);

// format expected YYYY/MM/DD
export const dateFormatter = (date: string) => {
  if (date) {
    return moment(date.replace(/\//g, '-')).format('DD-MM-YY');
  }

  return '';
};

export const getStartRentalDate = ({
  withDay = false,
  startBookingDate,
  dateFormat = 'd MMMM yyyy',
}: {
  withDay: boolean;
  startBookingDate?: string;
  dateFormat?: string;
}) => {
  if (withDay) {
    dateFormat = 'EEEE, d MMMM yyyy';
  }

  if (startBookingDate) {
    return `${format(new Date(startBookingDate), dateFormat, {
      locale: i18n.language?.includes('id')
        ? id
        : i18n.language?.includes('cn')
        ? zhCN
        : enUS,
    })}`;
  }

  return '-';
};

export const getEndRentalDate = (endBookingDate?: string) => {
  if (endBookingDate) {
    return `${format(new Date(endBookingDate), 'd MMMM yyyy', {
      locale:
        i18n.language === 'id-ID'
          ? id
          : i18n.language?.includes('cn')
          ? zhCN
          : enUS,
    })}`;
  }

  return '-';
};

export const getRentalTime = ({
  startTime = true,
  startBookingDate,
  startBookingTime,
  endBookingDate,
  endBookingTime,
}: {
  startTime: boolean;
  startBookingDate?: string;
  startBookingTime?: string;
  endBookingDate?: string;
  endBookingTime?: string;
}) => {
  if (startBookingDate) {
    let dateToFormat = `${startBookingDate} ${startBookingTime}`;
    if (startTime) {
      dateToFormat = `${endBookingDate} ${endBookingTime}`;
    }
    if (dateToFormat.includes('undefined')) return '';
    return format(new Date(dateToFormat), 'hh:mm a', {
      locale: i18n.language === 'id-ID' ? id : enUS,
    });
  }

  return '';
};

export const getPaymentLabel = (disbursement?: IOrder['disbursement']) => {
  if (disbursement) {
    if (disbursement?.payment?.method === 'Virtual Account') {
      if (disbursement.bill_key) {
        return disbursement?.bill_key;
      }

      if (disbursement.permata_va_number) {
        return (
          disbursement?.payment?.code +
          ' ' +
          disbursement?.payment?.method +
          ' ' +
          disbursement?.permata_va_number
        );
      }

      // return disbursement?.va_number;
      return disbursement?.payment?.code + ' ' + disbursement?.payment?.method;
    }
    if (i18n.language === 'cn') {
      if (disbursement?.payment?.method === 'Credit Card') {
        return t('payment_method.card_payment');
      }
      if (disbursement?.payment?.method === 'Manual Transfer') {
        return t('payment_method.transfer_manual');
      }
      if (disbursement?.payment?.method === 'QRIS') {
        return t('payment_method.qris_payment');
      }
      return disbursement?.payment?.method;
    }
    return disbursement?.payment?.method;
  }

  return t('myBooking.paymentMethodNotSelected');
};

export const calculateDateDifference = ({
  firstDate,
  secondDate,
  withDriver = false,
}: {
  firstDate: string;
  secondDate: string;
  withDriver?: boolean;
}) => {
  if (firstDate && secondDate) {
    const convertedFirstDate = moment(firstDate.replace(/\//g, '-'));
    const convertedSecondDate = moment(secondDate.replace(/\//g, '-')).add(
      1,
      'd',
    );
    const res = withDriver
      ? convertedSecondDate.diff(convertedFirstDate, 'days')
      : convertedSecondDate.diff(convertedFirstDate, 'days') - 1;

    return `${res} ${res > 1 ? t('Home.daily.days') : t('Home.daily.day')}`;
  }

  return '';
};

export const getCurrentRouteName = (
  state?: NavigationState,
): string | undefined => {
  if (!state) {
    return undefined;
  }

  const route = state.routes[state.index] as Route<string>;
  return route.name;
};

export const getIsOutsideOperationalHours = ({
  bookingStartTime,
  bookingEndTime,
  garageOpenTime,
  garageCloseTime,
  withDriver = false,
}: {
  bookingStartTime: string;
  bookingEndTime: string;
  garageOpenTime: string;
  garageCloseTime: string;
  withDriver?: boolean;
}) => {
  try {
    const parsedStartTime = parse(bookingStartTime, 'HH:mm', new Date(), {
      locale: id,
    });
    console.log('parsedStartTime ', parsedStartTime);
    let parsedEndTime = parse(bookingEndTime, 'HH:mm', new Date(), {
      locale: id,
    });
    console.log('parsedEndTime ', parsedEndTime);

    // Tambahkan 1 hari ke bookingEndTime jika bookingEndTime sebelum bookingStartTime
    if (isBefore(parsedEndTime, parsedStartTime)) {
      parsedEndTime = addDays(parsedEndTime, withDriver ? 1 : 0);
    }

    const parsedGarageOpenTime = parse(garageOpenTime, 'HH:mm', new Date(), {
      locale: id,
    });
    const parsedGarageCloseTime = parse(garageCloseTime, 'HH:mm', new Date(), {
      locale: id,
    });

    const isStartTimeBeforeGarageOpenTime = isBefore(
      parsedStartTime,
      parsedGarageOpenTime,
    );
    const isEndTimeAfterGarageCloseTime = isAfter(
      parsedEndTime,
      parsedGarageCloseTime,
    );

    return isStartTimeBeforeGarageOpenTime || isEndTimeAfterGarageCloseTime;
  } catch (error) {
    console.log('error getIsOutsideOperationalHours', error);
  }
};

export function getTransmission({
  transmission,
  lang,
}: {
  transmission: 'manual' | 'matic';
  lang: 'cn' | 'id' | 'en';
}) {
  if (lang !== 'cn') return transmission;
  if (transmission?.toLowerCase()?.includes('manual')) {
    return '手动挡';
  } else if (transmission?.toLowerCase()?.includes('matic')) {
    return '自动挡';
  } else {
    return transmission;
  }
}

export function getOrderStatus({
  _order_status,
  lang,
}: {
  _order_status: string;
  lang: string;
}) {
  if (lang !== 'cn') {
    if (_order_status === 'SEARCHING_FOR_DRIVER') {
      return t('myBooking.driver_search');
    }
    return _order_status?.replace(/_/g, ' ');
  }

  switch (_order_status?.toLowerCase()) {
    case 'checkout':
      return '结账';
    case 'paid':
      return '已付款';
    case 'completed':
      return '完毕';
    case 'finished':
      return '完成';
    case 'canceled':
      return '已取消';
    case 'pending':
      return '待付款';
    case 'ongoing':
      return '进行中';
    case 'reconfirmation':
      return '重新确认';
    case 'failed':
      return '失败';
    case 'rejected':
      return '拒绝';
    case 'reviewing identity':
      return '审核身份';
    case 'reviewing_identity':
      return '审核身份';
    default:
      return '-';
  }
}

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+ menggunakan izin spesifik
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        // PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      console.log('granted = ', granted);

      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED
        //   &&
        // granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        //   PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // Android 12 ke bawah masih pakai READ_EXTERNAL_STORAGE
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to display images',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; // iOS tidak perlu perubahan
};
export const getImagesFromDCIMAndDownload = async () => {
  const hasPermission = await requestStoragePermission();
  console.log('hasPermission = ', hasPermission);
  if (!hasPermission) {
    console.warn('Permission denied');
    return;
  }

  if (Platform.OS === 'android') {
    // Android: Ambil gambar dari DCIM dan Download folder
    const dcimPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM`;
    const downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download`;

    try {
      const getImagesFromPath = async path => {
        const folders = await RNFS.readDir(path);
        const imagePaths = [];

        for (const folder of folders) {
          if (folder.isDirectory()) {
            const files = await RNFS.readDir(folder.path);
            const imageFiles = files.filter(file =>
              /\.(jpg|jpeg|png|gif)$/i.test(file.name),
            );

            for (const file of imageFiles) {
              const fileStat = await RNFS.stat(file.path);
              imagePaths.push({
                path: `file://${file.path}`,
                mtime: fileStat.mtime,
              });
            }
          } else if (/\.(jpg|jpeg|png|gif)$/i.test(folder.name)) {
            const fileStat = await RNFS.stat(folder.path);
            imagePaths.push({
              path: `file://${folder.path}`,
              mtime: fileStat.mtime,
            });
          }
        }

        return imagePaths;
      };

      const dcimImages = await getImagesFromPath(dcimPath);
      const downloadImages = await getImagesFromPath(downloadPath);

      const allImages = [...dcimImages, ...downloadImages];
      allImages.sort((a, b) => b.mtime - a.mtime);

      return allImages.map(image => image.path);
    } catch (error) {
      console.error('Error reading folders:', error);
    }
  } else {
    // iOS: Ambil gambar dari Photo Library
    try {
      const photos = await CameraRoll.getPhotos({
        first: 50, // Ambil 50 foto terbaru
        assetType: 'Photos',
      });

      return photos.edges.map(edge => edge.node.image.uri);
    } catch (error) {
      console.error('Error accessing photo library:', error);
    }
  }
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export function getTimezoneOffset(timezone) {
  const offsetMinutes = momentTz.tz(timezone).utcOffset();
  const offsetHours = offsetMinutes / 60;
  return offsetHours >= 0 ? `+${offsetHours}` : offsetHours.toString();
}
