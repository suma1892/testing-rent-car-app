import AirportDeliveryLocationInput from 'components/OrderDetail/AirportDeliveryLocationInput/AirportDeliveryLocationInput';
import AirportPickupLocationInput from 'components/OrderDetail/AirportPickupLocationInput/AirportPickupLocationInput';
import AirportVoucherOptionsInput from '../AirportVoucherOptionsInput/AirportVoucherOptionsInput';
import CustomTextInput from 'components/TextInput';
import LocationDetailInput from 'components/OrderDetail/LocationDetailInput/LocationDetailInput';
import React, {Dispatch, FC, SetStateAction} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {ic_mercu, ic_pinpoin, ic_plane2} from 'assets/icons';
import {StyleSheet, View} from 'react-native';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {Voucher} from 'redux/features/voucher/voucherSlice';
import {theme} from 'utils';
import AdditionalOptionsInput from '../AdditionalOptionsInput/AdditionalOptionsInput';

type AirportTransferSectionProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  onChangeVoucher: (val: Voucher) => void;
};

const AirportTransferSection: FC<AirportTransferSectionProps> = ({
  form,
  setForm,
  onChangeVoucher,
}) => {
  const {t} = useTranslation();
  const {formAirportTransfer} = useAppSelector(appDataState);

  return (
    <View>
      <AirportPickupLocationInput
        locationName={formAirportTransfer?.pickup_location?.name}
        disabled
        leftIcon={formAirportTransfer.is_switched ? ic_mercu : ic_pinpoin}
      />

      <LocationDetailInput
        value={form.custom_pickup_detail_location}
        isImportant={true}
        onChange={text =>
          setForm({...form, custom_pickup_detail_location: text})
        }
      />

      <View style={styles.marginTop10} />

      <CustomTextInput
        placeholder={t('detail_order.formDetail.flight_no_placeholder')}
        isImportant={true}
        leftIcon={ic_plane2}
        title={`${t('detail_order.formDetail.flight_no_title')}`}
        onChangeText={text => setForm({...form, flight_number: text})}
        value={form.flight_number}
      />

      <AirportDeliveryLocationInput
        disabled
        locationName={formAirportTransfer?.dropoff_location?.name}
        leftIcon={formAirportTransfer.is_switched ? ic_pinpoin : ic_mercu}
      />

      <View style={styles.lineHorizontal} />
      <AirportVoucherOptionsInput onChange={onChangeVoucher} />
    </View>
  );
};

export default AirportTransferSection;

const styles = StyleSheet.create({
  marginTop10: {
    marginTop: 10,
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 20,
  },
});
