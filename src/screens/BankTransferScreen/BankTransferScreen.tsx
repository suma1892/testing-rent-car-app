import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useEffect} from 'react';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Clipboard} from '@react-native-clipboard/clipboard/dist/Clipboard';
import {currencyFormat} from 'utils/currencyFormat';
import {getOrderById} from 'redux/features/myBooking/myBookingAPI';
import {h1, h2, h4, h5} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ic_arrow_left_white,
  ic_arrow_right,
  ic_bca,
  ic_copy,
  ic_uob,
} from 'assets/icons';
import {getPayments} from 'redux/features/appData/appDataAPI';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';

type BankTransferScreenRouteProp = RouteProp<
  RootStackParamList,
  'BankTransfer'
>;

const BankTransferScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<BankTransferScreenRouteProp>();
  const selectedPayment = route?.params?.selectedPayment;

  const dispatch = useAppDispatch();
  const accountBank = useAppSelector(accountBankState).data;
  const {isSelectedLoading, selected} = useAppSelector(bookingState);
  const summaryOrder = useAppSelector(orderState).summaryOrder;

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() =>
              navigation.navigate('MainTab', {screen: 'Booking'} as any)
            }>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('bank_transfer.bank_transfer')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
    dispatch(
      getPayments({
        total_payment: calcTotalPayment()!,
      }),
    );
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTab', {screen: 'Booking'} as any);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (route.params.transaction_key) {
      dispatch(getOrderById(route.params.transaction_key));
    }
    dispatch(getMyAccountBank());
  }, [route.params.transaction_key]);

  const methods = {
    handleFAQ: (index: number) => {
      showBSheet({
        content: (
          <BottomSheetScrollView
            contentContainerStyle={{
              width: '100%',
              flexGrow: 1,
              paddingHorizontal: '5%',
            }}>
            <Text style={[h1, {marginVertical: 16, fontSize: 18}]}>
              {t('instant_payment.payment_instruction')}
            </Text>
            {[
              ...Array(
                t(
                  `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${index}.step_length`,
                ),
              ).fill(''),
            ].map((x, i) => (
              <View
                key={i}
                style={[{marginVertical: 10, flexDirection: 'row'}]}>
                <Text style={h5}>{i + 1}. </Text>
                <Text style={h5}>
                  {t(
                    `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${index}.steps.${i}`,
                    {
                      no_rek:
                        selected?.currency === 'SGD'
                          ? selectedPayment.code?.toLowerCase()?.includes('bca')
                            ? '7010923888'
                            : '3273089878'
                          : '8650710089',
                      bank_name:
                        selected?.currency === 'SGD'
                          ? selectedPayment.code?.toLowerCase()?.includes('bca')
                            ? 'BCA PT CUAN MUDA TRANSPORTASI'
                            : 'UOB KREATIF TRANSPORTASI PT'
                          : 'PT. KREATIF TRANSPORTASI GEMILANG',
                    },
                  )}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        ),
      });
    },
    copyText: (text: string) => {
      Clipboard.setString(text);
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_copy_text'),
      });
    },
    handleIcon: (ic: string) => {
      switch (ic) {
        case 'BCA':
          return ic_bca;
        case 'UOB':
          return ic_uob;
        default:
          break;
      }
    },
  };

  const calcTotalPayment = () => {
    let sum = 0;
    if (selected?.type === 'HALF') {
      sum = summaryOrder?.total_dp;
    } else if (selected?.type === 'FULL') {
      sum = selected?.total_payment;
    }

    return sum;
  };

  if (isSelectedLoading) return <Loading />;
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <AccountBank /> */}

        <Text style={[h1, {marginTop: 20}]}>
          {t('bank_transfer.make_payment')}
        </Text>

        <View style={[rowCenter, {marginTop: 10}]}>
          <Image
            source={methods.handleIcon(selectedPayment.code)}
            style={iconCustomSize(30)}
            resizeMode={'contain'}
          />
          <Text style={[h5, {fontSize: 12, marginLeft: 10}]}>
            {t('bank_transfer.bank_x_transfer', {x: selectedPayment.code})}
          </Text>
        </View>

        <View
          style={[
            rowCenter,
            {
              justifyContent: 'space-between',
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h1]}>
            {selectedPayment.code?.toLowerCase()?.includes('bca')
              ? '7010923888'
              : '3273089878'}
          </Text>
          <TouchableOpacity
            onPress={() =>
              methods.copyText(
                selectedPayment.code?.toLowerCase()?.includes('bca')
                  ? '7010923888'
                  : '3273089878',
              )
            }>
            <Image source={ic_copy} style={iconSize} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>

        <Text style={[h5, {fontSize: 12, marginTop: 10, marginBottom: 5}]}>
          {t('bank_transfer.account_name')}
        </Text>

        <View
          style={[
            rowCenter,
            {
              justifyContent: 'space-between',
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h1]}>
            {selectedPayment.code?.toLowerCase()?.includes('bca')
              ? 'BCA PT CUAN MUDA TRANSPORTASI'
              : 'UOB KREATIF TRANSPORTASI PT'}
          </Text>
        </View>

        <View style={styles.wrapperFee}>
          <View style={[rowCenter, {justifyContent: 'space-between'}]}>
            <Text style={[h4]}>{t('bank_transfer.total_price')}</Text>
            <Text style={[h2]}>
              {currencyFormat(calcTotalPayment(), selected?.currency)}
            </Text>
          </View>

          <View
            style={[
              rowCenter,
              {justifyContent: 'space-between', marginTop: 10},
            ]}>
            <Text style={[h4]}>{t('bank_transfer.service_fee')}</Text>
            <Text style={[h2]}>
              {currencyFormat(selectedPayment?.vat, selected?.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.lineHorizontal} />
        <Text style={[h1, {marginTop: 20, marginBottom: 10}]}>
          {t('bank_transfer.total_payment')}
        </Text>

        <View
          style={[
            {
              backgroundColor: theme.colors.cloud,
              padding: 10,
            },
          ]}>
          <Text style={[h2]}>
            {currencyFormat(
              calcTotalPayment() + selectedPayment?.vat,
              selected?.currency,
            )}
          </Text>
        </View>

        <View style={styles.lineHorizontal} />

        <Text style={[h1, {marginTop: 20}]}>
          {t('virtual_account.payment_Instruction')}
        </Text>

        {[
          ...Array(
            t(
              `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}_length`,
            ),
          ).fill(''),
        ].map((x, i) => (
          <TouchableOpacity
            style={[
              styles.HowToWrapper,
              rowCenter,
              {justifyContent: 'space-between'},
            ]}
            key={i.toString()}
            onPress={() => methods.handleFAQ(i)}>
            <Text style={h4}>
              {t(
                `manual_transfer.${route.params?.selectedPayment.code.toLowerCase()}.${i}.title`,
              )}
            </Text>
            <Image
              source={ic_arrow_right}
              style={iconCustomSize(10)}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ))}

        <Button
          _theme="navy"
          onPress={() => {
            navigation.navigate('UploadBankTransfer', route.params);
          }}
          title={t('bank_transfer.upload_proof_payment')}
          styleWrapper={{
            marginTop: 26,
          }}
          disabled={!accountBank}
        />
      </ScrollView>
    </View>
  );
};

export default hoc(
  BankTransferScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
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
  wrapperFee: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey6,
    marginTop: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    paddingBottom: 20,
  },
});
