import PickupTimeModalContent from './PickupTimeModalContent';
import React, {Dispatch, FC, memo, SetStateAction} from 'react';
import {h1, h5} from 'utils/styles';
import {ic_clock, ic_info_error, ic_rounded_close} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {IForm, IFormError} from '../hooks/useAirportCarSearchForm';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type PickupTimeInputProps = {
  onClear: () => void;
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  formError: IFormError;
  setFormError: Dispatch<SetStateAction<IFormError>>;
  title?: string;
  value?: string;
  isAirportTransfer?: boolean;
  disabled?: boolean;
  setCustomValue?: (v: string) => void;
};

const PickupTimeInput: FC<PickupTimeInputProps> = ({
  onClear,
  form,
  setForm,
  formError,
  setFormError,
  title = '',
  value = '',
  isAirportTransfer,
  disabled,
  setCustomValue,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const hour_value = value || form?.pickup_time;

  const showRentalStartTimeModal = () => {
    showBSheet({
      snapPoint: ['60%', '60%',],
      content: (
        <PickupTimeModalContent
          title={title}
          form={form}
          isAirportTransfer={isAirportTransfer}
          onSubmit={({hours, minutes}) => {
            console.log('`${hours}${minutes}`', `${hours}${minutes}`);
            setForm({
              ...form,
              pickup_time: `${hours}${minutes}`,
            });
            setFormError({
              ...formError,
              error_pickup_time: '',
            });
            dispatch(toggleBSheet(false));
            if (setCustomValue) {
              setCustomValue(`${hours}${minutes}`);
            }
          }}
        />
      ),
    });
  };

  return (
    <View style={{width: '37%'}}>
      <Text style={[h1, {marginBottom: 12}]}>
        {title || t('Home.daily.rent_start_time')}
      </Text>

      <TouchableOpacity
        onPress={showRentalStartTimeModal}
        style={[rowCenter, styles.wrapper]}
        disabled={disabled}>
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
      {formError?.error_pickup_time && (
        <View
          style={[{alignSelf: 'flex-end', marginTop: 5, flexDirection: 'row'}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 10, color: theme.colors.red}]}>
            {' '}
            {formError?.error_pickup_time}
          </Text>
        </View>
      )}
    </View>
  );
};

export default memo(PickupTimeInput);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editableTimeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
  },
});
