import AirportDeliveryLocationModalContent from './AirportDeliveryLocationModalContent';
import React from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {colorSelecting, iconSize, rowCenter} from 'utils/mixins';
import {h4, h5} from 'utils/styles';
import {ic_pinpoin} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {ShuttleData} from 'types/global.types';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type DeliveryLocationInputProps = {
  locationName?: string;
  onSelectLocation?: (val: ShuttleData) => void;
  leftIcon?: any;
  disabled?: boolean;
};

const AirportDeliveryLocationInput = ({
  locationName,
  onSelectLocation,
  leftIcon,
  disabled = false,
}: DeliveryLocationInputProps) => {
  const {t} = useTranslation();
  const {shuttle} = useAppSelector(appDataState).shuttle;

  const handlePengantaran = () => {
    showBSheet({
      content: (
        <AirportDeliveryLocationModalContent
          data={shuttle}
          onPress={val => {
            onSelectLocation?.(val);
            handlePengantaran();
          }}
          showFee={true}
        />
      ),
    });
  };

  return (
    <View>
      <Text style={styles.container}>
        {t('detail_order.tripDetail.deliveryLocation')}
      </Text>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          handlePengantaran();
        }}>
        <View
          style={[
            rowCenter,
            styles.borderBottom,
            disabled && {backgroundColor: theme.colors.grey7},
          ]}>
          <Image source={leftIcon ? leftIcon : ic_pinpoin} style={iconSize} />

          <View style={rowCenter}>
            <Text style={[h5, colorSelecting(locationName), {marginLeft: 5}]}>
              {locationName ||
                t('detail_order.tripDetail.deliveryLocationPlaceholder')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AirportDeliveryLocationInput;

const styles = StyleSheet.create({
  container: {
    ...h4,
    marginTop: 10,
  },
  borderBottom: {
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.grey5,
    paddingVertical: 10,
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
