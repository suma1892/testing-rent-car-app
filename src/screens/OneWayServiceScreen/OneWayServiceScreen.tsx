import BottomSheet from '@gorhom/bottom-sheet';
import Button from 'components/Button';
import DeviceInfo from 'react-native-device-info';
import EmptyFormComp from './EmptyFormComp';
import FloatingLocName from './Components/FloatingLocName';
import FooterNextBottom from './Components/FooterNextBottom';
import moment from 'moment';
import OrderScheduleModal from './OrderScheduleModal';
import PackageMap from './Components/PackageMap';
import React, {useEffect, useRef, useState} from 'react';
import SelectPackageForm from './Components/SelectPackageForm';
import TripFormComp from './Components/TripFormComp';
import TripMap from './Components/TripMap';
import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import {createOrder, getSummaryOrder} from 'redux/features/order/orderAPI';
import {getAnalytics} from '@react-native-firebase/analytics';
import {getLocationAsync} from 'utils/getLocation';
import {ic_car_rent, ic_disable_gps} from 'assets/icons';
import {IFormLocation, ILocation} from 'types/location.types';
import {IRentalLocationResult} from 'types/rental-location.types';
import {orderState} from 'redux/features/order/orderSlice';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {userState} from 'redux/features/user/userSlice';
import {useTranslation} from 'react-i18next';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import {
  getDetailsFromCoordinates,
  getLatLong,
  getPackageOneWayService,
} from 'redux/effects';

