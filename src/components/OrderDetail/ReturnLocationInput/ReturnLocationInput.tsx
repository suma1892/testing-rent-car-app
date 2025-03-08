import DeliveryLocationModalContent from '../DeliveryLocationInput/DeliveryLocationModalContent';
import React, {useState} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {
  colorSelecting,
  iconCustomSize,
  iconSize,
  rowCenter,
} from 'utils/mixins';
import {currencyFormat} from 'utils/currencyFormat';
import {h4, h5} from 'utils/styles';
import {ic_pinpoin} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {ShuttleData} from 'types/global.types';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import Checkbox from 'components/Checkbox/Checkbox';

type ReturnLocationInputProps = {
  locationName?: string;
  locationId?: number;
  onSelectLocation: (val: ShuttleData) => void;
  onSameWithDeliveryLocationChange: (val: boolean) => void;
};

const ReturnLocationInput = ({
  locationName,
  onSelectLocation,
  locationId,
  onSameWithDeliveryLocationChange,
}: ReturnLocationInputProps) => {
  const {t} = useTranslation();
  const {shuttle} = useAppSelector(appDataState).shuttle;

  const [sameWithDeliveryLocation, setSameWithDeliveryLocation] =
    useState(false);

  const handlePengembalian = () => {
    showBSheet({
      content: (
        <DeliveryLocationModalContent
          headerTitle={t('detail_order.tripDetail.returnLocation') as any}
          data={shuttle}
          onPress={val => {
            onSelectLocation(val);
            handlePengembalian();
          }}
          showFee={true}
        />
      ),
    });
  };

  const getFee = () => {
    return shuttle?.find(x => x?.id === locationId)?.fee;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={h4}>{t('detail_order.tripDetail.returnLocation')}</Text>

        <Checkbox
          label={t('detail_order.checkbox_text')}
          checked={sameWithDeliveryLocation}
          onChange={val => {
            onSameWithDeliveryLocationChange(val);
            setSameWithDeliveryLocation(val);
          }}
          customContainerStyle={{margin: 0}}
          customCheckboxStyle={iconCustomSize(13)}
          customLabelStyle={{fontFamily: 'Inter-Regular', fontSize: 10}}
        />
      </View>
      <TouchableOpacity
        style={[rowCenter, styles.borderBottom]}
        onPress={handlePengembalian}>
        <Image source={ic_pinpoin} style={iconCustomSize(15)} />
        <View style={rowCenter}>
          <Text style={[h5, colorSelecting(locationName), {marginLeft: 5}]}>
            {locationName ||
              t('detail_order.tripDetail.returnLocationPlaceHolder')}
          </Text>

          {locationName && (
            <View
              style={[
                styles.cost,
                {
                  backgroundColor: getFee() === 0 ? '#DBEEFF' : '#DBFFDE',
                },
              ]}>
              <Text
                style={[
                  h5,
                  {
                    color: getFee() === 0 ? '#0A789B' : '#299B0A',
                  },
                ]}>
                {' '}
                {currencyFormat(getFee())}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReturnLocationInput;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderBottom: {
    paddingVertical: 14.5,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 5,
    borderRadius: 5,
    marginTop: 7,
  },
  cost: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
});
