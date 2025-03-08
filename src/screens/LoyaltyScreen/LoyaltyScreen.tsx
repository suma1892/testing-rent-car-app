import appBar from 'components/AppBar/AppBar';
import hoc from 'components/hoc';
import LeftAlign from 'components/Loyalty/Carousel/left-align';
import React, {useEffect, useState} from 'react';
import {getFinishedOrder} from 'redux/effects';
import {h1} from 'utils/styles';
import {iconSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_arrow_left_white,
  ic_car_blue,
  ic_crown_blue,
  ic_point_blue,
  ic_star_blue,
} from 'assets/icons';

const HOW_TO = [
  {icon: ic_star_blue, descKey: 'loyalty.list_how_to.first'},
  {icon: ic_point_blue, descKey: 'loyalty.list_how_to.second'},
  {icon: ic_crown_blue, descKey: 'loyalty.list_how_to.third'},
  {icon: ic_car_blue, descKey: 'loyalty.list_how_to.fourth'},
];

interface Order {
  airport_transfer_package_id: number;
  order_detail: {
    start_booking_date: string;
    without_driver: boolean;
  };
  order_key: string;
  total_payment: number;
}

const LoyaltyScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image source={ic_arrow_left_white} style={styles.backIcon} />
            <Text style={[h1, styles.backText]}>{t('settings.loyalty')}</Text>
          </TouchableOpacity>
        ),
      }),
    );
    getOrder();
  }, [navigation]);

  const getOrder = async () => {
    setLoading(true);
    const res = await getFinishedOrder();
    setLoading(false);
    setOrders(res?.data || []);
  };

  const renderHowTo = () =>
    HOW_TO.map((item, index) => (
      <View key={index} style={styles.howToItem}>
        <Image source={item.icon} style={iconSize} />
        <Text style={styles.desc}>{t(item.descKey)}</Text>
      </View>
    ));

  // const renderOrderItem = ({item}: {item: Order}) => (
  //   <View style={styles.orderItem}>
  //     <View style={rowCenter}>
  //       <Image
  //         source={
  //           item.airport_transfer_package_id !== 0
  //             ? ic_daily_driver_airport
  //             : ic_daily_car_active
  //         }
  //         style={iconSize}
  //       />
  //       <View>
  //         <Text style={styles.desc}>
  //           {moment(item.order_detail.start_booking_date).format(
  //             'DD MMMM YYYY',
  //           )}
  //         </Text>
  //         <Text style={[styles.desc, styles.boldText]}>
  //           {item.airport_transfer_package_id !== 0
  //             ? t('loyalty.airport_transfer')
  //             : item.order_detail.without_driver
  //             ? t('loyalty.without_driver')
  //             : t('loyalty.with_driver')}
  //         </Text>
  //       </View>
  //     </View>
  //     <View>
  //       <Text style={styles.desc}>{item.order_key}</Text>
  //       <Text style={[styles.desc, styles.boldText]}>
  //         {idrFormatter(item.total_payment)}
  //       </Text>
  //     </View>
  //   </View>
  // );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={[1]}
      renderItem={() => (
        <View>
          <LeftAlign />
          <Text style={styles.title}>{t('loyalty.how_to')}</Text>
          <View style={styles.howToWrapper}>{renderHowTo()}</View>
          {/* <Text style={[styles.title, styles.marginTop20]}>
            {t('loyalty.transaction_list_title')}
          </Text> */}
          {/* {loading ? (
            <ActivityIndicator size="large" color={theme.colors.navy} />
          ) : (
            <FlatList
              data={orders}
              style={styles.listTrxWrapper}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderOrderItem}
            />
          )} */}
        </View>
      )}
      keyExtractor={(_, index) => `loyalty_${index}`}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    padding: '5%',
  },
  backIcon: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  backText: {
    color: 'white',
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    marginTop: 20,
    color: theme.colors.black,
    fontWeight: '700',
    marginBottom: 10,
  },
  desc: {
    fontSize: 12,
    color: theme.colors.black,
    fontWeight: '400',
    lineHeight: 20,
    marginLeft: 10,
  },
  boldText: {
    fontWeight: '600',
  },
  howToWrapper: {
    padding: 20,
    margin: 2,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  howToItem: {
    flexDirection: 'row',
    width: '90%',
    marginBottom: 10,
  },
  listTrxWrapper: {
    elevation: 4,
    backgroundColor: '#fff',
    padding: 20,
    margin: 2,
    borderRadius: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
});

export default hoc(LoyaltyScreen, theme.colors.navy, false, 'light-content');
