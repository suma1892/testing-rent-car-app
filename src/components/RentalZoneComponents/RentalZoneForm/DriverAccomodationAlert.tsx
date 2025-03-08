import Checkbox from 'components/Checkbox/Checkbox';
import React, { memo } from 'react';
import {h1, h4} from 'utils/styles';
import {ic_info3} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type DriverAccomodationAlertProps = {
  show: boolean;
  value: boolean;
  onChange: (val: boolean) => void;
};

const DriverAccomodationAlert = ({
  show,
  value,
  onChange,
}: DriverAccomodationAlertProps) => {
  const {t} = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <View style={styles.driverAccomodationContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={ic_info3} style={iconCustomSize(15)} />
        <Text style={styles.driverAccomodationTitle}>
          {t('detail_order.rentalZone.driver_accomodation')}
        </Text>
      </View>
      <Text style={styles.driverAccomodationDescription}>
        {t('detail_order.rentalZone.driverAccomodationDesc')}
      </Text>
      <Checkbox
        label={t('detail_order.rentalZone.agreeState')}
        onChange={onChange}
        checked={value}
        customLabelStyle={{marginLeft: 5, fontSize: 12}}
        customContainerStyle={{margin: 0, marginTop: 10}}
        customCheckboxStyle={iconCustomSize(15)}
      />
    </View>
  );
};

export default memo(DriverAccomodationAlert);

const styles = StyleSheet.create({
  driverAccomodationContainer: {
    backgroundColor: '#E7F3FF',
    padding: 12,
    marginTop: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
  driverAccomodationTitle: {
    ...h1,
    color: theme.colors.navy,
    marginLeft: 5,
  },
  driverAccomodationDescription: {
    ...h4,
    color: theme.colors.grey0,
    marginTop: 5,
    fontSize: 12,
  },
});
