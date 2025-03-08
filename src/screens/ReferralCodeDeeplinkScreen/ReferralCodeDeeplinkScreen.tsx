import appBar from 'components/AppBar/AppBar';
import CorrectReferralCode from 'components/ReferralCodeDeeplinkComponent/CorrectReferralCode';
import CustomReferralCodeMessage from 'components/ReferralCodeDeeplinkComponent/CustomReferralCodeMessage';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useEffect, useMemo} from 'react';
import {authState} from 'redux/features/auth/authSlice';
import {h1} from 'utils/styles';
import {
  ic_arrow_left_white,
  ic_refcode_already_use,
  ic_refcode_wrong,
} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {rowCenter} from 'utils/mixins';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {userState} from 'redux/features/user/userSlice';
import {useTranslation} from 'react-i18next';
import {
  checkAvailableReferralCode,
  getReferrer,
} from 'redux/features/user/userAPI';

export type ReferralCodeDeeplinkScreenRouteProp = RouteProp<
  RootStackParamList,
  'ReferralCodeDeeplink'
>;

const ReferralCodeDeeplinkScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ReferralCodeDeeplinkScreenRouteProp>();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {isLoading, isError, errorResponse, referrer} =
    useAppSelector(userState);
  const auth = useAppSelector(authState);

  const shouldLoginFirst = !auth?.isSignIn;
  const userNotFound = isError && errorResponse?.slug === 'user-not-found';
  const referralCodeAvailable = !isLoading && !isError;
  const referralCodeAlreadyUsed =
    !!referrer?.referral_code &&
    route.params?.referralCode === referrer?.referral_code;
  const ownReferralCode =
    isError && errorResponse?.slug === "can't used your own referal code";
  const referralCodeAlreadyExist =
    isError &&
    errorResponse?.slug === "can't refer a user. referrer is already exists";

  const customReferralCodeMessageProps = useMemo(() => {
    if (userNotFound) {
      return {
        image: ic_refcode_wrong,
        title: t('referral_code.incorrect_referral_code'),
        description: t('referral_code.incorrect_referral_code_desc'),
      };
    }

    if (referralCodeAlreadyUsed) {
      return {
        image: ic_refcode_already_use,
        title: t('referral_code.referral_is_already_in_use'),
        description: t('referral_code.referral_is_already_in_use_desc'),
      };
    }

    if (referralCodeAlreadyExist) {
      return {
        image: ic_refcode_already_use,
        title: t('referral_code.referral_is_already_exist'),
        description: t('referral_code.referral_is_already_exist_desc'),
      };
    }

    if (ownReferralCode) {
      return {
        image: ic_refcode_already_use,
        title: t('referral_code.referral_invalid'),
        description: t('referral_code.own_referral_code_error'),
      };
    }

    return {
      image: ic_refcode_wrong,
      title: t('referral_code.incorrect_referral_code'),
      description: t('referral_code.incorrect_referral_code_desc'),
  };
  }, [
    userNotFound,
    referralCodeAlreadyUsed,
    ownReferralCode,
    referralCodeAlreadyExist,
  ]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.navigate('MainTab')}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('Account.referral_code')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  useEffect(() => {
    dispatch(getReferrer());
  }, [navigation]);

  useEffect(() => {
    if (
      route.params?.referralCode &&
      !referralCodeAlreadyUsed &&
      !ownReferralCode
    ) {
      dispatch(
        checkAvailableReferralCode({referralCode: route.params?.referralCode}),
      );
    }
  }, [route.params?.referralCode, referralCodeAlreadyUsed, ownReferralCode]);

  useEffect(() => {
    if (shouldLoginFirst) {
      navigation.replace('Register', {
        referralCode: route.params?.referralCode,
      });
    }
  }, [isError]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {referralCodeAvailable ? (
        <CorrectReferralCode />
      ) : (
        <CustomReferralCodeMessage {...customReferralCodeMessageProps} />
      )}
    </View>
  );
};

export default hoc(
  ReferralCodeDeeplinkScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
  },
});
