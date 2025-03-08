import {appDataState} from 'redux/features/appData/appDataSlice';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {FONT_SIZE_12} from 'utils/typography';
import {getBanks} from 'redux/features/appData/appDataAPI';
import {h1, h4, h5} from 'utils/styles';
import {IBanks} from 'types/global.types';
import {ic_arrow_down, ic_glasses} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type SelectBankProps = {
  value?: string;
  onSelect: (item: IBanks) => void;
  errorMessage?: string;
  disabled?: boolean;
  titleStyle?: any
};

const SelectBank: React.FC<SelectBankProps> = ({
  value,
  onSelect,
  errorMessage,
  disabled,
  titleStyle,
}) => {
  const {t} = useTranslation();
  const banks = useAppSelector(appDataState).banks;
  const dispatch = useAppDispatch();
  const shake = useSharedValue(0);

  const [selected, setSelected] = useState('');
  const [keyword, setKeyword] = useState('');
  const sheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['80%', '80%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      sheetRef.current?.close();
    }
  }, []);

  const rText = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: shake.value,
        },
      ],
    };
  });

  const renderItem = ({item}: {item: IBanks}): ReactElement<any, any> => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelected(item.name);
        onSelect(item);
        sheetRef.current?.close();
      }}>
      <Text style={h5}>{item.name}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    dispatch(getBanks());
  }, []);

  useEffect(() => {
    if (!!value) {
      setSelected(value);
    }
  }, [value]);

  return (
    <View style={styles.buttonContainer}>
      <Text style={[h4, {fontSize: 12}, titleStyle]}>{t('global.bank_name')}</Text>
      <View
        style={[
          styles.wrapper,
          {
            borderColor: errorMessage ? theme.colors.red : theme.colors.grey5,
            backgroundColor: disabled ? theme.colors.grey8 : theme.colors.white,
          },
        ]}>
        <TouchableOpacity
          style={[
            rowCenter,
            {
              paddingVertical: 5,
              justifyContent: 'space-between',
            },
          ]}
          disabled={disabled}
          onPress={() => {
            if (!disabled) {
              sheetRef.current?.present();
            }
          }}>
          <Text
            style={[
              h5,
              {
                fontSize: 14,
                marginLeft: 10,
                color: disabled ? theme.colors.grey3 : theme.colors.black,
              },
            ]}>
            {selected || t('global.choose_your_bank')}
          </Text>
          <Image source={ic_arrow_down} style={styles.arrowImage} />
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <Animated.Text style={[styles.textError, rText]}>
          {errorMessage}
        </Animated.Text>
      )}

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: theme.colors.white}}
        handleStyle={{marginBottom: 8, marginTop: 4}}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.75,
          shadowRadius: 24,

          elevation: 24,
        }}>
        <View style={styles.modalContentContainer}>
          <Text style={[h1, {marginBottom: 20}]}>
            {t('global.choose_your_bank')}
          </Text>

          <View style={[rowCenter, styles.searchWrapper]}>
            <TextInput
              style={{
                width: '95%',
                padding: 0,
                margin: 0,
                color: theme.colors.black,
              }}
              placeholder={
                t('detail_order.return_deposit.search_bank_name') as any
              }
              value={keyword}
              onChangeText={setKeyword}
            />
            <Image source={ic_glasses} style={iconCustomSize(15)} />
          </View>

          <BottomSheetFlatList
            data={banks.filter(bank =>
              bank.name.toLowerCase().match(keyword.toLowerCase()),
            )}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default SelectBank;

const styles = StyleSheet.create({
  buttonContainer: {marginTop: 20, width: '100%'},
  wrapper: {
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.grey5,
  },
  arrowImage: {
    width: 12,
    height: 7,
    marginRight: 15,
  },
  modalContentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
  },
  textError: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.red,
    marginTop: 3,
    fontWeight: '500',
    marginRight: 0,
  },
  searchWrapper: {
    width: '100%',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
  },
});
