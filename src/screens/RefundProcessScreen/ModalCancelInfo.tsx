import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ic_account_bank, ic_close2} from 'assets/icons';
import {theme} from 'utils';
import {
  iconCustomSize,
  rowCenter,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'utils/mixins';
import CustomTextInput from 'components/TextInput';
import SelectBank from 'components/SelectBankInput/SelectBank';
import {t} from 'i18next';
import {UserInformationForm} from 'screens/UserInformationScreen/userInformation.interface';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {getMyAccountBank} from 'redux/features/accountBank/accountBankAPI';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {RefundStatus} from 'types/refund.types';
import Button from 'components/Button';
import {h1, h4} from 'utils/styles';
import {updateRefundOrder} from 'redux/effects';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';
import {accountBankState} from 'redux/features/accountBank/accountBankSlice';
import {appDataState} from 'redux/features/appData/appDataSlice';

const ModalCancelInfo = ({
  reason,
  desc,
  order_key,
}: {
  reason: string;
  desc: string;
  order_key: string;
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const {t} = useTranslation();
  const {userProfile} = useAppSelector(appDataState);

  const snapPoints = useMemo(() => ['60%', '80%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      sheetRef.current?.close();
    }
  }, []);

  return (
    <>
      {/* <Button
          _theme="orange"
          onPress={() => {
            sheetRef.current?.present();
          }}
          title={t('myBooking.refund_process.fill_data')}
        /> */}
      <Text style={[h4, {lineHeight: 22}]}>
        {desc}:{' '}
        <Text
          onPress={() => sheetRef.current?.present()}
          style={[h1, {color: theme.colors.blue}]}>
          See More
        </Text>
      </Text>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}>
        <View style={styles.modalBackground}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 4,
            }}>
            <View style={[rowCenter, {justifyContent: 'space-between'}]}>
              <View style={[rowCenter]}>
                {/* <Image source={ic_account_bank} style={iconCustomSize(28)} /> */}
                <Text style={[h1, {fontSize: 14}]}>
                  {t('myBooking.refund_rejected.refund_notif')}
                </Text>
              </View>

              <TouchableOpacity onPress={() => sheetRef.current?.dismiss()}>
                <Image
                  source={ic_close2}
                  style={[
                    iconCustomSize(25),
                    {tintColor: theme.colors.grey4, resizeMode: 'contain'},
                  ]}
                />
              </TouchableOpacity>
            </View>

            <Text style={[h1, {marginTop: 20, fontSize: 14}]}>
              {t('myBooking.refund_rejected.refund_req_rejected')}
            </Text>

            <Text style={[h4, {marginTop: 20, lineHeight: 24}]}>
              {t('myBooking.refund_rejected.desc1', {
                name: userProfile?.name,
                order_key: order_key,
              })}
            </Text>

            <Text style={[h1, {}]}>{reason}</Text>
            <Text style={[h4, {lineHeight: 24}]}>
              {t('myBooking.refund_rejected.desc2')}
            </Text>

            <Text style={[h4, {marginTop: 20}]}>
              {t('myBooking.refund_rejected.best_regard')}
            </Text>
            <Text style={[h1, {lineHeight: 24}]}>Get & Ride</Text>

            <View style={{marginBottom: 20}} />

            {/* <Button
              _theme="navy"
              onPress={handleSubmit}
              title={t('myBooking.refund_process.save')}
              isLoading={isLoading}
              styleWrapper={{marginTop: 36}}
            /> */}
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default ModalCancelInfo;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '80%',
    height: '80%',
  },
});
