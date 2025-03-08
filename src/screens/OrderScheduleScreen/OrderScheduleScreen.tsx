import Button from 'components/Button';
import DatePickerComponent from 'components/DatePicker/DatePicker';
import i18next from 'i18next';
import moment from 'moment';
import React from 'react';
import ReactNativeModernDatepicker from 'react-native-modern-datepicker';
import RentalStartTimeInput from './components/RentalStartTimeInput';
import {ic_info2, ic_order_schedule} from 'assets/icons';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  FONT_SIZE_10,
  FONT_SIZE_14,
  FONT_SIZE_16,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';

const OrderScheduleScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: 20,
      }}>
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
          marginBottom: 88,
        }}>
        <Image source={ic_order_schedule} style={{width: 211, height: 180}} />
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
          Perencanaan perjalanan tanpa harus menunggu, karena sudah dijadwalkan
        </Text>
      </View>

      <DatePickerComponent
        mode="date"
        placeholder={'Pilih Tanggal'}
        title={''}
        containerStyle={{}}
        value=""
        // value={form.tanggal_pengembalian ?? ''}
        snapPoint={['60%', '60%']}
        // onClear={() => setForm(prev => ({...prev, tanggal_pengembalian: ''}))}
        content={
          <View>
            <ReactNativeModernDatepicker
              style={{width: WINDOW_WIDTH}}
              isMandarin={i18next.language === 'cn'}
              // current={
              //   form?.tanggal_pengembalian?.replace(/\//g, '-') ||
              //   form?.tanggal_sewa?.replace(/\//g, '-')
              // }
              minimumDate={moment().add(2, 'day').format('YYYY-MM-DD')}
              // selected={form?.tanggal_pengembalian?.replace(/\//g, '-')}
              // onDateChange={v => handleDateChange(v, 'tanggal_pengembalian')}
              mode="calendar"
            />
          </View>
        }
        // errorMessage={formError.error_tanggal_pengembalian}
        // disabled={!form.tanggal_sewa}
      />
      <RentalStartTimeInput
        // title={t('Home.daily.rent_start_time') as any}
        form={{}}
        // setForm={setForm}
        // formError={formError}
        // setFormError={setFormError}
        // onClear={() =>
        //   setForm(prev => ({...prev, jam_sewa: '', jam_pengembalian: ''}))
        // }
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
          Dengan melanjutkan pesanan ini, maka kamu setuju dengan Syarat dan
          Ketentuan
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          marginTop: 40,
        }}>
        <Button
          _theme="navy"
          title="Jadwalkan"
          onPress={() =>
            navigation.navigate('OneWayService', {
              district: 'Bali',
              date: '12-01-99',
              time: '20:00',
            })
          }
        />

        <Button
          _theme="white"
          title="Batalkan"
          onPress={() => {}}
          styleWrapper={{
            borderWidth: 1,
            borderColor: theme.colors.navy,
            marginTop: 10,
          }}
        />
      </View>
    </View>
  );
};

export default OrderScheduleScreen;

const styles = StyleSheet.create({});
