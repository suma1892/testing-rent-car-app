import React, {Dispatch, FC, SetStateAction} from 'react';
import useRentalDurationInput from '../hooks/useRentalDurationInput';
import {h1, h5} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {IForm, IFormError} from '../hooks/useDailyCarSearchForm';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_info_error,
  ic_rental_duration,
  ic_rounded_close,
} from 'assets/icons';

export type RentalDurationInputProps = {
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  formError: IFormError;
  setFormError: Dispatch<SetStateAction<IFormError>>;
};

const RentalDurationInput: FC<RentalDurationInputProps> = ({
  form,
  setForm,
  formError,
  setFormError,
}) => {
  const {t} = useTranslation();
  const {value, showRentalDurationModal, onClear} = useRentalDurationInput({
    form,
    setForm,
    formError,
    setFormError,
  });

  return (
    <View style={{width: '48%'}}>
      <Text style={h1}>{t('Home.daily.rental_duration')}</Text>

      <TouchableOpacity
        onPress={showRentalDurationModal}
        style={[rowCenter, styles.wrapper]}>
        <Image source={ic_rental_duration} style={iconSize} />

        <View style={styles.editableTimeInputContainer}>
          <Text
            numberOfLines={1}
            style={[
              h5,
              {
                marginLeft: 10,
                fontWeight: value ? '700' : '300',
                color: value ? '#000' : theme.colors.grey4,
              },
            ]}>
            {value || t('Home.daily.select_rental_duration')}
          </Text>

          {value && (
            <TouchableOpacity onPress={onClear}>
              <Image source={ic_rounded_close} style={iconCustomSize(12)} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {formError?.error_jam_sewa && (
        <View
          style={[{alignSelf: 'flex-end', marginTop: 5, flexDirection: 'row'}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 10, color: theme.colors.red}]}>
            {' '}
            {formError?.error_jam_sewa}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RentalDurationInput;

const styles = StyleSheet.create({
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
