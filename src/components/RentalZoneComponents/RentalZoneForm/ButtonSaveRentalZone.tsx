import Button from 'components/Button';
import React, {useMemo} from 'react';
import {OrderBookingZone} from 'types/global.types';
import {useTranslation} from 'react-i18next';

interface ButtonSaveRentalZoneProps {
  onClick: () => void;
  form: OrderBookingZone;
  isOutsideOperationalHours: boolean;
}

const ButtonSaveRentalZone: React.FC<ButtonSaveRentalZoneProps> = ({
  onClick,
  form,
  isOutsideOperationalHours,
}) => {
  const {t} = useTranslation();

  const isDisabled = useMemo(() => {
    const isFormComplete =
      form.driving_zone_id &&
      form.drop_off_zone_id &&
      form.pick_up_zone_id &&
      form.booking_end_time &&
      form.booking_start_time;

    if (!isFormComplete) return true;
    if (isOutsideOperationalHours && form.is_operational_hours_agreement)
      return false;
    if (!isOutsideOperationalHours && !form.is_operational_hours_agreement)
      return false;

    return true;
  }, [form, isOutsideOperationalHours]);

  return (
    <Button
      _theme="orange"
      title={t('global.button.save')}
      onPress={onClick}
      styleWrapper={{marginTop: 20}}
      disabled={isDisabled}
    />
  );
};

export default ButtonSaveRentalZone;
