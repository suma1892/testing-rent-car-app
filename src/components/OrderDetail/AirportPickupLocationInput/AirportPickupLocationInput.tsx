import AirportPickupLocationModalContent from './AirportPickupLocationModalContent';
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
  disabled?: boolean;
  onSelectLocation?: (val: ShuttleData) => void;
  leftIcon?: any;
};

const AirportPickupLocationInput = ({
  locationName,
  onSelectLocation,
  disabled = false,
  leftIcon,
}: DeliveryLocationInputProps) => {
  const {t} = useTranslation();
  const {shuttle} = useAppSelector(appDataState).shuttle;
  const showFee = false;
  const handlePengantaran = () => {
    showBSheet({
      content: (
        <AirportPickupLocationModalContent
          data={
            locationName === 'Ngurah Rai'
              ? [{name: 'Ngurah Rai', id: 1}]
              : shuttle
          }
          onPress={val => {
            onSelectLocation?.(val);
            handlePengantaran();
          }}
          showFee={showFee}
        />
      ),
    });
  };

  return (
    <View>
      <Text style={styles.container}>
        {t('detail_order.tripDetail.pickupLocation')}
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
                t('detail_order.tripDetail.pickupLocationPlaceholder')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AirportPickupLocationInput;

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