import {
  appDataState,
  setSelectedVoucher,
} from 'redux/features/appData/appDataSlice';
import {
  FONT_SIZE_14,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';

const OneWayServiceScreen = () => {
  const {t} = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation();

  const {userProfile} = useAppSelector(appDataState);
  const summaryOrder = useAppSelector(orderState).summaryOrder;
  const referrer = useAppSelector(userState)?.referrer;
  const dispatch = useAppDispatch();

  const [snapPoints, setSnapPoints] = useState<`${string}%`[]>(['90%']);
  const [activeForm, setActiveForm] = useState<
    'empty' | 'pickup' | 'dropoff' | 'package'
  >('empty');
  const [district, setDistrict] = useState<IRentalLocationResult>(
    route.params?.district || '',
  );

  const [districtLatLn, setDistrictLatLn] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loader, setLoader] = useState(false);
  const [dates, setDates] = useState<{date: string; time: string}>();
  const [showOrderSchedule, setShowOrderSchedule] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<ILocation>();
  const [pickupForm, setPickupForm] = useState<IFormLocation>();
  const [dropoffForm, setDropoffForm] = useState<IFormLocation>();
  const [selectedPackage, setSelectedPackage] = useState<any>();
  const [dataPackage, setDataPackage] = useState([]);

  const bottomSheetFormRef = useRef<BottomSheet>(null);

  const getCurrentLocation = async () => {
    let loc: any;
    try {
      loc = await getLocationAsync({need_permission: true});

      console.log('loc = ', loc);
    } catch (error) {
      navigation.goBack();
      console.log('err 2 = ', error);
      return;
    }

    const resdetail = await getDetailsFromCoordinates(
      loc.latitude,
      loc.longitude,
    );
    console.log('resdetail = ', resdetail);
    setCurrentLoc({
      lat: loc.latitude,
      lon: loc.longitude,
      name: resdetail?.name || resdetail?.address?.city,
      display_name: resdetail?.display_name,
    });
  };

  const resetForm = () => {
    setPickupForm((prev: any) => ({
      detail: '',
      location: {
        lat: 0,
        lon: 0,
        name: '',
        display_name: '',
      },
    }));
    setDropoffForm((prev: any) => ({
      detail: '',
      location: {
        lat: 0,
        lon: 0,
        name: '',
        display_name: '',
      },
    }));
  };

  useEffect(() => {
    const getDistrictDetail = async () => {
      const res = await getLatLong(district?.name);
      console.log('res distrik detail = ', res);
      setDistrictLatLn(res as any);
    };

    getDistrictDetail();
  }, [district]);

  const [isActiveGps, setIsActiveGps] = useState(false);
  const checkGps = async () => {
    const isLocationEnabled = await DeviceInfo.isLocationEnabled();

    if (!isLocationEnabled) {
      setIsActiveGps(false);
      showBSheet({
        content: (
          <View
            style={{
              width: WINDOW_WIDTH,
              alignItems: 'center',
            }}>
            <Image source={ic_disable_gps} style={{width: 240, height: 250}} />

            <Text
              style={{
                fontSize: 20,
                fontWeight: FONT_WEIGHT_BOLD,
              }}>
              {t('one_way.active_location')}
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE_14,
                fontWeight: FONT_WEIGHT_REGULAR,
                marginTop: 20,
                textAlign: 'center',
              }}>
              {t('one_way.active_location_description')}
            </Text>

            <View style={{}}>
              <Button
                _theme="navy"
                title={t('one_way.btn_active_location')}
                onPress={() => {
                  getCurrentLocation();
                  dispatch(toggleBSheet(false));
                }}
                styleWrapper={{
                  width: WINDOW_WIDTH - 20,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: '#666',
                }}
              />
            </View>
          </View>
        ),
        snapPoint: ['70%', '70%'],
        enablePanDownToClose: false,
        isCloseBackhandler: true,
      });
      return;
    } else {
      setIsActiveGps(true);
    }
    getCurrentLocation();
  };

  useEffect(() => {
    checkGps();
    // checkPermission();
    // getCurrentLocation();
  }, []);

  const handleResetCenter = async (type: 'dropoff' | 'pickup') => {
    const resdetail = await getDetailsFromCoordinates(
      currentLoc?.lat,
      currentLoc?.lon,
    );

    if (isOutsideSelectedLocation(resdetail)) {
      return;
    }
    if (type === 'pickup') {
      setPickupForm((prev: any) => ({
        ...prev,
        location: {
          lat: currentLoc?.lat,
          lon: currentLoc?.lon,
          name: currentLoc?.name,
          display_name: currentLoc?.display_name,
        },
      }));
    }
    if (type === 'dropoff') {
      setDropoffForm((prev: any) => ({
        ...prev,
        location: {
          lat: currentLoc?.lat,
          lon: currentLoc?.lon,
          name: currentLoc?.name,
          display_name: currentLoc?.display_name,
        },
      }));
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      if (!isActiveGps) {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [isActiveGps]);

  useEffect(() => {
    const handleBackButton = () => {
      if (showOrderSchedule) {
        return true;
      } else if (activeForm !== 'empty') {
        setActiveForm('empty');
        setSnapPoints(['90%']);
      } else {
        return false;
      }
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [activeForm, showOrderSchedule, setShowOrderSchedule]);

  const getPackage = async () => {
    const res = await getPackageOneWayService({
      origin_latitude: pickupForm?.location?.lat!,
      origin_longitude: pickupForm?.location?.lon!,
      destination_latitude: dropoffForm?.location?.lat!,
      destination_longitude: dropoffForm?.location?.lon!,
      location_id: district?.id,
    });
    console.log('payload = ', {
      origin_latitude: pickupForm?.location?.lat!,
      origin_longitude: pickupForm?.location?.lon!,
      destination_latitude: dropoffForm?.location?.lat!,
      destination_longitude: dropoffForm?.location?.lon!,
      location_id: district?.id,
    });
    console.log('res =', res?.data);

    setDataPackage(res?.data || []);
  };

  const getSummary = async () => {
    console.log('dates = ', dates);
    if (
      !selectedPackage?.id ||
      !pickupForm?.location?.lat ||
      !pickupForm?.location?.lon ||
      !dropoffForm?.location?.lat ||
      !dropoffForm?.location?.lon ||
      !district?.id
    ) {
      return;
    }
    const payload = {
      end_booking_date: moment(dates?.date, 'YYYY/MM/DD').format('YYYY-MM-DD'),
      end_booking_time: moment(dates?.time, 'HHmm').format('HH:mm'),
      start_booking_date: moment(dates?.date, 'YYYY/MM/DD').format(
        'YYYY-MM-DD',
      ),
      start_booking_time: moment(dates?.time, 'HHmm').format('HH:mm'),
      order_type_id: 6,
      // vehicle_id: 8,
      // without_driver: 0,
      // promotion_id: 25,
      vehicle_category_id: 6,
      pasengger_number: 0,
      overtime: 0,
      location_id: district?.id,
      addons: [],
      package_id: selectedPackage?.id,
      origin: {
        lat: pickupForm?.location?.lat!,
        long: pickupForm?.location?.lon!,
      },
      destination: {
        lat: dropoffForm?.location?.lat!,
        long: dropoffForm?.location?.lon!,
      },
    };

    await dispatch(getSummaryOrder(payload as any));
  };

  useEffect(() => {
    getPackage();
    getSummary();
  }, [
    pickupForm?.location?.lat,
    pickupForm?.location?.lon,
    pickupForm?.detail,
    dropoffForm?.location?.lat,
    dropoffForm?.location?.lon,
    dropoffForm?.detail,
    district,
    selectedPackage,
    showOrderSchedule,
  ]);

  const handleSelectLocation = async (
    location: any,
    type: 'dropoff' | 'pickup',
  ) => {
    const resdetail = await getDetailsFromCoordinates(
      location?.lat,
      location?.lon,
    );

    if (isOutsideSelectedLocation(resdetail)) {
      return;
    }
    if (type === 'pickup') {
      setPickupForm((prev: any) => ({
        ...prev,
        location: {
          lat: JSON.parse(location?.lat),
          lon: JSON.parse(location?.lon),
          name: location?.name,
          display_name: location?.display_name,
        },
      }));
    } else {
      setDropoffForm((prev: any) => ({
        ...prev,
        location: {
          lat: JSON.parse(location?.lat),
          lon: JSON.parse(location?.lon),
          name: location?.name,
          display_name: location?.display_name,
        },
      }));
    }
    bottomSheetFormRef.current?.snapToIndex(0);
  };

  const isOutsideSelectedLocation = (resdetail: any) => {
    if (
      resdetail?.address?.state?.toLowerCase() !==
        district?.name?.toLowerCase() &&
      resdetail?.address?.country?.toLowerCase() !==
        district?.name?.toLowerCase() &&
      !resdetail?.address?.city
        ?.toLowerCase()
        ?.includes(district?.name?.toLowerCase())
    ) {
      showToast({
        message: t('detail_order.validasi_outside_loc'),
        title: t('global.alert.warning'),
        type: 'warning',
      });
      return true;
    }
    return false;
  };

  const handleMapTap = async (
    message: {
      event: string;
      payload: {touchLatLng: {lat: any; lng: any}};
    },
    type: 'dropoff' | 'pickup',
  ) => {
    if (message?.event === 'onMapClicked') {
      const {lat, lng} = message.payload.touchLatLng;
      // console.log('message.payload = ', message);
      const resdetail = await getDetailsFromCoordinates(lat, lng);
      console.log('resdetail  ', resdetail?.address, district?.name);

      if (isOutsideSelectedLocation(resdetail)) {
        return;
      }

      if (type === 'pickup') {
        setPickupForm((prev: any) => ({
          ...prev,
          location: {
            lat: lat,
            lon: lng,
            name: resdetail?.name || resdetail?.address?.city,
            display_name: resdetail?.display_name,
          },
        }));
      }
      if (type === 'dropoff') {
        console.log('lat  ', lat, lng);
        setDropoffForm((prev: any) => ({
          ...prev,
          location: {
            lat: lat,
            lon: lng,
            name: resdetail?.name || resdetail?.address?.city,
            display_name: resdetail?.display_name,
          },
        }));
      }
    }
  };

  const onFocusBottomSheet = () => {
    bottomSheetFormRef.current?.snapToIndex(1);
  };

  const nextAction = async () => {
    if (!dates?.date) {
      setShowOrderSchedule(true);
    } else {
      showPopupConfirm();
    }
  };
  const handleOrderOneWay = async () => {
    const formData: any = {
      booking_price: summaryOrder.booking_price,
      service_fee: summaryOrder.service_fee,
      rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
      rental_return_fee: summaryOrder.rental_return_fee || 0,
      insurance_fee: summaryOrder.insurance_fee,
      email: userProfile.email,
      order_type_id: 6,
      // phone_number: userProfile.phone,
      phone_number: userProfile?.phone,
      phone_country_code: userProfile?.phone_code,
      deposit: summaryOrder.deposit,
      currency: district?.currency,
      deposit_e_toll: summaryOrder?.deposit_e_toll,
      total_payment: summaryOrder.total_payment,
      user_name: userProfile.name,
      referral_code: referrer?.referral_code,
      price_per_day: summaryOrder?.price_per_day || 0,
      wa_number: userProfile?.phone,
      exceed_passenger_price: summaryOrder?.exced_max_passenger_charge,
      order_detail: {
        currency: district?.currency,
        package_id: selectedPackage?.id,
        end_booking_date: moment(dates?.date, 'YYYY/MM/DD').format(
          'YYYY-MM-DD',
        ),
        end_booking_time: moment(dates?.time, 'HHmm').format('HH:mm'),
        start_booking_date: moment(dates?.date, 'YYYY/MM/DD').format(
          'YYYY-MM-DD',
        ),
        start_booking_time: moment(dates?.time, 'HHmm').format('HH:mm'),
        loc_time_id: district?.time_zone_identifier,
        location_id: district?.id,

        origin: {
          lat: pickupForm?.location?.lat,
          long: pickupForm?.location?.lon,
        },
        destination: {
          lat: dropoffForm?.location?.lat,
          long: dropoffForm?.location?.lon,
        },
        rental_delivery_location: pickupForm?.location?.display_name || '',
        rental_delivery_location_detail: pickupForm?.detail || '',
        rental_return_location: dropoffForm?.location?.display_name || '',
        rental_return_location_detail: dropoffForm?.detail || '',
        rental_return_notes: dropoffForm?.detail,
        rental_delivery_notes: pickupForm?.detail,
      },
      type: 'FULL',
      remainder: 0,
      down_payment: 0,
      addons: [],
      outside_operational_charge: 0,
    };
    console.log('formData = ', formData);
    setLoader(true);

    // setLoader(true);
    const res = await dispatch(createOrder(formData as any));

    setLoader(false);
    if (res.type.includes('rejected')) {
      return;
    }

    navigation.navigate('PaymentMethod', {
      transaction_key: res.payload.data.order.transaction_key,
    });
    dispatch(setSelectedVoucher([]));
    await getAnalytics().logEvent('booking_one_way', {
      id: new Date().toString(),
      item: 'Daily',
      description: ['one_way'],
    });
  };
  const showPopupConfirm = () => {
    showBSheet({
      snapPoint: ['65%', '80%'],
      content: (
        <View
          style={{
            alignItems: 'center',
            margin: 20,
            width: '90%',
          }}>
          <Image
            source={ic_car_rent}
            style={{width: 170, height: 170, marginBottom: 50}}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
            }}>
            {t('detail_order.overtime_confirmation_header')}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'center',
            }}>
            {t('detail_order.confirm_popup_desc')}
          </Text>

          <Button
            _theme="navy"
            onPress={() => {
              dispatch(toggleBSheet(false));
              // if (
              //   !userProfile?.personal_info?.ktp ||
              //   !userProfile?.personal_info?.sim
              // ) {
              //   showToast({
              //     message: t('global.alert.license'),
              //     title: t('global.alert.warning'),
              //     type: 'warning',
              //   });
              //   navigation.navigate('Profile');
              //   return;
              // }
              handleOrderOneWay();
            }}
            title={t('global.button.yesNext')}
            styleWrapper={{width: '90%', marginTop: 20}}
          />
          <Button
            _theme="white"
            onPress={() => {
              dispatch(toggleBSheet(false));
            }}
            title={t('global.button.cancel')}
            styleWrapper={{
              width: '90%',
              marginTop: 20,
              borderWidth: 1,
              borderColor: '#666',
            }}
          />
        </View>
      ),
    });
  };

  if (showOrderSchedule) {
    return (
      <OrderScheduleModal
        setIsVisible={setShowOrderSchedule}
        visible={showOrderSchedule}
        dates={dates}
        setDates={setDates}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      {activeForm === 'package' && (
        <FloatingLocName
          dropoffName={dropoffForm?.location?.display_name!}
          pickupName={pickupForm?.location?.display_name!}
          onPress={() => {
            setActiveForm('empty');
            setSnapPoints(['80%', '90%']);
            bottomSheetFormRef.current?.snapToIndex(0);
          }}
        />
      )}

      {/* <TouchableOpacity style={styles.button} onPress={handleResetCenter}>
        <Image source={ic_center_map} style={{width: 28, height: 28}} />
      </TouchableOpacity> */}

      {activeForm === 'package' && (
        <FooterNextBottom
          dropoffForm={dropoffForm!}
          pickupForm={pickupForm!}
          onPress={nextAction}
          dates={dates!}
          currency_prefix={district?.currency}
          setShowSchedule={setShowOrderSchedule}
          loader={loader}
          disabled={!selectedPackage?.id}
        />
      )}

      {activeForm === 'empty' && (
        <TripMap
          handleMapTap={(event: any) => {}}
          lat={currentLoc?.lat!}
          ln={currentLoc?.lon!}
          centerMap={districtLatLn}
          pinpoin={
            'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-navy.png'
          }
        />
      )}

      {activeForm === 'pickup' && Boolean(districtLatLn?.latitude) && (
        <TripMap
          handleMapTap={(event: any) => handleMapTap(event, 'pickup')}
          lat={pickupForm?.location.lat!}
          ln={pickupForm?.location.lon!}
          centerMap={districtLatLn}
          pinpoin={
            'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-navy.png'
          }
        />
      )}
      {activeForm === 'dropoff' && (
        <TripMap
          handleMapTap={(event: any) => handleMapTap(event, 'dropoff')}
          lat={dropoffForm?.location.lat!}
          ln={dropoffForm?.location.lon!}
          centerMap={districtLatLn}
          pinpoin={
            'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-yellow.png'
          }
        />
      )}
      {activeForm === 'package' && (
        <PackageMap
          dropoffLat={dropoffForm?.location.lat!}
          dropoffLn={dropoffForm?.location.lon!}
          pickupLat={pickupForm?.location.lat!}
          pickupLn={pickupForm?.location.lon!}
        />
      )}
      <BottomSheet
        ref={bottomSheetFormRef as any}
        index={0}
        snapPoints={snapPoints}>
        {activeForm === 'empty' && (
          <EmptyFormComp
            setActiveForm={setActiveForm}
            setSnapPoints={setSnapPoints}
            pickupForm={pickupForm!}
            dropoffForm={dropoffForm!}
            district={district}
            setDistrict={setDistrict}
            resetForm={resetForm}
            currentLoc={currentLoc}
          />
        )}
        {activeForm === 'pickup' && (
          <TripFormComp
            form={pickupForm!}
            setForm={setPickupForm}
            handleSelectLocation={(event: any) =>
              handleSelectLocation(event, 'pickup')
            }
            onFocus={onFocusBottomSheet}
            handleResetCenter={() => handleResetCenter('pickup')}
            currentLoc={currentLoc!}
            placeholder={t('one_way.pickup_placeholder')}
            title={t('one_way.pickup_location')}
            goBack={() => {
              setActiveForm('empty');
              setSnapPoints(['70%', '90%']);
              bottomSheetFormRef.current?.snapToIndex(1);
            }}
          />
        )}

        {activeForm === 'dropoff' && (
          <TripFormComp
            form={dropoffForm!}
            setForm={setDropoffForm}
            handleSelectLocation={(event: any) =>
              handleSelectLocation(event, 'dropoff')
            }
            onFocus={onFocusBottomSheet}
            handleResetCenter={() => handleResetCenter('dropoff')}
            currentLoc={currentLoc!}
            title={t('one_way.dropoff_location')}
            placeholder={t('one_way.dropoff_placeholder_description')}
            goBack={() => {
              setActiveForm('empty');
              setSnapPoints(['70%', '90%']);
              bottomSheetFormRef.current?.snapToIndex(1);
            }}
          />
        )}
        {activeForm === 'package' && (
          <SelectPackageForm
            data={dataPackage as any}
            currency_prefix={
              district?.name?.toLowerCase() === 'singapore' ? 'SGD' : ''
            }
            // onPress={nextAction}
            setSelectedPackage={setSelectedPackage}
            selectedPackage={selectedPackage!}
            goBack={() => {
              setActiveForm('empty');
              setSnapPoints(['90%']);
              bottomSheetFormRef.current?.snapToIndex(0);
            }}
          />
        )}
      </BottomSheet>
      {activeForm === 'pickup' && (
        <View style={styles.btnPickupConfirm}>
          <Button
            _theme="navy"
            onPress={() => setActiveForm('dropoff')}
            title={t('global.button.confirm')}
            disabled={
              !pickupForm?.location?.display_name ||
              !pickupForm?.location?.lat ||
              !pickupForm?.location?.lon
            }
          />
        </View>
      )}

      {activeForm === 'dropoff' && (
        <View style={styles.btnPickupConfirm}>
          <Button
            _theme="navy"
            onPress={() => {
              setActiveForm('package');
              setSnapPoints(['50%']);
              bottomSheetFormRef.current?.snapToIndex(0);
            }}
            title={t('global.button.confirm')}
            disabled={
              !dropoffForm?.location?.display_name ||
              !dropoffForm?.location?.lat ||
              !dropoffForm?.location?.lon
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  transparentBox: {
    position: 'absolute',
    top: 10,
    width: WINDOW_WIDTH - 30,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 99,
    alignSelf: 'center',
  },
  btnPickupConfirm: {
    position: 'absolute',
    bottom: 20,
    zIndex: 999,
    width: WINDOW_WIDTH - 30,
    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    bottom: WINDOW_HEIGHT / 2,
    paddingVertical: 10,
    right: 10,
    // paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 100,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OneWayServiceScreen;
