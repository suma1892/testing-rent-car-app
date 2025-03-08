import CustomerPay from '../CustomerPay/CustomerPay';
import DailyVoucherOptionsInput from '../DailyVoucherOptionsInput/DailyVoucherOptionsInput';
import React, {Dispatch, SetStateAction} from 'react';
import RentalZoneInput from '../RentalZone/RentalZoneInput';
import SelectSeat from '../SelectSeat/SelectSeat';
import WithoutDriverSection from './WithoutDriverSection';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {StyleSheet, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {Voucher} from 'redux/features/voucher/voucherSlice';
import AdditionalOptionsInput from '../AdditionalOptionsInput/AdditionalOptionsInput';

type DailySectionProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  isAirportLocation: boolean;
  setIsAirportLocation: Dispatch<SetStateAction<boolean>>;
  withoutDriverSameValue: boolean;
  setWithoutDriverSameValue: Dispatch<SetStateAction<boolean>>;
  onChangeVoucher: (val: Voucher) => void;
};

const DailySection = ({
  form,
  setForm,
  isAirportLocation,
  setIsAirportLocation,
  withoutDriverSameValue,
  setWithoutDriverSameValue,
  onChangeVoucher,
}: DailySectionProps) => {
  const {formDaily} = useAppSelector(appDataState);

  return (
    <>
      <SelectSeat form={form} setForm={setForm} />
      {formDaily?.with_driver ? (
        <>
          <RentalZoneInput />
        </>
      ) : (
        <WithoutDriverSection
          form={form}
          setForm={setForm}
          isAirportLocation={isAirportLocation}
          setIsAirportLocation={setIsAirportLocation}
          withoutDriverSameValue={withoutDriverSameValue}
          setWithoutDriverSameValue={setWithoutDriverSameValue}
        />
      )}

      <View style={styles.lineHorizontal} />

      <DailyVoucherOptionsInput onChange={onChangeVoucher} />

      <AdditionalOptionsInput />
      <View style={styles.lineHorizontal} />

      <CustomerPay
        setPicker={value => setForm({...form, type: value})}
        picker={form.type}
      />
    </>
  );
};

export default DailySection;

const styles = StyleSheet.create({
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 20,
  },
});
