import AccordianDetailOrder from './AccordianDetailOrder';
import AccordianLocation from './AccordianLocation';
import appBar from 'components/AppBar/AppBar';
import DetailOrder from './DetailOrder';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getDriverById} from 'redux/effects';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {rowCenter, WINDOW_HEIGHT} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_arrow_left_white,
  ic_car_globe,
  ic_cloud,
  ic_info3,
  ic_user,
} from 'assets/icons';
import {
  FONT_SIZE_10,
  FONT_SIZE_12,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {URL_IMAGE} from '@env';

const OneWayDetailBookingScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const bookingDetail = useAppSelector(state => state.myBooking);
  const {selected, isSelectedLoading: bookingDetailLoading} = bookingDetail;
  const modalRef = useRef<BottomSheetModal>(null);
  const [driverData, setDriverData] = useState<any>();
  const order_driver_tasks = selected?.order_driver_tasks?.[0];
  // const isDriverReady = bookingDetailLoading
  //   ? false
  //   : selected?.order_status === 'PAID' &&
  //     selected?.order_driver_tasks?.length > 0;
  const isDriverReady = bookingDetailLoading
    ? false
    : order_driver_tasks?.status === 'ON_PICK_UP_LOCATION' ||
      order_driver_tasks?.status === 'TRANSPORTING_PASSENGER';
  const isFinishTask = selected?.order_status === 'FINISHED';

  const snapPoints = useMemo(() => ['55%', '95%'], []);

  const handleShowModal = useCallback(() => {
    modalRef.current?.present();
  }, []);

  const item = route?.params?.item || {};

  useEffect(() => {
    handleShowModal();
    getDetailOrder();
    getDriverDetail();
    if (!isDriverReady) {
      navigation.setOptions(
        appBar({
          leading: (
            <TouchableOpacity
              style={styles.rowCenter}
              onPress={() => navigation.goBack()}>
              <Image source={ic_arrow_left_white} style={styles.headerIcon} />
              <Text style={styles.headerText}>{t('myBooking.my_order')}</Text>
            </TouchableOpacity>
          ),
        }),
      );
    } else {
      navigation.setOptions({headerShown: false});
    }
    return () => {};
  }, [navigation, t, selected?.order_status]);

  useEffect(() => {
    if (isDriverReady) {
      console.log('masukkkk');
      modalRef.current?.present();
    }
    return () => {};
  }, [isDriverReady]);

  const getDriverDetail = async () => {
    if (!selected?.order_driver_tasks?.[0]?.driver_id) return;
    const res = await getDriverById(
      selected?.order_driver_tasks?.[0]?.driver_id,
    );
    setDriverData(res);
  };

  const getDetailOrder = async () => {
    await dispatch(getOrderById(item?.transaction_key));
  };

  const onRefresh = useCallback(() => {
    getDetailOrder();
    getDriverDetail();
  }, []);

  if (isFinishTask) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container2}>
          <View style={[styles.rowCenter2, styles.userCard]}>
            <Image
              source={{
                uri: URL_IMAGE + driverData?.PersonalInfos?.selfie,
              }}
              style={[styles.userImage, styles.imageBorder]}
            />
            <View>
              <Text style={[styles.textBold, styles.textSmall]}>
                {driverData?.name}
              </Text>
              <Text
                style={[
                  styles.textLight,
                  styles.textExtraSmall,
                  styles.marginBottom,
                ]}>
                {driverData?.wa_code}
                {driverData?.phone}
              </Text>
              <Text style={[styles.textRegular, styles.textExtraSmall]}>
                {driverData?.vehicle?.license_number}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Image
              source={ic_info3}
              style={[styles.iconSmall, styles.iconTint]}
            />
            <Text
              style={[
                styles.textRegular,
                styles.textExtraSmall,
                styles.marginLeft,
              ]}>
              {t('one_way.left_items')}
            </Text>
          </View>
          <AccordianDetailOrder
            data={selected!}
            _package={selected?.vehicle_package}
          />
          <AccordianLocation data={selected!} />
        </ScrollView>
      </View>
    );
  } else if (isDriverReady) {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: WINDOW_HEIGHT / 2.2,
            backgroundColor: theme.colors.navy,
          }}>
          <Image source={ic_car_globe} style={styles.carGlobe} />
          <Image source={ic_cloud} style={styles.cloud1} />
          <Image source={ic_cloud} style={styles.cloud2} />
          <Image source={ic_cloud} style={styles.cloud3} />
        </View>
        <BottomSheetModal
          ref={modalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}>
          <DetailOrder
            ScrollView={!isDriverReady ? ScrollView : BottomSheetScrollView}
            driverData={driverData}
            order_key={item?.order_key}
          />
        </BottomSheetModal>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={bookingDetailLoading}
              onRefresh={onRefresh}
            />
          }>
          <View style={styles.scheduledOrderContainer}>
            <Text style={styles.scheduledOrderTitle}>
              {t('one_way.order_schedule')}
            </Text>
            <Text style={styles.scheduledOrderDate}>
              {moment(selected?.order_detail?.start_booking_date).format(
                'DD MMM YYYY',
              )}
              ,{' '}
              {moment(
                selected?.order_detail?.start_booking_time,
                'HH:mm:ss',
              ).format('HH:mm')}
            </Text>
            <Text style={styles.scheduledOrderDescription}>
              {t('one_way.order_schedule_desc')}
            </Text>
          </View>
          <DetailOrder
            ScrollView={!isDriverReady ? ScrollView : BottomSheetScrollView}
            driverData={driverData}
            item={item}
          />
        </ScrollView>
      </View>
    );
  }
};

export default OneWayDetailBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scheduledOrderContainer: {
    backgroundColor: '#E3F1FF',
    padding: 16,
    alignItems: 'center',
  },

  scheduledOrderTitle: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  scheduledOrderDate: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT_BOLD,
    color: '#0085FF',
  },
  rowCenter: {
    ...rowCenter,
  },
  headerIcon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  headerText: {
    color: 'white',
    marginLeft: 10,
  },
  scheduledOrderDescription: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
    textAlign: 'center',
    lineHeight: 19,
  },
  carGlobe: {
    width: 247,
    height: 238,
    alignSelf: 'center',
    marginTop: '17%',
  },
  cloud1: {
    width: 64,
    height: 64,
    position: 'absolute',
    top: 45,
    left: 95,
  },
  cloud2: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 7,
    bottom: 81,
  },
  cloud3: {
    width: 46,
    height: 46,
    position: 'absolute',
    bottom: 42,
    right: 33,
  },
  container2: {
    margin: 15,
    backgroundColor: 'white',
  },
  rowCenter2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCard: {
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderRadius: 10,
    padding: 10,
  },
  userImage: {
    width: 56,
    height: 56,
  },
  imageBorder: {
    borderRadius: 20,
    marginRight: 10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textLight: {
    fontWeight: '300',
  },
  textRegular: {
    fontWeight: '400',
  },
  textSmall: {
    fontSize: FONT_SIZE_12,
  },
  textExtraSmall: {
    fontSize: FONT_SIZE_10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#FFEFD9',
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
  },
  iconSmall: {
    width: 10,
    height: 10,
  },
  iconTint: {
    tintColor: theme.colors.orange,
    marginTop: 5,
  },
  marginLeft: {
    marginLeft: 5,
  },
});
