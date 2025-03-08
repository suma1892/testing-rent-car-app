import {h1} from 'utils/styles';
import {ic_pinpoin} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {IListZone} from 'types/order';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {memo} from 'react';
import {OnChangeZone} from 'components/RentalZoneComponents/rentalZoneComponent.interface';
import {theme} from 'utils';

const AreaZoneRenderItem = ({
  item,
  onPress,
}: {
  item: IListZone;
  onPress: ({id, name, name_zone, zone_id}: OnChangeZone) => void;
}) => {
  const zoneName = item?.name_zone ? `(${item?.name_zone})` : '';
  return (
    <TouchableOpacity
      onPress={() => {
        onPress({
          id: item.id,
          name: item?.name,
          name_zone: item?.name_zone,
          zone_id: item?.zone_id,
        });
      }}>
      <View style={styles.button}>
        <Image
          source={ic_pinpoin}
          style={[
            styles.pinPoinIcon,
            item?.name_zone === 'Zona 1'
              ? styles.zone1Icon
              : item?.name_zone === 'Zona 2'
              ? styles.zone2Icon
              : {},
          ]}
        />

        <View style={{width: '90%'}}>
          <Text style={h1}>
            {item?.name} {zoneName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AreaZoneRenderItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
  },
  button: {
    ...rowCenter,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    paddingVertical: 20,
  },
  pinPoinIcon: {
    ...iconCustomSize(21),
    marginRight: 12,
  },
  zone1Icon: {
    tintColor: 'rgba(241, 163, 58, 1)',
  },
  zone2Icon: {
    tintColor: 'rgba(229, 96, 47, 1)',
  },
});
