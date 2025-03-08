import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import DropdownBank from 'components/UploadBankTransferComponent/DropdownBank/DropdwonBank';
import hoc from 'components/hoc';
import React, {useEffect, useState} from 'react';
import SenderTextInput from 'components/UploadBankTransferComponent/SenderTextInput/SenderTextInput';
import UploadImageInput from 'components/UploadImageInput/UploadImageInput';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h5} from 'utils/styles';
import {IBanks} from 'types/global.types';
import {ic_arrow_left_white, ic_bca, ic_uob} from 'assets/icons';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {orderState} from 'redux/features/order/orderSlice';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {timeZone} from 'utils/getTimezone';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  postDisbursements,
  postDisbursementsReconfirmation,
} from 'redux/features/order/orderAPI';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {
  UploadBankTransferFormData,
  UploadBankTransferFormError,
  UploadBankTransferScreenRouteProp,
} from './types';

const UploadBankTransferScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<UploadBankTransferScreenRouteProp>();
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector(appDataState).payments;
  const transactionKey = useAppSelector(orderState).order.transaction_key;
  const isDisbursementSuccess =
    useAppSelector(orderState).isDisbursementSuccess;

  const [form, setForm] = useState<UploadBankTransferFormData>({
    sender_name: '',
    sender_bank_name: '',
    disbursement_confirmation_image: '',
    disbursement_confirmation_image_size: '',
  });
  const [formError, setFormError] = useState<UploadBankTransferFormError>({
    sender_name: '',
    sender_bank_name: '',
    disbursement_confirmation_image: '',
  });

  const openImagePicker = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
      });

      if (result?.assets?.length) {
        setForm({
          ...form,
          disbursement_confirmation_image: `data:image/png;base64,${result.assets?.[0]?.base64}`,
          disbursement_confirmation_image_size: result.assets?.[0]
            .fileSize as number,
        });
        setFormError({...formError, disbursement_confirmation_image: ''});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    const _errorMessage: any = {};
    let status = true;
    if (!form.sender_name) {
      _errorMessage['sender_name'] = t('global.alert.warning_sender_name');
      status = false;
    }

    if (!form.sender_bank_name) {
      _errorMessage['sender_bank_name'] = t('global.alert.warning_bank');
      status = false;
    }

    if (!form.disbursement_confirmation_image) {
      _errorMessage['disbursement_confirmation_image'] = t(
        'global.alert.warning_proof_payment',
      );
      status = false;
    }

    if (parseInt(form.disbursement_confirmation_image_size as any) >= 1000000) {
      _errorMessage['disbursement_confirmation_image'] = t(
        'global.alert.warning_file_size',
      );
      status = false;
    }

    setFormError({..._errorMessage});

    if (!status) {
      return;
    }

    if (!!route.params?.reconfirmation) {
      dispatch(
        postDisbursementsReconfirmation({
          reconfirmation_image: form.disbursement_confirmation_image,
          sender_name: form.sender_name?.trim(),
          sender_bank_name: form.sender_bank_name,
          transaction_key: (transactionKey ||
            route.params?.transaction_key) as any,
          time_zone: timeZone,
        }),
      );
    } else {
      dispatch(
        postDisbursements({
          transaction_key: transactionKey || route.params?.transaction_key,
          payment_type_id: paymentMethods.find(
            x => x.code == route.params?.selectedPayment.code,
          )?.id,
          sender_name: form.sender_name?.trim(),
          sender_bank_name: form.sender_bank_name,
          disbursement_confirmation_image: form.disbursement_confirmation_image,
          time_zone: timeZone,
        }),
      );
    }
  };

  const handleIcon = (ic: string) => {
    switch (ic) {
      case 'BCA':
        return ic_bca;
      case 'UOB':
        return ic_uob;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isDisbursementSuccess) {
      showToast({
        message: t('global.alert.success_upload_proof_payment'),
        title: t('global.alert.success'),
        type: 'success',
      });

      navigation.navigate('MainTab', {
        screen: 'Booking',
      } as any);
      // navigation.navigate('ProofTransfer', {
      //   selectedPayment: route.params.selectedPayment,
      //   reconfirmation: route?.params?.reconfirmation,
      //   transaction_key: route.params.transaction_key,
      // });
    }
  }, [isDisbursementSuccess]);

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
              {t('bank_transfer.upload_proof_payment')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        margin: 16,
        justifyContent: 'space-between',
      }}
      keyboardDismissMode="interactive">
      <View>
        <View style={[rowCenter, {marginTop: 10}]}>
          <Image
            source={handleIcon(route.params?.selectedPayment?.code)}
            style={{
              marginRight: 10,
              width: 60,
              height: 32,
              borderWidth: 1,
              borderColor: theme.colors.grey7,
              borderRadius: 3,
            }}
            resizeMode="contain"
          />
          <Text style={[h5, {fontSize: 12, marginLeft: 10}]}>
            {t('bank_transfer.upload_proof_payment')}
          </Text>
        </View>

        <SenderTextInput
          onChangeText={v => {
            const regex = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
            const filtered = v.replace(regex, '');
            setForm({...form, sender_name: filtered});
            setFormError({...formError, sender_name: ''});
          }}
          value={form.sender_name}
          errorMessage={formError.sender_name}
        />

        <DropdownBank
          onSelect={(v: IBanks) => {
            setForm({...form, sender_bank_name: v.name});
            setFormError({...formError, sender_bank_name: ''});
          }}
          selected={form.sender_bank_name}
          errorMessage={formError.sender_bank_name}
        />

        <UploadImageInput
          label={`${t('upload_bank_transfer.upload_photo')} :`}
          selectedImageLabel={t('upload_bank_transfer.proof_of_payment_image')}
          selected={form.disbursement_confirmation_image}
          onPress={openImagePicker}
          onDelete={() => {
            setForm({...form, disbursement_confirmation_image: ''});
            setFormError({
              ...formError,
              disbursement_confirmation_image: t(
                'global.alert.warning_need_upload_proof',
              ),
            });
          }}
          errorMessage={formError.disbursement_confirmation_image}
        />
      </View>

      <Button
        _theme="navy"
        onPress={handleSubmit}
        title={t('global.button.done')}
      />
    </ScrollView>
  );
};

export default hoc(
  UploadBankTransferScreen,
  theme.colors.navy,
  false,
  'light-content',
);
