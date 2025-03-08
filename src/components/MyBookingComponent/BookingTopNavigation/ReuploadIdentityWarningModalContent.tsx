import Button from 'components/Button';
import React, {useMemo} from 'react';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {BottomSheetScrollView, WINDOW_HEIGHT} from '@gorhom/bottom-sheet';
import {h1, h4} from 'utils/styles';
import {Image, StyleSheet, Text, View} from 'react-native';
import {img_reupload_identity} from 'assets/images';
import {PAYMENT_STATUSES} from '../utils';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

type ReuploadWarningModalContentProps = {
  onPress: () => void;
};

const ReuploadWarningModalContent = ({
  onPress,
}: ReuploadWarningModalContentProps) => {
  const {t} = useTranslation();
  const {data} = useAppSelector(bookingState);

  const reviewIdentityMessage = useMemo(() => {
    if (data.data?.length) {
      const selectedOrder = data.data?.filter(
        order =>
          order?.review_identity?.messages?.length > 0 &&
          !PAYMENT_STATUSES.hideVerifyIdentityButton.includes(
            order?.order_status,
          ),
      );

      return selectedOrder?.length > 0
        ? selectedOrder?.map(order =>
            order?.review_identity?.messages?.join(', '),
          )
        : '';
    }

    return '';
  }, [data.data?.length]);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={img_reupload_identity}
          style={{width: 215, height: 160}}
          resizeMode="contain"
        />
        <Text style={styles.alertTitle}>
          {t('profile.reupload_your_document')}
        </Text>
        <BottomSheetScrollView style={styles.descriptionContainer}>
          <Text style={styles.alertDescription}>{reviewIdentityMessage}</Text>
        </BottomSheetScrollView>
      </View>

      <Button
        title={t('global.button.okay_understand')}
        onPress={onPress}
        _theme="navy"
      />
    </View>
  );
};

export default ReuploadWarningModalContent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
    height: '90%',
    alignItems: 'center',
    padding: '5%',
  },
  descriptionContainer: {
    maxHeight: WINDOW_HEIGHT / 2,
    flexGrow: 1,
  },
  alertTitle: {
    ...h1,
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: theme.colors.black,
  },
  alertDescription: {
    ...h4,
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.black,
  },
});
