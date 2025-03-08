import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {currencyFormat} from 'utils/currencyFormat';
import {h1, h4} from 'utils/styles';
import {
  FONT_SIZE_10,
  FONT_SIZE_16,
  FONT_SIZE_18,
  FONT_WEIGHT_BOLD,
} from 'utils/typography';
import {
  ic_arrow_down,
  ic_arrow_left,
  ic_blue_check,
  ic_car_rent,
  ic_info,
  ic_info2,
  ic_pinpoin,
  ic_uncheck,
} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {theme} from 'utils';
import Button from 'components/Button';
import {orderState} from 'redux/features/order/orderSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {showBSheet} from 'utils/BSheet';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  WINDOW_HEIGHT,
} from '@gorhom/bottom-sheet';
import {
  appDataState,
  setSelectedVoucher,
} from 'redux/features/appData/appDataSlice';
import {getLocationId} from 'redux/effects';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';
import {createOrder} from 'redux/features/order/orderAPI';
import {editUser} from 'redux/features/user/userAPI';
import {userState} from 'redux/features/user/userSlice';
import {useNavigation} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import moment from 'moment';

const ButtonPayment = ({form}: {form: any}) => {
  const summaryOrder = useAppSelector(orderState).summaryOrder;
  const {globalConfig, formAirportTransfer, userProfile} =
    useAppSelector(appDataState);
  const {t} = useTranslation();
  // console.log(summaryOrder);
  const referrer = useAppSelector(userState)?.referrer;
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const tncRef = useRef<BottomSheetModal>(null);
  const [isChecklist, setIsChecklist] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  const [isAgreeTnC, setIsAgreeTnC] = useState(false);
  const showDetail = () => {
    showBSheet({
      content: (
        <View
          style={{
            flex: 1,
            width: WINDOW_WIDTH,
            // alignItems: 'flex-start',
            padding: 20,
          }}>
          <BottomSheetScrollView>
            <View>
              <Text style={[h1, {fontSize: FONT_SIZE_18, marginBottom: 30}]}>
                {t('detail_order.detail_payment')}
              </Text>

              <Text style={[h1, {marginBottom: 16}]}>
                {t('detail_order.detail_trip')}
              </Text>

              <Text style={[h1, {marginBottom: 16}]}>Toyota Alphard</Text>

              <View
                style={[
                  rowCenter,
                  {justifyContent: 'space-between', marginBottom: 16},
                ]}>
                <Text style={[h4]}>{t('myBooking.pickup_date')}</Text>
                <Text style={[h4]}>
                  {moment(formAirportTransfer?.pickup_date).format(
                    'DD MMM YYYY',
                  )}
                </Text>
              </View>

              <View
                style={[
                  rowCenter,
                  {justifyContent: 'space-between', marginBottom: 16},
                ]}>
                <Text style={[h4]}>{t('myBooking.pickup_time')}</Text>
                <Text style={[h4]}>
                  {moment(formAirportTransfer?.pickup_time, 'HHmm').format(
                    'HH:mm',
                  )}
                </Text>
              </View>

              <View style={[rowCenter, {alignItems: 'flex-start'}]}>
                <Image
                  source={ic_pinpoin}
                  style={[iconCustomSize(18), {tintColor: theme.colors.orange}]}
                />
                <View style={{marginLeft: 14}}>
                  <Text style={[h4, {fontSize: FONT_SIZE_10, marginBottom: 8}]}>
                    {t('myBooking.pickup')}
                  </Text>
                  <Text style={[h1]}>
                    {formAirportTransfer?.pickup_location?.name}
                  </Text>
                  <Text style={[h4, {lineHeight: 20}]}>
                    {formAirportTransfer?.pickup_location?.display_name || ''}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  rowCenter,
                  {alignItems: 'flex-start', marginBottom: 16},
                ]}>
                <Image source={ic_pinpoin} style={iconCustomSize(18)} />
                <View style={{marginLeft: 14}}>
                  <Text style={[h4, {fontSize: FONT_SIZE_10, marginBottom: 8}]}>
                    {t('myBooking.dropoff')}
                  </Text>
                  <Text style={[h1]}>
                    {formAirportTransfer?.dropoff_location?.name}
                  </Text>
                  <Text style={[h4, {lineHeight: 20}]}>
                    {formAirportTransfer?.dropoff_location?.display_name || '-'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.grey6,
                  marginVertical: 16,
                }}
              />
              <Text style={[h1, {marginBottom: 16}]}>
                {t('detail_order.summary.contact_detail')}
              </Text>

              <Text style={[h4, {marginBottom: 8}]}>{userProfile?.name}</Text>
              <Text style={[h4]}>
                {userProfile?.email}. {userProfile?.phone}
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.grey6,
                  marginVertical: 16,
                }}
              />

              <Text style={[h1, {marginBottom: 16}]}>
                {t('detail_order.summary.detail_cost')}
              </Text>

              <View
                style={[
                  rowCenter,
                  {justifyContent: 'space-between', marginBottom: 16},
                ]}>
                <Text style={[h4]}>{t('detail_order.booking_price')}</Text>
                <Text style={[h4]}>
                  {currencyFormat(
                    summaryOrder?.booking_price,
                    formAirportTransfer.pickup_location?.location?.currency,
                  )}
                </Text>
              </View>

              {summaryOrder?.outside_operational_charge > 0 && (
                <View
                  style={[
                    rowCenter,
                    {marginBottom: 16, justifyContent: 'space-between'},
                  ]}>
                  <Text style={[h4]}>
                    {t('detail_order.outside_operational_hour_charge')}
                  </Text>
                  <Text style={[h4]}>
                    {currencyFormat(
                      summaryOrder?.outside_operational_charge,
                      formAirportTransfer.pickup_location?.location?.currency,
                    )}
                  </Text>
                </View>
              )}

              <View
                style={{
                  marginBottom: 32,
                }}
              />

              <View
                style={[
                  rowCenter,
                  {marginBottom: 16, justifyContent: 'space-between'},
                ]}>
                <Text style={[h1, {fontSize: 14}]}>
                  {t('detail_order.summary.totalPayment')}
                </Text>
                <Text style={[h1, {color: theme.colors.navy}]}>
                  {currencyFormat(
                    summaryOrder?.total_payment,
                    formAirportTransfer.pickup_location?.location?.currency,
                  )}
                </Text>
              </View>
            </View>
          </BottomSheetScrollView>
        </View>
      ),
      snapPoint: ['70%', '90%'],
    });
  };

  const handleOrderAirportTransfer = async () => {
    let locId: any = {};
    try {
      locId = await getLocationId(
        Number(formAirportTransfer?.pickup_location?.location_id),
      );
      const {flight_number, adults, pickup_location, meet_and_greet_name} =
        formAirportTransfer || {};

      const isAirportPickup =
        pickup_location?.airport_location_type?.name === 'airport';

      if (
        !flight_number ||
        adults <= 0 ||
        (isAirportPickup && !meet_and_greet_name)
      ) {
        showToast({
          message: t('detail_order.warning_form'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        return;
      }
      if (form?.phone?.length <= 8) {
        showToast({
          message: t('detail_order.min_phone'),
          title: t('global.alert.warning'),
          type: 'warning',
        });
        // status = false;
        return;
      }

      const formData: any = {
        order_type_id: 7,
        user_name: userProfile.name,
        // phone_number: userProfile?.phone,
        // phone_country_code: userProfile?.phone_code,
        // wa_number: userProfile?.phone,
        phone_number: form?.phone,
        phone_country_code: form?.code,
        wa_number: form?.phone,
        email: userProfile.email,
        booking_price: summaryOrder.booking_price,
        currency: formAirportTransfer?.pickup_location?.location?.currency,
        price_per_day: summaryOrder?.price_per_day || 0,
        service_fee: summaryOrder.service_fee,
        insurance_fee: summaryOrder.insurance_fee,
        total_payment: summaryOrder.total_payment,
        refferal_code: '',
        deposit: summaryOrder.deposit,
        type: 'FULL',
        remainder: 0,
        down_payment: 0,
        rental_delivery_fee: summaryOrder.rental_delivery_fee || 0,
        rental_return_fee: summaryOrder.rental_return_fee || 0,
        airport_transfer_package_id:
          formAirportTransfer?.airport_transfer_package_id,
        referral_code: referrer?.referral_code,
        outside_operational_charge:
          summaryOrder?.outside_operational_charge || 0,
        customer_name_meet_and_greet:
          formAirportTransfer?.meet_and_greet_name || '',
        order_detail: {
          vehicle_id: parseInt(
            globalConfig?.find(x => x?.key === 'airport_vehicle_id')?.value ||
              '0',
            10,
          ),
          is_take_from_rental_office: false,
          start_booking_date: `${moment(
            formAirportTransfer.pickup_date,
            'YYYY/MM/DD',
          )
            .format('YYYY-MM-DD')
            .toString()}`, //formAirportTransfer.pickup_date,
          start_booking_time: formAirportTransfer.pickup_time?.replace(
            /(\d{2})(\d{2})/,
            '$1:$2',
          ),
          location_id: formAirportTransfer?.pickup_location?.location_id,
          loc_time_id: locId?.time_zone_identifier,
          end_booking_date: `${moment(
            formAirportTransfer.pickup_date,
            'YYYY/MM/DD',
          )
            .format('YYYY-MM-DD')
            .toString()}`,
          end_booking_time: formAirportTransfer.pickup_time?.replace(
            /(\d{2})(\d{2})/,
            '$1:$2',
          ),
          rental_delivery_location: formAirportTransfer?.pickup_location?.name,
          rental_delivery_location_detail:
            formAirportTransfer?.pickup_location?.display_name,
          rental_return_location: formAirportTransfer?.dropoff_location?.name,
          rental_return_location_detail:
            formAirportTransfer?.dropoff_location?.display_name,
          landing_time: formAirportTransfer.pickup_time?.replace(
            /(\d{2})(\d{2})/,
            '$1:$2',
          ),
          flight_number: formAirportTransfer.flight_number || '',
          without_driver: false,
          adult_passenger: formAirportTransfer?.adults,
          child_passenger: formAirportTransfer?.child,
          large_suitcase: formAirportTransfer?.large_suitcase,
          regular_suitcase: formAirportTransfer?.suitcase,
          origin: {
            lat: formAirportTransfer?.pickup_location?.lat,
            long: formAirportTransfer?.pickup_location?.lon,
          },
          destination: {
            lat: formAirportTransfer?.dropoff_location?.lat,
            long: formAirportTransfer?.dropoff_location?.lon,
          },
          customer_name_meet_and_greet:
            formAirportTransfer?.meet_and_greet_name || '',
        },
      };

      if (summaryOrder?.promotion?.id) {
        formData.promotion_id = summaryOrder?.promotion?.id;
      }
      if (summaryOrder?.order_voucher?.length > 0) {
        formData.order_voucher = [...summaryOrder?.order_voucher];
      }
      if (summaryOrder?.point !== 0 || summaryOrder?.point !== undefined) {
        formData.point = summaryOrder?.point;
      }
      console.log('formData ', formData);
      // return;
      setLoader(true);
      const resEditProfile: any = await dispatch(
        editUser({
          ...userProfile,
          phone: form?.phone,
          code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
          phone_code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
          wa_code: form?.code?.includes('+')
            ? form?.code
            : `+${form?.code}` || '+62',
        }),
      );
      if (resEditProfile?.error?.message?.toLowerCase() === 'rejected') {
        setLoader(false);
        return;
      }

      const res = await dispatch(createOrder(formData as any));
      setLoader(false);

      if (res.type.includes('rejected')) {
        return;
      }

      navigation.navigate('PaymentMethod', {
        transaction_key: res.payload.data.order.transaction_key,
      });
      dispatch(setSelectedVoucher([]));
      await analytics().logEvent('booking_airport_transfer', {
        id: new Date().toString(),
        item: 'Daily',
        description: ['airport_transfer'],
      });
    } catch (error) {}
  };

  const showPopupConfirm = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
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

              handleOrderAirportTransfer();
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
  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Toleransi 20px
    setIsBottom(isAtBottom);
  };
  return (
    <View
      style={{padding: 20, backgroundColor: theme.colors.white, elevation: 4}}>
      <Text style={[h1, {marginBottom: 5}]}>
        {t('detail_order.summary.totalPayment')}
      </Text>
      <TouchableOpacity style={[rowCenter]} onPress={showDetail}>
        <Text style={[h1, {fontSize: FONT_SIZE_16, marginRight: 5}]}>
          {currencyFormat(
            summaryOrder?.total_payment,
            formAirportTransfer.pickup_location?.location?.currency,
          )}
        </Text>
        <Image
          source={ic_arrow_down}
          style={iconCustomSize(14)}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[rowCenter, {marginVertical: 17}]}
        onPress={() =>
          isChecklist ? setIsChecklist(false) : tncRef.current?.present()
        }>
        <Image
          source={isChecklist ? ic_blue_check : ic_uncheck}
          style={[iconCustomSize(12), {marginRight: 5, borderRadius: 2}]}
        />
        <Text style={[h4, {fontSize: FONT_SIZE_10}]}>
          {t('detail_order.summary.t&c1')}{' '}
          <Text style={{fontWeight: FONT_WEIGHT_BOLD}}>
            {t('detail_order.summary.t&c2')}
          </Text>{' '}
          {t('detail_order.summary.t&c3')}
        </Text>
        <Image source={ic_info2} style={[iconCustomSize(15)]} />
      </TouchableOpacity>

      <Button
        _theme="navy"
        onPress={showPopupConfirm}
        title={t('global.button.payment')}
        disabled={!isChecklist}
      />

      <BottomSheetModal
        ref={tncRef}
        index={0}
        snapPoints={['80%', '80%']}
        enablePanDownToClose={true}
        // enableDynamicSizing={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              // backgroundColor: theme.colors.navy,
              padding: 15,
              ...rowCenter,
            }}
            onPress={() => tncRef.current?.dismiss()}>
            <Image
              source={ic_arrow_left}
              style={[iconCustomSize(20), {tintColor: theme.colors.black}]}
            />
            <Text
              style={[
                h1,
                {
                  fontSize: FONT_SIZE_16,
                  color: theme.colors.black,
                  marginLeft: 10,
                },
              ]}>
              {t('detail_order.tnc_airport_transfer.title')}
            </Text>
          </TouchableOpacity>
          <BottomSheetScrollView
            style={{padding: 10}}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            <View style={{paddingHorizontal: 5}}>
              <Text style={[h1, {marginVertical: 10}]}>
                1.{' '}
                {t('detail_order.tnc_airport_transfer.booking_payment.title')}
              </Text>

              <View
                style={[
                  rowCenter,
                  {alignItems: 'flex-start', marginVertical: 10},
                ]}>
                <Text style={[h1, {marginRight: 5}]}>● </Text>
                <Text style={[h1, {}]}>
                  {t(
                    'detail_order.tnc_airport_transfer.booking_payment.booking_title',
                  )}
                  <Text style={h4}>
                    {t(
                      'detail_order.tnc_airport_transfer.booking_payment.booking_desc',
                    )}
                  </Text>
                </Text>
              </View>

              <View
                style={[
                  rowCenter,
                  {alignItems: 'flex-start', marginVertical: 0},
                ]}>
                <Text style={[h1, {marginRight: 5}]}>● </Text>
                <Text style={[h1, {}]}>
                  {t(
                    'detail_order.tnc_airport_transfer.booking_payment.payment_title',
                  )}
                </Text>
              </View>

              <View style={{marginLeft: 20}}>
                {[...Array(4)].map((x, i) => (
                  <View style={{flexDirection: 'row', width: '90%'}}>
                    <Text style={[h1, {marginRight: 10}]}>●</Text>

                    <Text style={[h4, {marginBottom: 2}]}>
                      {t(
                        `detail_order.tnc_airport_transfer.booking_payment.payment_desc.${i}` as any,
                      )}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[h1, {marginVertical: 5}]}>
                2. {t('detail_order.tnc_airport_transfer.pricing.title')}
              </Text>

              {[...Array(3)].map((x, i) => (
                <View style={{flexDirection: 'row', width: '90%'}}>
                  <Text style={[h1, {marginRight: 10}]}>●</Text>

                  <Text style={[h1, {marginBottom: 10}]}>
                    {t(
                      `detail_order.tnc_airport_transfer.pricing.pricing_title${
                        i + 1
                      }` as any,
                    )}
                    <Text style={[h4, {lineHeight: 18}]}>
                      {t(
                        `detail_order.tnc_airport_transfer.pricing.pricing_desc${
                          i + 1
                        }` as any,
                      )}
                    </Text>
                  </Text>
                </View>
              ))}

              <Text style={[h1, {marginVertical: 5}]}>
                3. {t('detail_order.tnc_airport_transfer.pickup.title')}
              </Text>

              {[...Array(3)].map((x, i) => (
                <View style={{flexDirection: 'row', width: '90%'}}>
                  <Text style={[h1, {marginRight: 10}]}>●</Text>

                  <Text style={[h1, {marginBottom: 10}]}>
                    {t(
                      `detail_order.tnc_airport_transfer.pickup.pickup_title${
                        i + 1
                      }` as any,
                    )}
                    <Text style={[h4, {lineHeight: 18}]}>
                      {t(
                        `detail_order.tnc_airport_transfer.pickup.pickup_desc${
                          i + 1
                        }` as any,
                      )}
                    </Text>
                  </Text>
                </View>
              ))}

              <Text style={[h1, {marginVertical: 5}]}>
                3. {t('detail_order.tnc_airport_transfer.cancellation.title')}
              </Text>

              {[...Array(3)].map((x, i) => (
                <View style={{flexDirection: 'row', width: '90%'}}>
                  <Text style={[h1, {marginRight: 10}]}>●</Text>

                  <Text style={[h1, {marginBottom: 10}]}>
                    {t(
                      `detail_order.tnc_airport_transfer.cancellation.cancellation_title${
                        i + 1
                      }` as any,
                    )}
                    <Text style={[h4, {lineHeight: 18}]}>
                      {t(
                        `detail_order.tnc_airport_transfer.cancellation.cancellation_desc${
                          i + 1
                        }` as any,
                      )}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </BottomSheetScrollView>
          <View
            style={[
              rowCenter,
              {
                justifyContent: 'space-between',
                marginTop: 20,
                marginBottom: 50,
                marginHorizontal: 20,
              },
            ]}>
            <Button
              _theme="white"
              onPress={() => {
                setIsChecklist(false);
                tncRef.current?.dismiss();
              }}
              title="Don't Agree"
              styleWrapper={{
                borderWidth: 1,
                borderColor: theme.colors.navy,
                borderRadius: 4,
                width: WINDOW_WIDTH / 2.3,
              }}
            />

            <Button
              _theme="navy"
              disabled={!isBottom || isChecklist}
              onPress={() => {
                setIsChecklist(true);
                tncRef.current?.dismiss();
              }}
              title="Agree"
              styleWrapper={{
                width: WINDOW_WIDTH / 2.3,
              }}
            />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default ButtonPayment;

const styles = StyleSheet.create({});
