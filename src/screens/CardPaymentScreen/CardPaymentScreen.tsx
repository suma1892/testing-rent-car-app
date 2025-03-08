import appBar from 'components/AppBar/AppBar';
import axios from 'axios';
import Button from 'components/Button';
import Config from 'react-native-config';
import hoc from 'components/hoc';
import React, {useEffect, useState} from 'react';
import TextInputCredit from 'components/TextInputCredit/TextInputCredit';
import TextInputCVV from 'components/TextInputCVV/TextInputCVV';
import TextInputName from 'components/TextInputName/TextInputName';
import TextInputTimeExpired from 'components/TextInputTimeExpired/TextInputTimeExpired';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {createDisbursements} from 'redux/features/order/orderAPI';
import {h1, h3, h4, h5} from 'utils/styles';
import {ic_arrow_left_white, ic_arrow_right, ic_shield} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {orderState} from 'redux/features/order/orderSlice';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

import {
  BackHandler,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {timeZone} from 'utils/getTimezone';

interface IForm {
  card_number: string;
  card_cvv: string;
  card_exp: string;
  card_owner_name: string;
}
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'CardPayment'>;
const CardPaymentScreen = () => {
  const {t} = useTranslation();
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const order = useAppSelector(orderState).order;
  const paymentMethods = useAppSelector(appDataState).payments;

  const [form, setForm] = useState<IForm>({
    card_cvv: '',
    card_exp: '',
    card_number: '',
    card_owner_name: '',
  });

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.navigate('MainTab', {screen: 'Booking'})}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('card_payment.tabBarLabel')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(getPayments({
      total_payment: order?.total_payment!,
    }));
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {screen: 'Booking'});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const selectedPayment = paymentMethods?.find(
    x => x?.id === route.params.selectedPayment.id,
  );

  const methods = {
    handleFAQ: () => {
      showBSheet({
        content: (
          <BottomSheetScrollView
            contentContainerStyle={{
              width: '100%',
              flexGrow: 1,
              paddingHorizontal: '5%',
            }}>
            <Text style={[h1, {marginVertical: 16, fontSize: 18}]}>
              {t(`card_payment.payment_Instruction`)}
            </Text>
            {[...Array(t(`card_payment.card_payment_length`)).fill('')].map(
              (x, i) => (
                <View
                  key={i}
                  style={[{marginVertical: 10, flexDirection: 'row'}]}>
                  <Text style={h5}>{i + 1}. </Text>
                  <Text style={h5}>{t(`card_payment.steps.${i}`)}</Text>
                </View>
              ),
            )}
          </BottomSheetScrollView>
        ),
      });
    },
    handleMitransGetToken: async () => {
      const config: any = {
        method: 'get',
        url: `${Config.API_MIDTRANS}/v2/token`,
        params: {
          client_key: Config.MIDTRANS_CLIENT_KEY,
          card_number: form.card_number,
          card_cvv: form.card_cvv,
          card_exp_month: form.card_exp.slice(0, 2),
          card_exp_year: '20' + form.card_exp.slice(-2),
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      try {
        const data = await axios(config);

        if (data.data.status_code !== '200') {
          showToast({
            message:
              data.data.validation_messages?.toString() ||
              data.data.status_message,
            title: t('global.alert.error'),
            type: 'error',
          });
          return;
        }

        const timezone = timeZone;
        const payload = {
          payment_type_id: route.params.selectedPayment.id,
          transaction_key:
            order.transaction_key || (route.params?.transaction_key as any),
          card_token_id: data?.data?.token_id,
          card_owner_name: form.card_owner_name,
          vat: selectedPayment?.vat,
          time_zone: timezone,
        };
        const res = await dispatch(createDisbursements(payload));

        if (res.type.includes('fulfilled')) {
          try {
            Linking.openURL(res?.payload.data?.disbursement?.redirect_url);
            setTimeout(() => {
              navigation.navigate('MainTab', {screen: 'Booking'});
            }, 1000);
          } catch (error) {
            showToast({
              message: t('global.alert.payment_can_not_be_made'),
              title: t('global.alert.error'),
              type: 'error',
            });
          }
        }
        // return data.data;
      } catch (error) {
        console.log(error);
      }
    },
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        margin: 16,
      }}
      keyboardDismissMode="interactive">
      <Text style={[h1]}>{t('card_payment.insert_card_info')}</Text>

      <TextInputName
        onChangeText={(c: string) => setForm({...form, card_owner_name: c})}
      />
      <TextInputCredit
        onChangeText={(c: string) => setForm({...form, card_number: c})}
      />
      <View
        style={[
          rowCenter,
          {width: '100%', justifyContent: 'space-between', marginTop: 10},
        ]}>
        <TextInputTimeExpired
          onChangeText={(c: string) => setForm({...form, card_exp: c})}
        />
        <View style={{marginHorizontal: 5}} />
        <TextInputCVV
          onChangeText={(c: string) => setForm({...form, card_cvv: c})}
        />
      </View>

      <View style={[rowCenter, styles.guardWrapper]}>
        <Image
          source={ic_shield}
          style={iconCustomSize(25)}
          resizeMode={'contain'}
        />
        <Text style={h3}> {t('card_payment.your_data_will_be_protected')}</Text>
      </View>
      <Button
        _theme="navy"
        onPress={() => {
          methods.handleMitransGetToken();
        }}
        title={'Lanjutkan Pembayaran'}
        styleWrapper={{
          marginTop: 26,
        }}
      />
      <View style={styles.lineHorizontal} />

      <Text style={[h1, {marginTop: 20}]}>
        {t('virtual_account.payment_Instruction')}
      </Text>

      <TouchableOpacity
        style={[
          styles.HowToWrapper,
          rowCenter,
          {justifyContent: 'space-between'},
        ]}
        onPress={methods.handleFAQ}>
        <Text style={h4}>{t('virtual_account.payment_Instruction')}</Text>
        <Image
          source={ic_arrow_right}
          style={iconCustomSize(10)}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default hoc(
  CardPaymentScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  guardWrapper: {
    backgroundColor: theme.colors.cloud,
    padding: 17,
    marginTop: 23,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 20,
  },
  HowToWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
