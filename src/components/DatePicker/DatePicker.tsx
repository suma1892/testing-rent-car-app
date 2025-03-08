import React, {ReactNode, useState} from 'react';
import {dateFormatter} from 'utils/functions';
import {h1, h5} from 'utils/styles';
import {
  ic_calendar,
  ic_clock,
  ic_info_error,
  ic_rounded_close,
} from 'assets/icons';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  rowCenter,
  iconSize,
  iconCustomSize,
  colorSelecting,
} from 'utils/mixins';
import {useTranslation} from 'react-i18next';

interface IProps {
  title: string;
  placeholder: string;
  mode: 'clock' | 'date';
  containerStyle: ViewStyle;
  inputContainerStyle?: ViewStyle;
  content?: ReactNode;
  value: string;
  disableTime?: boolean;
  errorMessage?: string;
  snapPoint?: string[];
  onClear?: () => void;
  disabled?: boolean;
  dateWrapperStyle?: ViewStyle;
}

const CustomDatePicker = ({
  title,
  mode,
  placeholder,
  containerStyle,
  inputContainerStyle,
  value,
  content,
  disableTime = false,
  errorMessage,
  snapPoint,
  onClear,
  disabled,
  dateWrapperStyle,
}: IProps) => {
  const {t} = useTranslation();
  const [alertHour, setAlertHour] = useState('');

  const methods = {
    handleBSheet: () => {
      showBSheet({
        snapPoint,
        content,
      });
    },
  };

  return (
    <View style={containerStyle}>
      <Text style={[h1, {marginBottom: 12}]}>{title}</Text>
      {mode === 'clock' && alertHour && (
        <Text style={styles.textAlertClock}>{alertHour}</Text>
      )}
      <TouchableOpacity
        style={[rowCenter, styles.wrapper, inputContainerStyle]}
        onPress={methods.handleBSheet}
        disabled={disabled}>
        <Image
          source={mode === 'clock' ? ic_clock : ic_calendar}
          style={iconSize}
        />
        {mode === 'date' && (
          <View style={[styles.dateInput, dateWrapperStyle]}>
            <View>
              <Text style={[h5, colorSelecting(value), {marginLeft: 10}]}>
                {dateFormatter(value) || placeholder}
              </Text>
            </View>

            {!!value && (
              <TouchableOpacity onPress={onClear} style={{zIndex: 99}}>
                <Image source={ic_rounded_close} style={iconCustomSize(15)} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {mode === 'clock' && !disableTime && (
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={methods.handleBSheet}>
            <Text>
              {value?.slice(0, 2) || '00'} :{' '}
              {value?.length > 2 ? value.slice(-2) : '00'}
            </Text>
          </TouchableOpacity>
        )}

        {mode === 'clock' && disableTime && (
          <Text style={styles.inputContainer}>
            {value?.slice(0, 2) || '00'} :{' '}
            {value?.length > 2 ? value.slice(-2) : '00'}
          </Text>
        )}
      </TouchableOpacity>
      {mode === 'clock' && (
        <Text style={styles.textFormatHour}>
          {t('Home.daily.format_time_24_hours')}
        </Text>
      )}
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

export default CustomDatePicker;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    paddingHorizontal: 12,
    borderRadius: 5,
    // marginTop: 7,
    width: '100%',
    paddingVertical: 16,
    alignSelf: 'flex-start',
  },
  textFormatHour: {
    fontSize: 10,
    alignSelf: 'flex-end',
    fontStyle: 'italic',
    color: theme.colors.grey4,
  },
  textAlertClock: {
    fontSize: 10,
    color: '#f79616',
  },
  inputContainer: {marginLeft: 10, marginVertical: 4},
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
  },
});
