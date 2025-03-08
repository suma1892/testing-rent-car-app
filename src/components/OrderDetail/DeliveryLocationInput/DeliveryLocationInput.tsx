import DeliveryFeeModalContent from './DeliveryFeeModalContent';
import DeliveryLocationModalContent from './DeliveryLocationModalContent';
import React, {useState} from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {currencyFormat} from 'utils/currencyFormat';
import {h4, h5} from 'utils/styles';
import {ic_exclamation, ic_pinpoin} from 'assets/icons';
import {showBSheet} from 'utils/BSheet';
import {ShuttleData} from 'types/global.types';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  colorSelecting,
  iconCustomSize,
  iconSize,
  rowCenter,
} from 'utils/mixins';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

type DeliveryLocationInputProps = {
  locationName?: string;
  locationId?: number;
  onSelectLocation: (val: ShuttleData) => void;
  leftIcon?: any;
  tooltip?: string;
};

const DeliveryLocationInput = ({
  locationName,
  onSelectLocation,
  locationId,
  leftIcon,
  tooltip = '',
}: DeliveryLocationInputProps) => {
  const {t} = useTranslation();
  const {shuttle} = useAppSelector(appDataState).shuttle;

  const handlePengantaran = () => {
    showBSheet({
      content: (
        <DeliveryLocationModalContent
          data={shuttle}
          onPress={val => {
            onSelectLocation(val);
            handlePengantaran();
          }}
          showFee={true}
        />
      ),
    });
  };

  const handleDeliveryFeeModal = () => {
    showBSheet({
      content: <DeliveryFeeModalContent />,
      snapPoint: ['40%', '40%'],
    });
  };

  const getFee = () => {
    return shuttle?.find(x => x?.id === locationId)?.fee;
  };
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View>
      <View style={[rowCenter, {marginTop: 15}]}>
        <Text style={[styles.title, {marginRight: 5}]}>
          {t('detail_order.tripDetail.deliveryLocation')}
        </Text>

        {Boolean(tooltip) && (
          <Tooltip
            isVisible={showTooltip}
            content={<Text>{tooltip}</Text>}
            placement="top"
            onClose={() => setShowTooltip(false)}>
            <TouchableHighlight
              style={{}}
              onPress={() => setShowTooltip(prev => !prev)}>
              <Image source={ic_exclamation} style={[iconCustomSize(12)]} />
            </TouchableHighlight>
          </Tooltip>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          handlePengantaran();
        }}>
        <View style={[rowCenter, styles.borderBottom]}>
          <Image
            source={leftIcon ? leftIcon : ic_pinpoin}
            style={iconCustomSize(15)}
          />

          <View style={rowCenter}>
            <Text style={[h5, colorSelecting(locationName), {marginLeft: 5}]}>
              {locationName ||
                t('detail_order.tripDetail.deliveryLocationPlaceholder')}
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
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryLocationInput;

const styles = StyleSheet.create({
  title: {
    ...h4,
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
