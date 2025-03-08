import appBar from 'components/AppBar/AppBar';
import hoc from 'components/hoc';
import InputOtp from 'components/RegisterComponent/InputOtp';
import React, {FC, useEffect} from 'react';
import SelectVerificationMethod from 'components/RegisterComponent/SelectVerificationMethod';
import SentOtp from 'components/RegisterComponent/SentOtp';
import {container} from 'utils/mixins';
import {FONT_SIZE_12, FONT_SIZE_20} from 'utils/typography';
import {h1, h3} from 'utils/styles';
import {RootStackParamList} from 'types/navigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

type ProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  'RegisterVerification'
>;

const RegisterVerificationScreen: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<ProfileScreenRouteProp>();

  useEffect(() => {
    navigation.setOptions(
      appBar({
        // title: 'Home'
      }),
    );
  }, [navigation]);

  return (
    <View
      style={[
        container,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={[h1, styles.textHeader]}>{t('register.verification')}</Text>
      <Text style={[h3, styles.textDesc]}>
        {t('register.choose_verification_method')}
      </Text>

      {route.params?.page === 'selectMethod' && (
        <SelectVerificationMethod referralCode={route?.params?.referralCode} />
      )}
      {route.params?.page === 'sendOtp' && (
        <SentOtp referralCode={route?.params?.referralCode} />
      )}
      {route.params?.page === 'inputOtp' && (
        <InputOtp referralCode={route?.params?.referralCode} />
      )}
    </View>
  );
};

export default hoc(RegisterVerificationScreen);

const styles = StyleSheet.create({
  textHeader: {
    fontSize: FONT_SIZE_20,
    color: theme.colors.navy,
  },
  textDesc: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.grey5,
    marginTop: 12,
    textAlign: 'center',
  },
});
