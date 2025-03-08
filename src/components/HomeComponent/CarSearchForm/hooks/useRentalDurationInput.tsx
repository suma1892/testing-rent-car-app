import React, {useEffect, useState} from 'react';
import RentalDurationModalContent from '../partials/RentalDurationModalContent';
import {calculateDateDifference} from 'utils/functions';
import {RentalDurationInputProps} from '../partials/RentalDurationInput';
import {showBSheet} from 'utils/BSheet';
import {useTranslation} from 'react-i18next';

const useRentalDurationInput = ({
  form,
  setForm,
  setFormError,
}: RentalDurationInputProps) => {
  const {t} = useTranslation();
  const [value, setValue] = useState('');

  const showRentalDurationModal = () => {
    if (form.tanggal_sewa) {
      showBSheet({
        snapPoint: ['75%', '75%'],
        content: (
          <RentalDurationModalContent
            form={form}
            setForm={setForm}
            onSelect={val => {
              setValue(val);
              showRentalDurationModal();
            }}
          />
        ),
      });
    } else {
      setFormError(prev => ({
        ...prev,
        error_tanggal_sewa: `${t('Home.daily.error_rent_date')}`,
      }));
    }
  };

  useEffect(() => {
    onClear();
    return () => {};
  }, [form.tanggal_sewa]);

  const onClear = () => {
    setValue('');
    setForm(prev => ({
      ...prev,
      tanggal_pengembalian: '',
      duration: 0,
    }));
  };

  useEffect(() => {
    if (!value && form.tanggal_pengembalian) {
      const dateDiff = calculateDateDifference({
        firstDate: form.tanggal_sewa,
        secondDate: form.tanggal_pengembalian,
        withDriver: true,
      });
      setValue(dateDiff);
    }
  }, [value, form.tanggal_pengembalian]);

  return {
    value,
    showRentalDurationModal,
    onClear,
  };
};

export default useRentalDurationInput;
