import appBar from 'components/AppBar/AppBar';
import BookingTopNavigation from 'components/MyBookingComponent/BookingTopNavigation';
import hoc from 'components/hoc';
import React, {useCallback, useEffect} from 'react';
import {getAllGarages} from 'redux/features/garages/garagesAPI';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {getUser} from 'redux/features/appData/appDataAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {resetDisbursementStatus} from 'redux/features/order/orderSlice';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const MyBooking: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

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
              {t('myBooking.tabBarLabel')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, i18n.language]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDisbursementStatus());
      dispatch(getAllGarages());
      dispatch(getMyAccountBank());
      dispatch(getUser());
    }, []),
  );

  return (
    <View style={styles.container}>
      <BookingTopNavigation />
    </View>
  );
};

export default hoc(MyBooking, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
});
