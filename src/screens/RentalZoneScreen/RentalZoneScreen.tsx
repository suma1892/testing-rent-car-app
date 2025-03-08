import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import hoc from 'components/hoc';
import React, {FC, useEffect, useState} from 'react';
import RentalZoneDetails from 'components/RentalZoneComponents/RentalZoneForm/RentalZoneDetails/RentalZoneDetails';
import RentalZoneForm from 'components/RentalZoneComponents/RentalZoneForm/RentalZoneForm';
import RentalZoneImage from 'components/RentalZoneComponents/RentalZoneForm/RentalZoneImage';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';
import {getListZone, getRentalZone} from 'redux/features/order/orderAPI';
import {h1, h4} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {OrderBookingZone} from 'types/global.types';
import {orderState} from 'redux/features/order/orderSlice';
import {rowCenter, WINDOW_HEIGHT} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalBack from './ModalBack';

const RentalZoneScreen: FC = () => {
  const route = useRoute<any>();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const formDaily = useAppSelector(appDataState).formDaily;
  const {isLoading} = useAppSelector(orderState);
  const {vehicleById} = useAppSelector(vehiclesState);

  const [form, setForm] = useState<OrderBookingZone[]>([]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('detail_order.rentalZone.title')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  useEffect(() => {
    const backAction = () => {
      setVisible(true);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (formDaily?.location_id) {
      dispatch(
        getListZone({
          locationId: formDaily.location_id,
          categoryId: vehicleById.category.id,
        }),
      );
      dispatch(getRentalZone('?location_id=' + formDaily?.location_id));
    }
  }, [formDaily?.location_id, navigation]);

  useEffect(() => {
    if (formDaily.order_booking_zone?.length) {
      setForm(formDaily.order_booking_zone);
    }
  }, [formDaily.order_booking_zone?.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardDismissMode="interactive">
        <View style={styles.rentalAreaAlert}>
          <Text style={styles.rentalAreaTitle}>
            {t('detail_order.rentalZone.rentalArea')}
          </Text>
          <Text style={styles.rentalAreaDescription}>
            {t('detail_order.rentalZone.rentalAreaDesc')}
          </Text>
        </View>
        {!isLoading && (
          <>
            <RentalZoneImage />
            <RentalZoneDetails />
          </>
        )}

        {[...Array(Number(formDaily?.duration))]?.map((x, i) => (
          <RentalZoneForm
            key={i}
            i={i}
            selectedId={route?.params?.selectedId}
            lastDayIndex={formDaily?.duration - 1}
            showBadge={!!formDaily.order_booking_zone?.[i] || !!form?.[i]}
            onSave={val => {
              const copyOrderBookingZone = [...(form || [])];
              const selectedDay = form?.[i];

              if (!!selectedDay) {
                copyOrderBookingZone[i] = {...val};
              } else {
                copyOrderBookingZone.push(val);
              }

              setForm(copyOrderBookingZone);
            }}
          />
        ))}
      </ScrollView>

      <ModalBack
        visible={visible}
        setVisible={setVisible}
        onConfirm={() => {
          setVisible(false);
          navigation.goBack();
        }}
      />
      <View style={{paddingHorizontal: '5%', marginBottom: 10}}>
        <Button
          _theme="navy"
          disabled={Number(formDaily?.duration) !== form?.length}
          title={t('global.button.next')}
          onPress={() => {
            dispatch(
              saveFormDaily({
                ...formDaily,
                start_booking_time:
                  form?.[0]?.booking_start_time?.slice(0, 2) +
                  ':' +
                  form?.[0]?.booking_start_time?.slice(2),
                order_booking_zone: form,
              }),
            );
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export default hoc(RentalZoneScreen, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between'},
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingBottom: WINDOW_HEIGHT / 4,
  },
  rentalAreaAlert: {
    backgroundColor: '#E7F3FF',
    padding: 12,
    marginTop: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
  rentalAreaTitle: {
    ...h1,
    color: theme.colors.navy,
  },
  rentalAreaDescription: {
    ...h4,
    color: theme.colors.grey0,
    marginTop: 5,
    fontSize: 12,
  },
});
