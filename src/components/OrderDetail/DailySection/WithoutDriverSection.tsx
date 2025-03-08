import CustomTextInput from 'components/TextInput';
import DeliveryLocationInput from '../DeliveryLocationInput/DeliveryLocationInput';
import LandingTimeInput from '../LandingTimeInput/LandingTimeInput';
import LocationDetailInput from '../LocationDetailInput/LocationDetailInput';
import React, {Dispatch, SetStateAction} from 'react';
import ReturnLocationInput from '../ReturnLocationInput/ReturnLocationInput';
import {Form} from 'screens/OrderDetailScreen/orderDetailScreen.interface';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type WithoutDriverSectionProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  isAirportLocation: boolean;
  setIsAirportLocation: Dispatch<SetStateAction<boolean>>;
  withoutDriverSameValue: boolean;
  setWithoutDriverSameValue: Dispatch<SetStateAction<boolean>>;
};

const WithoutDriverSection = ({
  form,
  setForm,
  isAirportLocation,
  setIsAirportLocation,
  withoutDriverSameValue,
  setWithoutDriverSameValue,
}: WithoutDriverSectionProps) => {
  const {t} = useTranslation();

  return (
    <View>
      <DeliveryLocationInput
        tooltip={t('detail_order.formDetail.delivery_tooltip') as string}
        locationName={form.taking_location?.name}
        locationId={form.taking_location?.id}
        onSelectLocation={val => {
          if (withoutDriverSameValue) {
            setIsAirportLocation(val.airport);
            setForm({
              ...form,
              taking_location: val,
              return_location: val,
            });
            return;
          }
          setIsAirportLocation(val.airport);
          setForm({...form, taking_location: val});
        }}
      />

      {isAirportLocation && (
        <>
          <CustomTextInput
            placeholder={`${t(
              'detail_order.formDetail.flight_no_placeholder',
            )}`}
            onChangeText={text => setForm({...form, flight_number: text})}
            value={form.flight_number}
            styleTitle={styles.smallFont}
            // outline
          />
          <LandingTimeInput
            value={form.jam_sewa}
            onSelect={({hours, minutes}) => {
              const _hours = hours === '-' ? '21' : hours.padStart(2, '0');
              setForm({
                ...form,
                jam_sewa: `${_hours}${minutes === '-' ? '30' : minutes}`,
              });
            }}
          />
          <LocationDetailInput
            onChange={text => {
              if (withoutDriverSameValue) {
                setForm({
                  ...form,
                  custom_delivery_detail_location: text,
                  custom_return_detail_location: text,
                });
                return;
              }
              setForm({...form, custom_delivery_detail_location: text});
            }}
            placeholder={t('detail_order.formDetail.location_details') || ''}
            title={`${t(
              'detail_order.formDetail.detail_location_delivery_title',
            )}`}
          />
        </>
      )}

      {!isAirportLocation && (
        <LocationDetailInput
          value={form.custom_delivery_detail_location}
          onChange={text => {
            if (withoutDriverSameValue) {
              setForm({
                ...form,
                custom_delivery_detail_location: text,
                custom_return_detail_location: text,
              });
              return;
            }
            setForm({...form, custom_delivery_detail_location: text});
          }}
          isImportant
          title={`${t(
            'detail_order.formDetail.detail_location_delivery_title',
          )}`}
          placeholder={`${t(
            'detail_order.formDetail.detail_location_delivery_title_placeholder',
          )}`}
        />
      )}

      <ReturnLocationInput
        locationName={form.return_location?.name}
        locationId={form.return_location?.id}
        onSelectLocation={val => setForm({...form, return_location: val})}
        onSameWithDeliveryLocationChange={val => {
          if (val) {
            setWithoutDriverSameValue(true);
            setForm({
              ...form,
              return_location: form.taking_location,
              custom_return_detail_location:
                form.custom_delivery_detail_location,
            });
          } else {
            setWithoutDriverSameValue(false);
          }
        }}
      />

      <LocationDetailInput
        value={form.custom_return_detail_location}
        onChange={text =>
          setForm({...form, custom_return_detail_location: text})
        }
        isImportant
        title={`${t('detail_order.formDetail.detail_return_location_title')}`}
        placeholder={`${t(
          'detail_order.formDetail.detail_return_location_title_placeholder',
        )}`}
      />
    </View>
  );
};

export default WithoutDriverSection;

const styles = StyleSheet.create({
  smallFont: {
    fontSize: 12,
  },
});
