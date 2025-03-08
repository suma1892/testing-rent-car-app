import LocationModalContent from './LocationModalContent';
import React, {FC, memo, useCallback, useRef} from 'react';
import {h1, h5} from 'utils/styles';
import {ic_info_error, ic_pinpoin} from 'assets/icons';
import {IRentalLocationResult} from 'types/rental-location.types';
import {setSearchHistory} from 'redux/features/appData/appDataSlice';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  colorSelecting,
  iconCustomSize,
  iconSize,
  rowCenter,
} from 'utils/mixins';
import {FONT_SIZE_12} from 'utils/typography';

interface Props {
  onSelect: (item: IRentalLocationResult) => void;
  selected?: IRentalLocationResult;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  title?: string;
  leftIcon?: any;
  data?: {name: string; id: number; location_id?: number}[];
  placeholder?: string;
}

const Dropdown: FC<Props> = ({
  onSelect,
  selected,
  data = [],
  errorMessage = '',
  containerStyle,
  title,
  leftIcon,
  placeholder,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const DropdownButton = useRef<TouchableOpacity>(null);

  const toggleDropdown = useCallback(() => {
    showBSheet({
      content: <LocationModalContent data={data} onItemPress={onItemPress} />,
    });
  }, [data]);

  const onItemPress = useCallback(
    (item: IRentalLocationResult) => {
      onSelect(item);
      dispatch(setSearchHistory(item));
      dispatch(toggleBSheet(false));
    },
    [dispatch, onSelect],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[h1, styles.title]}>
        {title || t('Home.daily.location')}
      </Text>

      <TouchableOpacity
        ref={DropdownButton}
        style={[
          rowCenter,
          styles.wrapper,
          {
            borderBottomColor: errorMessage
              ? theme.colors.red
              : theme.colors.grey5,
          },
        ]}
        onPress={toggleDropdown}>
        <Image source={leftIcon || ic_pinpoin} style={iconSize} />
        <View style={styles.textWrapper}>
          <Text
            style={[
              colorSelecting(selected?.name),
              styles.text,
              selected?.name ? h1 : h5,
            ]}
            numberOfLines={1}>
            {selected?.name || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      {errorMessage && (
        <View style={[rowCenter, styles.errorWrapper]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, styles.errorText]}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(Dropdown);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: 13.5,
    // fontSize: FONT_SIZE_12,
  },
  wrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    paddingHorizontal: 12,
    borderRadius: 5,
    paddingVertical: 16,
  },
  textWrapper: {
    width: '80%',
  },
  text: {
    marginLeft: 10,
  },
  errorWrapper: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.red,
  },
});
