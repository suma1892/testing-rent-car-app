import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import CustomTextInput from 'components/TextInput';
import hoc from 'components/hoc';
import React, {useEffect, useState} from 'react';
import {getReferrer, setReferrer} from 'redux/features/user/userAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, ScrollView, StyleSheet, Text} from 'react-native';
import {IParamsReferralCode} from 'types/referral-code.types';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {resetUser, userState} from 'redux/features/user/userSlice';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from 'types/navigator';

interface IErrorMessage {
  error_referral_code: string;
}

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ReferralCode'>;

const ReferralCodeScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const route = useRoute<ProfileScreenRouteProp>();

  const dispatch = useAppDispatch();
  const {isLoading, referrer, isSetReferrerSuccess} = useAppSelector(userState);

  const [form, setForm] = useState<IParamsReferralCode>({
    referral_code: route?.params?.referralCode || '',
  });
  const [formError, setFormError] = useState<IErrorMessage>({
    error_referral_code: '',
  });
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const handleConfirm = () => {
    dispatch(setReferrer(form)).finally(() => {
      setOpenConfirmationModal(false);
    });
  };

  useEffect(() => {
    if (isSetReferrerSuccess) {
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_use_referral_code'),
      });
      dispatch(resetUser());
    }
  }, [isSetReferrerSuccess]);

  useEffect(() => {
    dispatch(getReferrer());
  }, []);

  useEffect(() => {
    if (!!referrer?.referral_code) {
      setForm({referral_code: referrer?.referral_code || ''});
    }
  }, [!!referrer?.referral_code]);

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
              {t('referral_code.referral_code')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="interactive">
      <CustomTextInput
        placeholder={t('referral_code.enter_referral_code')}
        title={t('referral_code.referral_code') as any}
        onChangeText={v => {
          setForm({...form, referral_code: v});
          setFormError({...formError, error_referral_code: ''});
        }}
        value={form.referral_code}
        disabled={!!referrer?.referral_code}
        errorMessage={formError.error_referral_code}
      />

      <Button
        _theme="navy"
        title={t('global.button.save')}
        styleWrapper={{marginTop: 40}}
        onPress={() => {
          if (form.referral_code) {
            setOpenConfirmationModal(true);
          }
        }}
        disabled={!form.referral_code || !!referrer?.referral_code}
      />

      <ConfirmationModal
        isVisible={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleConfirm}
        headerTitle={t('referral_code.confirmation_title') as any}
        description={t('referral_code.confirmation_description') as any}
        isConfirmationLoading={isLoading}
      />
    </ScrollView>
  );
};

export default hoc(
  ReferralCodeScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  modalContent: {
    marginVertical: 10,
    width: '90%',
  },
});
