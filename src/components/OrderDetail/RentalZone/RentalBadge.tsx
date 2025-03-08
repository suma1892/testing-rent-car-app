import React, {memo, useMemo} from 'react';
import {OrderBookingZone} from 'types/global.types';
import {StyleSheet, Text, View} from 'react-native';
import {t} from 'i18next';

type Props = {
  form: OrderBookingZone;
  show: boolean;
};

const RentalBadge = ({form, show}: Props) => {
  const highestZone: any = useMemo(() => {
    if (
      form?.zone_name?.pick_up_zone &&
      form?.zone_name?.drop_off_zone &&
      form?.zone_name?.driving_zone
    ) {
      const data = [
        form?.zone_name?.pick_up_zone,
        form?.zone_name?.drop_off_zone,
        form?.zone_name?.driving_zone,
      ].sort((a, b) => b.localeCompare(a))?.[0];

      // return data?.split(' ')?.[1];
      return data?.split(' ')?.slice(1)?.join(' ');
    }
    return '';
  }, [
    form?.zone_name?.pick_up_zone,
    form?.zone_name?.drop_off_zone,
    form?.zone_name?.driving_zone,
  ]);

  if (!show) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{color: '#E5602F'}}>
        {t('detail_order.rentalZone.zone', {value: highestZone})}
      </Text>
    </View>
  );
};

export default memo(RentalBadge);

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#FFEFD9',
  },
});
