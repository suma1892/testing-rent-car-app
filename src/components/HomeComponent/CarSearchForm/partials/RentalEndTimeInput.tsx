import React, {Dispatch, FC, SetStateAction} from 'react';
import RentalStartTimeModalContent from './RentalStartTimeModalContent';
import {h1, h5} from 'utils/styles';
import {
  ic_clock,
  ic_info_error,
  ic_rounded_close,
  ic_warning,
} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {IForm, IFormError} from '../hooks/useDailyCarSearchForm';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {showToast} from 'utils/Toast';

type RentEndTimeInputProps = {
  onClear: () => void;
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  formError: IFormError;
  setFormError: Dispatch<SetStateAction<IFormError>>;
  title?: string;
  value?: string;
  custom_field?: string;
};

const RentalEndTimeInput: FC<RentEndTimeInputProps> = ({
  onClear,
  form,
  setForm,
  formError,
  setFormError,
  title = '',
  value = '',
  custom_field = '',
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const hour_value = value || form?.jam_pengembalian;
  const jamSewa = moment(form.jam_sewa, 'HH:mm');
  const jamPengembalian = moment(form.jam_pengembalian, 'HH:mm');
  const overtime = jamPengembalian.diff(jamSewa, 'minute');

  const getDiffHour = (start: string, end: string) => {
    const jamSewa = parseInt(start);
    const jamPengembalian = parseInt(end);

    // Menghitung selisih menit
    const selisihMenit = jamPengembalian - jamSewa;

    // Menghitung selisih jam
    let selisihJam = Math.floor(selisihMenit / 60);

    // Jika selisih menit lebih dari 60, maka perlu diubah menjadi jam
    if (selisihMenit % 60 > 0) {
      selisihJam += 1;
    }
    return selisihJam;
  };

  const AIRPORT_HOURS = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    // '-',
  ];

  const showRentalStartTimeModal = () => {
    showBSheet({
      snapPoint: ['65%', '65%'],
      content: (
        <RentalStartTimeModalContent
          title={title}
          form={form}
          customHours={AIRPORT_HOURS}
          onSubmit={({hours, minutes}) => {
            setForm({
              ...form,
              [custom_field || 'jam_pengembalian']: `${hours}${minutes}`,
            });
            // setFormError({...formError, error_jam_pengembalian: ''});
            const diff = getDiffHour(form?.jam_sewa, `${hours}${minutes}`);
            console.log('diff hour = ', diff);
            // if ( diff < 0) {
            //   setFormError({
            //     ...formError,
            //     error_jam_pengembalian: t('Home.daily.warning_hours'),
            //   });
            // } else {
            setFormError({
              ...formError,
              error_jam_pengembalian: '',
            });
            // }
            // console.log('fortm = ', form);
            dispatch(toggleBSheet(false));
          }}
        />
      ),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[h1]}>{title || t('Home.daily.rent_end_time')}</Text>

      <TouchableOpacity
        onPress={showRentalStartTimeModal}
        style={[rowCenter, styles.wrapper]}
        disabled={!form.jam_sewa}>
        <Image source={ic_clock} style={iconSize} />

        <View style={styles.editableTimeInputContainer}>
          <Text
            style={[
              h5,
              {
                marginLeft: 10,
                color: hour_value ? '#000' : theme.colors.grey4,
              },
            ]}>
            {hour_value
              ? `${
                  hour_value?.slice(0, hour_value.length / 2) +
                  ' : ' +
                  hour_value?.slice(-hour_value.length / 2)
                }`
              : '00 : 00'}
          </Text>

          {!!hour_value && (
            <TouchableOpacity onPress={onClear}>
              <Image
                source={ic_rounded_close}
                style={[iconCustomSize(15), {}]}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {overtime > 0 && (
        <TouchableOpacity
          onPress={() => {
            showToast({
              message: t('Home.daily.overtime'),
              title: 'Info',
              type: 'warning',
            });
          }}
          style={{flexDirection: 'row', marginTop: 5}}>
          <View style={styles.overtimeContainer}>
            <Image source={ic_warning} style={iconCustomSize(16)} />
          </View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '400',
            }}>
            {t('Home.daily.overtime')}
          </Text>
        </TouchableOpacity>
      )}

      {formError?.error_jam_pengembalian && (
        <View
          style={[{alignSelf: 'flex-end', marginTop: 5, flexDirection: 'row'}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 10, color: theme.colors.red}]}>
            {' '}
            {formError?.error_jam_pengembalian}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RentalEndTimeInput;

const styles = StyleSheet.create({
  container: {
    width: '48%',
  },
  overtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    paddingVertical: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 5,
    borderRadius: 5,
    marginTop: 7,
  },
  editableTimeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
  },
});
