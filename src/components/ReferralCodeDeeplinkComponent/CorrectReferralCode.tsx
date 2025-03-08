import React, {useEffect} from 'react';
import {ReferralCodeDeeplinkScreenRouteProp} from 'screens/ReferralCodeDeeplinkScreen/ReferralCodeDeeplinkScreen';
import {resetUser, userState} from 'redux/features/user/userSlice';
import {setReferrer} from 'redux/features/user/userAPI';
import {showToast} from 'utils/Toast';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const CorrectReferralCode = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ReferralCodeDeeplinkScreenRouteProp>();
  const dispatch = useAppDispatch();
  const {isSetReferrerSuccess} = useAppSelector(userState);
  const {t} = useTranslation();

  useEffect(() => {
    if (isSetReferrerSuccess) {
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_use_referral_code'),
      });
      navigation.replace('MainTab');
      dispatch(resetUser());
    }
  }, [isSetReferrerSuccess]);

  useEffect(() => {
    dispatch(
      setReferrer({
        referral_code: route.params?.referralCode,
        show_toast: false,
      }),
    );

    return () => {};
  }, []);

  return <></>;
};

export default CorrectReferralCode;
