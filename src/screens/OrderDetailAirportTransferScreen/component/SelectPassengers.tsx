import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ic_adult,
  ic_baggage,
  ic_child,
  ic_large_suitcase,
  ic_minus_circle_filled,
  ic_plus_circle_filled,
  ic_suitcase,
  ic_warningSuitcase,
} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize, WINDOW_WIDTH} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import {showBSheet} from 'utils/BSheet';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {FONT_SIZE_18} from 'utils/typography';
import Button from 'components/Button';
import {
  appDataState,
  saveFormAirportTransfer,
} from 'redux/features/appData/appDataSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const SelectPassengers = () => {
  const dispatch = useAppDispatch();
  const {formAirportTransfer, sub_service_type} = useAppSelector(appDataState);
  const {t} = useTranslation();

  const DEFAULT_FORM = {
    suitcase: {
      icon: ic_suitcase,
      title: t('detail_order.passenger_suitcase.suitcase'),
      value: 1,
    },
    // large_suitcase: {
    //   icon: ic_large_suitcase,
    //   title: t('detail_order.passenger_suitcase.large_suitcase'),
    //   value: 0,
    // },
    adults: {
      icon: ic_adult,
      title: t('detail_order.passenger_suitcase.adult'),
      value: 1,
    },
    child: {
      icon: ic_child,
      title: t('detail_order.passenger_suitcase.child'),
      value: 0,
    },
  };

  const [form, setForm] = useState(DEFAULT_FORM);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (isModalOpen) {
        bottomSheetRef.current?.close();
        setIsModalOpen(false);
        return true; // Mencegah navigasi kembali
      }
      return false; // Biarkan backpress bekerja normal (GoBack)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isModalOpen]); // Update listener saat modal state berubah

  const addValue = (key: string) => {
    console.log('key = ', key);
    setForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: prev[key]?.value + 1,
      },
    }));
  };
  const decreaseValue = (key: string) => {
    setForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: prev[key]?.value - 1,
      },
    }));
  };

  const showNoticeAlert = () => {
    showBSheet({
      snapPoint: ['40%', '55%', '80%'],
      content: (
        <View style={{width: WINDOW_WIDTH - 20, alignItems: 'center'}}>
          <Image source={ic_warningSuitcase} style={iconCustomSize(100)} />
          <Text style={[h1, {fontSize: FONT_SIZE_18, marginVertical: 26}]}>
            {t('detail_order.suitcase_notice_header')}
          </Text>
          <Text style={[h4, {lineHeight: 24, textAlign: 'center'}]}>
            {t('detail_order.suitcase_notice_desc')}
          </Text>

          <Button
            _theme="navy"
            onPress={() => {
              // dispatch(
              //   saveFormAirportTransfer({
              //     ...formAirportTransfer,
              //     suitcase: form?.suitcase?.value,
              //     large_suitcase: form.large_suitcase.value,
              //     adults: form.adults.value,
              //     child: form.child.value,
              //   }),
              // );
              // bottomSheetRef.current?.dismiss();
              showNoticeAlert();
              setForm(DEFAULT_FORM);
            }}
            title={t('global.button.confirm')}
            styleWrapper={{
              marginTop: 27,
            }}
          />
        </View>
      ),
    });
  };

  const validateRules = () => {
    const totalPassengers = form.adults?.value + form.child?.value;
    const totalSuitcases = form.suitcase?.value;
    const {suitcase} = form;

    let isValid = false;
    if (totalPassengers > 6) {
    } else if (totalPassengers === 6) {
      if (totalSuitcases > 2) {
      } else {
        isValid = true;
      }
    } else if (totalPassengers === 5) {
      if (suitcase?.value > 3) {
      } else {
        isValid = true;
      }
    } else if (totalPassengers === 4) {
      if (suitcase?.value > 4) {
      } else {
        isValid = true;
      }
    } else if (totalPassengers >= 1 && totalPassengers <= 3) {
      if (suitcase?.value > 3) {
      } else {
        isValid = true;
      }
    }

    if (!isValid) {
      showNoticeAlert();
    } else {
      dispatch(
        saveFormAirportTransfer({
          ...formAirportTransfer,
          suitcase: form?.suitcase?.value,
          adults: form.adults.value,
          child: form.child.value,
        }),
      );
      bottomSheetRef.current?.dismiss();
    }
  };

  return (
    <View style={{marginTop: 14}}>
      <Text style={[h4, {marginBottom: 12}]}>
        {t('myBooking.pessengers_suitcase')}
      </Text>
      <TouchableOpacity
        style={[rowCenter, styles.wrapperBtn]}
        onPress={() => bottomSheetRef.current?.present()}>
        <Image source={ic_baggage} style={iconCustomSize(18)} />

        <Text style={[h4]}>
          {t('detail_order.passenger_suitcase.passenger_suitcase_desc', {
            adult: formAirportTransfer?.adults,
            child: formAirportTransfer?.child,
            suitcase:
              formAirportTransfer?.suitcase +
                formAirportTransfer?.large_suitcase || '',
          })}
        </Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef as any}
        snapPoints={['60%']}
        onChange={index => setIsModalOpen(index !== -1)}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white,
            padding: 20,
          }}>
          <Text style={[h1, {fontSize: FONT_SIZE_18, marginBottom: 31}]}>
            {t('myBooking.pessengers_suitcase')}
          </Text>

          <BottomSheetFlatList
            data={Object.keys(form)}
            renderItem={({item}) => (
              <View
                style={[
                  rowCenter,
                  {
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 40,
                  },
                ]}>
                <View style={[rowCenter]}>
                  <Image source={form[item]?.icon} style={iconCustomSize(18)} />
                  <Text style={[h4, {marginLeft: 5}]}>{form[item]?.title}</Text>
                </View>

                <View style={[rowCenter]}>
                  <TouchableOpacity
                    onPress={() => decreaseValue(item)}
                    disabled={form[item]?.value <= 0}>
                    <Image
                      source={ic_minus_circle_filled}
                      style={[
                        iconCustomSize(20),
                        {
                          tintColor:
                            form[item]?.value > 0
                              ? theme.colors.navy
                              : theme.colors.grey6,
                        },
                      ]}
                    />
                  </TouchableOpacity>

                  <Text style={[h4, {marginHorizontal: 10}]}>
                    {form[item]?.value}
                  </Text>

                  <TouchableOpacity
                    onPress={() => addValue(item)}
                    // disabled={
                    //   (['adults', 'child'].includes(item) &&
                    //     form.adults?.value + form.child?.value >= 6) ||
                    //   (['suitcase', 'large_suitcase'].includes(item) &&
                    //     form.suitcase?.value + form.large_suitcase?.value >= 2)
                    // }
                  >
                    <Image
                      source={ic_plus_circle_filled}
                      style={[
                        iconCustomSize(20),
                        {
                          // tintColor:
                          //   (['adults', 'child'].includes(item) &&
                          //     form.adults?.value + form.child?.value >= 6) ||
                          //   (['suitcase', 'large_suitcase'].includes(item) &&
                          //     form.suitcase?.value +
                          //       form.large_suitcase?.value >=
                          //       2)
                          //     ? theme.colors.grey6
                          //     : theme.colors.navy,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
        <Button
          _theme="navy"
          title="Confirm"
          onPress={() => {
            validateRules();
          }}
          styleWrapper={{
            marginBottom: 20,
            width: WINDOW_WIDTH - 20,
            alignSelf: 'center',
          }}
        />
      </BottomSheetModal>
    </View>
  );
};

export default SelectPassengers;

const styles = StyleSheet.create({
  wrapperBtn: {
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
});
