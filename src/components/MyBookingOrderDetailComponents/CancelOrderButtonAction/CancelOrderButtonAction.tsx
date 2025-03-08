import Button from 'components/Button';
import CancelOrderModalContent from './CancelOrderModalContent';
import ModalSuccessCancelOrder from 'components/ModalSuccessCancelOrder/ModalSuccessCancelOrder';
import React, {useState} from 'react';
import {cancelOrder} from 'redux/features/order/orderAPI';
import {getOrders} from 'redux/features/myBooking/myBookingAPI';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_cancel_order} from 'assets/images';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';
import CustomTextInput from 'components/TextInput';

type CancelOrderButtonActionProps = {
  transactionKey: string;
};

const CancelOrderButtonAction: React.FC<CancelOrderButtonActionProps> = ({
  transactionKey,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const handleCancelOrder = () => {
    showBSheet({
      snapPoint: ['70%', '70%'],
      content: (
        <CancelOrderModalContent
          onSubmit={async val => {
            const res = await dispatch(
              cancelOrder({
                ...val,
                transaction_key: transactionKey,
              }),
            );

            console.log('res ', res);
            if (res?.type.includes('fulfilled')) {
              dispatch(toggleBSheet(false));
              setShowModalSuccess(true);
              return;
            }
            showToast({
              message:
                res?.payload?.data?.message ||
                t('global.alert.cancellation_failed'),
              title: t('global.alert.error_occurred'),
              type: 'warning',
            });
          }}
        />
      ),
    });
  };

  const showPopupCancelOrder = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
      content: (
        <View
          style={{
            alignItems: 'center',
            margin: 20,
            width: '90%',
          }}>
          <Image
            source={img_cancel_order}
            style={{width: 170, height: 170, marginBottom: 50}}
            resizeMode="cover"
          />

          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'center',
            }}>
            {t('myBooking.cancel_order_desc')}
          </Text>

          <Button
            _theme="navy"
            onPress={() => {
              dispatch(toggleBSheet(false));
              setTimeout(() => {
                handleCancelOrder();
              }, 500);
            }}
            title={t('global.button.yesNext')}
            styleWrapper={{width: '90%', marginTop: 20}}
          />
          <Button
            _theme="white"
            onPress={() => {
              dispatch(toggleBSheet(false));
            }}
            title={t('global.button.cancel')}
            styleWrapper={{
              width: '90%',
              marginTop: 20,
              borderWidth: 1,
              borderColor: '#666',
            }}
          />
        </View>
      ),
    });
  };

  return (
    <View>
      <Button
        _theme="red"
        title={t('global.button.cancelOrder')}
        // onPress={handleCancelOrder}
        onPress={showPopupCancelOrder}
        styleWrapper={{
          marginBottom: 10,
        }}
        lineColor="#FF5757"
      />

      <ModalSuccessCancelOrder
        visible={showModalSuccess}
        setVisible={setShowModalSuccess}
        onFinish={() => {
          dispatch(toggleBSheet(false));
          navigation.goBack();
          dispatch(getOrders(1));
        }}
      />
    </View>
  );
};

export default CancelOrderButtonAction;

const styles = StyleSheet.create({
  bsheetWrapper: {
    width: WINDOW_WIDTH,
    flex: 1,
    alignItems: 'center',
    margin: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  formWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
