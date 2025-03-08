import {addDays, format, startOfDay} from 'date-fns';
import {
  calculateDateDifference,
  getEndRentalDate,
  getStartRentalDate,
} from 'utils/functions';
import {RentalDurationModalContentProps} from '../partials/RentalDurationModalContent';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {utilsState} from 'redux/features/utils/utilsSlice';
import {appDataState, saveFormDaily} from 'redux/features/appData/appDataSlice';

const useRentalDurationModalContent = ({
  form,
  setForm,
  onSelect,
}: RentalDurationModalContentProps) => {
  const {t} = useTranslation();
  const isShowBsheet = useAppSelector(utilsState).isShowBSHeet;
  const [selectedDay, setSelectedDay] = useState(0);

  const convertRentalStartDate = (days: number) => {
    let arrangedStartDate = '';

    const startDate = getStartRentalDate({
      withDay: false,
      startBookingDate: form.tanggal_sewa?.replace(/\//g, '-'),
    });

    if (days > 1) {
      const endDate = getEndRentalDate(
        `${startOfDay(
          addDays(new Date(form?.tanggal_sewa?.replace(/\//g, '-')), days - 1),
        )}`,
      );

      // identify month
      const monthOfStartDate = startDate.split(' ')[1];
      const monthOfEndDate = endDate.split(' ')[1];
      if (monthOfStartDate === monthOfEndDate) {
        arrangedStartDate = startDate.split(' ')[0];
      } else {
        arrangedStartDate = `${startDate.split(' ')[0]} ${
          startDate.split(' ')[1]
        }`;
      }

      // identify year
      const yearOfStartDate = startDate.split(' ')[2];
      const yearOfEndDate = endDate.split(' ')[2];
      if (yearOfStartDate !== yearOfEndDate) {
        arrangedStartDate += ` ${startDate.split(' ')[2]}`;
      }

      return `${arrangedStartDate} - ${endDate}`;
    } else {
      return startDate;
    }
  };
  const dispatch = useAppDispatch();
  const formDaily = useAppSelector(appDataState).formDaily;

  const handleSubmit = () => {
    const rentalEndDate = format(
      startOfDay(
        addDays(
          new Date(form?.tanggal_sewa?.replace(/\//g, '-')),
          selectedDay - 1,
        ),
      ),
      'yyyy/MM/dd',
    );
    setForm(prev => ({...prev, tanggal_pengembalian: rentalEndDate}));
    onSelect(
      `${selectedDay} ${
        selectedDay > 1 ? t('Home.daily.days') : t('Home.daily.day')
      }`,
    );
    dispatch(
      saveFormDaily({
        ...formDaily,
        duration: selectedDay,
      }),
    );
  };

  useEffect(() => {
    if (isShowBsheet && form.tanggal_pengembalian && !selectedDay) {
      const dateDiff = calculateDateDifference({
        firstDate: form.tanggal_sewa,
        secondDate: form.tanggal_pengembalian,
        withDriver: true,
      });

      setSelectedDay(Number(dateDiff.split(' ')[0]));
    }
  }, [isShowBsheet]);

  return {
    selectedDay,
    setSelectedDay,
    convertRentalStartDate,
    handleSubmit,
  };
};

export default useRentalDurationModalContent;
