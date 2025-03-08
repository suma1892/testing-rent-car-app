import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from 'utils';
import {
  iconCustomSize,
  rowCenter,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'utils/mixins';
import Button from 'components/Button';
import {ic_order_schedule, ic_info2, ic_arrow_left_white} from 'assets/icons';
import i18next from 'i18next';
import moment from 'moment';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import RentalStartTimeInput from 'screens/OrderScheduleScreen/components/RentalStartTimeInput';
import DatePickerComponent from 'components/DatePicker/DatePicker';

import {
  FONT_SIZE_16,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_14,
  FONT_WEIGHT_REGULAR,
  FONT_SIZE_10,
} from 'utils/typography';
import {useAppDispatch} from 'redux/hooks';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useTranslation} from 'react-i18next';

type DateValue = {
  date: string;
  time: string;
}

const OrderScheduleModal = ({
  visible,
  setIsVisible,
  title = '',
  dates,
  setDates,
}: {
  visible: boolean;
  setIsVisible: any;
  title?: string;
  dates?: DateValue;
  setDates: any;
}) => {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<DateValue>({
    date: dates?.date || '',
    time: dates?.time || '',
  });
  const {t} = useTranslation();

  useEffect(() => {
    const handleBackButton = () => {
      console.log('showOrderSchedule  ', visible);
      if (visible) {
        // console.log('test show');
        // setIsVisible(prev => !prev);
        return false;
      }

      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <View style={styles.backdrop}>
      <View style={styles.modalWrapper}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white,
            padding: 20,
          }}>
          <TouchableOpacity
            style={[
              rowCenter,
              {
                backgroundColor: theme.colors.navy,
                position: 'absolute',
                top: 0,
                width: WINDOW_WIDTH,
                height: 50,
              },
            ]}
            onPress={() => setIsVisible(false)}>
            <Image source={ic_arrow_left_white} style={styles.headerIcon} />
            <Text style={styles.headerText}>{t('one_way.schedule_order')}</Text>
          </TouchableOpacity>
          <ScrollView>
            <View
              style={{
                marginTop: 50,
                alignItems: 'center',
                marginBottom: 88,
              }}>
              <Image
                source={ic_order_schedule}
                style={{width: 211, height: 180}}
              />
              <Text
                style={{
                  fontSize: FONT_SIZE_16,
                  fontWeight: FONT_WEIGHT_BOLD,
                  marginTop: 20,
                  marginBottom: 8,
                }}>
                {t('one_way.schedule_order')}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 24,
                  fontSize: FONT_SIZE_14,
                  fontWeight: FONT_WEIGHT_REGULAR,
                }}>
                {t('one_way.schedule_order_desc')}
              </Text>
            </View>

            <DatePickerComponent
              mode="date"
              placeholder={'Pilih Tanggal'}
              title={''}
              containerStyle={{}}
              value={values?.date || ''}
              snapPoint={['60%', '60%']}
              onClear={() =>
                setValues((prev: any) => ({
                  ...prev,
                  date: '',
                }))
              }
              dateWrapperStyle={{
                width: '90%',
              }}
              content={
                <View>
                  <ReactNativeModernDatepicker
                    style={{width: WINDOW_WIDTH}}
                    isMandarin={i18next.language === 'cn'}
                    current={values?.date?.replace(/\//g, '-')}
                    minimumDate={moment().add(2, 'day').format('YYYY-MM-DD')}
                    selected={values?.date?.replace(/\//g, '-')}
                    onDateChange={v => {
                      console.log('v =', v);
                      setValues((prev: any) => ({
                        ...prev,
                        date: v,
                      }));
                      setTimeout(() => {
                        dispatch(toggleBSheet(false));
                      }, 200);
                    }}
                    mode="calendar"
                  />
                </View>
              }
              // errorMessage={formError.error_tanggal_pengembalian}
              // disabled={!form.tanggal_sewa}
            />
            <RentalStartTimeInput
              // title={t('Home.daily.rent_start_time') as any}
              form={values}
              value={values?.time || ''}
              dateWrapperStyle={{
                width: '90%',
              }}
              setForm={setValues}
              custom_field={'time'}
              // formError={formError}
              // setFormError={setFormError}
              onClear={() => setValues(prev => ({...prev, time: ''}))}
              // disabled={!form.tanggal_sewa || !form.tanggal_pengembalian}
            />

            <View style={[rowCenter, {marginTop: 10}]}>
              <Image source={ic_info2} style={iconCustomSize(12)} />
              <Text
                style={{
                  fontSize: FONT_SIZE_10,
                  fontWeight: FONT_WEIGHT_REGULAR,
                  marginLeft: 4,
                }}>
                {t('one_way.accept_tnc')}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: 40,
              }}>
              <Button
                _theme="navy"
                title={t('one_way.schedule')}
                disabled={!values?.date || !values?.time}
                onPress={() => {
                  setIsVisible(false);
                  setDates({
                    date: values?.date,
                    time: values?.time,
                  });
                }}
              />

              <Button
                _theme="white"
                title={t('one_way.cancel')}
                onPress={() => setIsVisible(false)}
                styleWrapper={{
                  borderWidth: 1,
                  borderColor: theme.colors.navy,
                  marginTop: 10,
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default OrderScheduleModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 99999999999,
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },

  modalWrapper: {
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrapperHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
  },

  descPin: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: theme.colors.navy,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  closeButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
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
});
