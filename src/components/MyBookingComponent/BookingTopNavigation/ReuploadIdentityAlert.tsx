import React, {memo, useMemo} from 'react';
import ReuploadWarningModalContent from './ReuploadIdentityWarningModalContent';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {bookingState} from 'redux/features/myBooking/myBookingSlice';
import {h4} from 'utils/styles';
import {ic_warning} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image} from 'react-native';
import {PAYMENT_STATUSES} from '../utils';
import {showBSheet} from 'utils/BSheet';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ITopTabs} from 'types/top-tab.types';

const ReuploadIdentityAlert = () => {
  const {t} = useTranslation();
  const {data, isLoading} = useAppSelector(bookingState);
  const {userProfile} = useAppSelector(appDataState);

  const viewMessageModal = () => {
    showBSheet({
      snapPoint: ['60%', '100%'],
      content: <ReuploadWarningModalContent onPress={viewMessageModal} />,
    });
  };

  const reviewIdentityMessage = useMemo(() => {
    if (data.data?.length && !isLoading) {
      const selectedOrder = data.data?.find(
        order =>
          order?.review_identity?.messages?.length &&
          !PAYMENT_STATUSES.hideVerifyIdentityButton.includes(
            order?.order_status,
          ),
      );

      return selectedOrder
        ? selectedOrder?.review_identity?.messages?.join(', ')
        : '';
    }

    return '';
  }, [data.data, isLoading]);

  if (
    reviewIdentityMessage &&
    (userProfile.personal_info?.need_review_ktp ||
      userProfile.personal_info?.need_review_sim)
  ) {
    return (
      <View style={styles.identityAlertContainer}>
        <View style={styles.warningContainer}>
          <Image
            source={ic_warning}
            style={iconCustomSize(14)}
            resizeMode="contain"
          />
          <Text style={styles.identityAlertDescription}>
            {t('profile.reupload_your_document')}
          </Text>
        </View>

        <TouchableOpacity onPress={viewMessageModal}>
          <Text style={styles.viewMessage}>{t('profile.view_message')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default memo(ReuploadIdentityAlert);

const styles = StyleSheet.create({
  identityAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF7EA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.orange,
    marginHorizontal: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  identityAlertDescription: {
    ...h4,
    fontSize: 14,
    marginLeft: 5,
    color: theme.colors.black,
  },
  viewMessage: {
    ...h4,
    fontSize: 13,
    textDecorationLine: 'underline',
    color: theme.colors.orange,
  },
});
