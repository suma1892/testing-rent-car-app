import React, {Dispatch, FC, memo, SetStateAction} from 'react';
import {h1, h5} from 'utils/styles';
import {ic_clock, ic_info_error, ic_rounded_close} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  IForm,
  IFormError,
} from 'screens/DailyListCarScreen/hooks/useDailyCarSearchForm';
import RentalStartTimeModalContent from './RentalStartTimeModalContent';

type RentStartTimeInputProps = {
  onClear: () => void;
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  formError: IFormError;
  setFormError: Dispatch<SetStateAction<IFormError>>;
  title?: string;
  value?: string;
  custom_field?: string;
  disabled?: boolean;
  dateWrapperStyle?: ViewStyle;
};

const RentalStartTimeInput: FC<any> = ({
  onClear,
  form,
  setForm,
  formError,
  dateWrapperStyle,
  setFormError,
  title = '',
  value = '',
  custom_field = '',
  disabled,
}: RentStartTimeInputProps) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const hour_value = value || form?.time;

  const showRentalStartTimeModal = () => {
    showBSheet({
      snapPoint: ['65%', '80%', '80%'],
      content: (
        <RentalStartTimeModalContent
          title={title}
          form={form}
          onSubmit={({hours, minutes}) => {
            console.log('toe ', `${hours}${minutes}`);
            setForm(prev => ({
              ...prev,
              [custom_field]: `${hours}${minutes}`,
            }));
            dispatch(toggleBSheet(false));
          }}
        />
      ),
    });
  };

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={showRentalStartTimeModal}
        style={[rowCenter, styles.wrapper]}
        disabled={disabled}>
        <Image source={ic_clock} style={iconSize} />

        <View style={[styles.editableTimeInputContainer, dateWrapperStyle]}>
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
    </View>
  );
};

export default memo(RentalStartTimeInput);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 10,
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
