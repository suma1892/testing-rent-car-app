import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ic_close_rounded, ic_point} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {showToast} from 'utils/Toast';
import {orderState} from 'redux/features/order/orderSlice';
import {getRefferalPoint} from 'redux/features/appData/appDataAPI';

const PointUsage = ({
  setPoint,
}: {
  setPoint: (type: string | number) => void;
}) => {
  const refferalPoint = useAppSelector(appDataState).refferal_point;
  const {t} = useTranslation();
  const orderSummary = useAppSelector(orderState).summaryOrder;
  const dispatch = useAppDispatch();
  const [inputPoint, setInputPoint] = useState('');

  useEffect(() => {
    dispatch(getRefferalPoint());
  }, []);

  function isNumberOnly(string: string) {
    return /^\d+$/.test(string);
  }

  const handleSubmit = () => {
    if (inputPoint > refferalPoint?.point) {
      showToast({
        message: t('detail_order.error_point_usage'),
        title: t('global.alert.error'),
        type: 'warning',
      });
      return;
    }
    if (isNumberOnly(inputPoint)) {
      setPoint(JSON.parse(inputPoint));
      return;
    }
    showToast({
      message: t('detail_order.error_point_usage'),
      title: t('global.alert.error'),
      type: 'warning',
    });
  };
  return (
    <View style={[styles.wrapper]}>
      <View>
        <View style={[rowCenter]}>
          <Image source={ic_point} style={iconCustomSize(16)} />
          <Text style={styles.textPoint}>
            {(refferalPoint?.point! || 0) - (orderSummary?.point || 0) || 0}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 10,
          }}>
          ({t('myBooking.point_desc')})
        </Text>
      </View>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor:
              orderSummary?.point <= 0 ? '#fff' : theme.colors.grey6,
          },
        ]}>
        <TextInput
          placeholder={t('myBooking.input_point_placeholder') as string}
          onChangeText={x => setInputPoint(x)}
          value={inputPoint}
          placeholderTextColor={theme.colors.grey5}
          editable={
            orderSummary?.point > 0
              ? false
              : parseInt(refferalPoint?.point) <= 0
              ? false
              : true
          }
          keyboardType="decimal-pad"
          style={{
            width: '60%',
            color: theme.colors.black,
            fontSize: 12,
            padding: 10,
          }}
        />
        {orderSummary?.point > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setPoint(0);
              setInputPoint('');
            }}>
            <Image source={ic_close_rounded} style={iconSize} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnUse,
              {
                backgroundColor:
                  parseInt(refferalPoint?.point) <= 0
                    ? theme.colors.grey6
                    : theme.colors.orange,
              },
            ]}
            onPress={handleSubmit}
            disabled={parseInt(refferalPoint?.point) <= 0}>
            <Text style={styles.textUse}>{t('myBooking.useButton')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PointUsage;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
    paddingVertical: 10,
  },
  textPoint: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
  },
  btnUse: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.orange,
    alignItems: 'center',
    borderRadius: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderRadius: 7,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  textUse: {
    fontSize: 12,
    color: theme.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});
