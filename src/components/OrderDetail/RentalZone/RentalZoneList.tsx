import moment from 'moment';
import React from 'react';
import RentalBadge from './RentalBadge';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {ic_arrow_right, ic_calendar} from 'assets/icons';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {addDays, format} from 'date-fns';
import i18n from 'assets/lang/i18n';
import {enUS, id, zhCN} from 'date-fns/locale';

const RentalZoneList = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const formDaily = useAppSelector(appDataState).formDaily;

  const renderItem = ({item}: {item: number}) => {
    return (
      <TouchableOpacity
        style={[rowCenter, styles.boxWrapper]}
        onPress={() =>
          navigation.navigate('RentalZone', {
            selectedId: item,
          })
        }>
        <View style={[rowCenter]}>
          <Image source={ic_calendar} style={iconSize} />
          <Text style={styles.dayLabel}>
            {t('detail_order.rentalZone.day', {value: item + 1})}{' '}
            <Text style={{marginHorizontal: 20}}> ● </Text>
            <Text style={[h1]}>
              {' '}
              {/* {moment(formDaily?.start_booking_date)
                .add(item, 'day')
                .format('DD MMMM YYYY')} */}
              {format(
                addDays(new Date(formDaily?.start_booking_date), item),
                'dd MMMM yyyy',
                {
                  locale:
                    i18n.language === 'id-ID'
                      ? id
                      : i18n.language?.includes('cn')
                      ? zhCN
                      : enUS,
                },
              )}
            </Text>
          </Text>

          <RentalBadge
            form={formDaily.order_booking_zone?.[item] as any}
            show={!!formDaily.order_booking_zone?.[item]}
          />
        </View>
        <Image
          source={ic_arrow_right}
          style={iconCustomSize(12)}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Array.from({length: formDaily?.duration}, (_, index) => index)}
        renderItem={renderItem}
        keyExtractor={(_, index) => `rental-zone-list-component-${index}`}
      />
    </View>
  );
};

export default RentalZoneList;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  boxWrapper: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    justifyContent: 'space-between',
  },
  dayLabel: {
    ...h4,
    fontSize: 16,
    marginLeft: 15,
  },
});
