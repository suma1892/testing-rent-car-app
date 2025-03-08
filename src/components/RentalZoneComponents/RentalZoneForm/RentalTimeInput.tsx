import React, {FC, memo} from 'react';
import RentalTimeModalContent from './RentalTimeModalContent';
import {h1, h5} from 'utils/styles';
import {ic_clock, ic_info_error, ic_rounded_close} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type RentTimeInputProps = {
  onClear: () => void;
  title?: string;
  value?: string;
  disabled?: boolean;
  errorMessage?: string;
  startTime?: string;
  isEndTime?: boolean;
  onSelect: (val: string) => void;
};

const RentalTimeInput: FC<RentTimeInputProps> = ({
  onClear,
  title = '',
  value = '',
  disabled,
  errorMessage,
  startTime,
  isEndTime,
  onSelect
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const showRentalStartTimeModal = () => {
    showBSheet({
      snapPoint: ['80%', '80%'],
      content: (
        <RentalTimeModalContent
          title={title}
          value={value}
          isEndTime={isEndTime}
          startTime={startTime}
          onSubmit={({hours, minutes}) => {
            onSelect(`${hours}${minutes}`);
            dispatch(toggleBSheet(false));
          }}
        />
      ),
    });
  };

  return (
    <View style={{width: '48%'}}>
      <Text style={h1}>{title || t('Home.daily.rent_start_time')}</Text>

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
                color: value ? '#000' : theme.colors.grey4,
              },
            ]}>
            {value
              ? `${
                  value?.slice(0, value.length / 2) +
                  ' : ' +
                  value?.slice(-value.length / 2)
                }`
              : '00 : 00'}
          </Text>

          {!!value && (
            <TouchableOpacity onPress={onClear}>
              <Image
                source={ic_rounded_close}
                style={[iconCustomSize(15), {}]}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {errorMessage && (
        <View
          style={[{alignSelf: 'flex-end', marginTop: 5, flexDirection: 'row'}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 10, color: theme.colors.red}]}>
            {' '}
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default memo(RentalTimeInput);

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
