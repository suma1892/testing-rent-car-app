import Button from 'components/Button';
import moment from 'moment';
import React, {FC, useEffect, useState} from 'react';
import ScrollPicker from 'lib/react-native-wheel-scroll-picker';
import {h1, h4} from 'utils/styles';
import {IForm} from '../hooks/useAirportCarSearchForm';
import {rowCenter} from 'utils/mixins';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {utilsState} from 'redux/features/utils/utilsSlice';
import i18next from 'i18next';

type PickupTimeModalContentProps = {
  form: IForm;
  onSubmit: ({hours, minutes}: {hours: string; minutes: string}) => void;
  title?: string;
  customHours?: string[];
  isAirportTransfer?: boolean;
};

const DAILY_HOURS = [
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  // '-',
];
const AIRPORT_HOURS = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  // '-',
];
const ORIGINAL_MINUTES = [
  '00',
  '30',
  // '-'
];

const PickupTimeModalContent: FC<PickupTimeModalContentProps> = ({
  form,
  onSubmit,
  title = '',
  customHours = [],
  isAirportTransfer,
}) => {
  const {t} = useTranslation();
  const isShowBsheet = useAppSelector(utilsState).isShowBSHeet;
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState('-');
  const [minutes, setMinutes] = useState('-');

  const [activeIndex, setActiveIndex] = useState({
    hours: 0,
    minutes: 0,
  });

  const HOURS = isAirportTransfer ? AIRPORT_HOURS : DAILY_HOURS;
  const MINUTES =
    isAirportTransfer || activeIndex.hours !== 0
      ? ORIGINAL_MINUTES
      : ORIGINAL_MINUTES.slice(1, 2);

  const [listHours, setListHours] = useState([...HOURS]);
  const [listMinutes, setListMinutes] = useState([...MINUTES]);

  function generateTimeLists(selectedHour: string, tgl_sewa: string) {
    //exm 09:24
    const current = moment().format('YYYY-MM-DD');
    const inputDate = moment(form.pickup_date, 'YYYY/MM/DD').format(
      'YYYY-MM-DD',
    );
    const cont = moment(inputDate).isAfter(current);

    if (cont) {
      return {listHours: [...HOURS], listMinutes: [...MINUTES]};
    } else {
      // Buat salinan HOURS dan MINUTES asli
      const updatedListHours = [...HOURS];
      const updatedListMinutes = [...MINUTES];

      if (selectedHour && selectedHour.includes(':')) {
        // Pisahkan jam dan menit dari selectedHour
        const [hour, minute] = selectedHour.split(':');

        if (HOURS.includes(hour)) {
          // Setel listHours berdasarkan selectedHour
          const selectedIndex = HOURS.indexOf(hour);
          updatedListHours.splice(0, selectedIndex + (minute >= '30' ? 1 : 0));

          // Setel listMinutes berdasarkan minute
          if (minute < '30') {
            updatedListMinutes.splice(0, 1);
          }
        } else if (hour > '21') {
          updatedListHours.length = 1;
          updatedListHours[0] = '-';

          updatedListMinutes.length = 1;
          updatedListMinutes[0] = '-';
        }
      }

      return {listHours: updatedListHours, listMinutes: updatedListMinutes};
    }
    // Return hasilnya
  }

  useEffect(() => {
    const time = moment().format('HH:mm').toString();
    const data = generateTimeLists(time, form.pickup_date);
    setListHours(data?.listHours);
    setListMinutes(data?.listMinutes);

    if (isShowBsheet && form.pickup_time) {
      const selectedHours = form.pickup_time.slice(
        0,
        form.pickup_time.length / 2,
      );
      const selectedMinutes = form.pickup_time.slice(
        -form.pickup_time.length / 2,
      );

      const hoursIndex = data.listHours.findIndex(
        x => (parseInt(x) < 10 ? `${x}` : x) === selectedHours,
      );
      const minutesIndex = data.listMinutes.findIndex(
        x => x === selectedMinutes,
      );

      setHours(selectedHours);
      setMinutes(selectedMinutes);
      setActiveIndex({
        hours: hoursIndex,
        minutes: minutesIndex,
      });
    }

    if (!form.pickup_time) {
      setHours(data?.listHours?.[0]);
      setMinutes(data?.listMinutes?.[0]);
    }

    setLoading(false);
  }, [isShowBsheet]);

  useEffect(() => {
    return () => {};
  }, [minutes]);

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 20}]}>
        {title || t('Home.daily.rent_start_time')}
      </Text>
      <View style={styles.line} />

      <Text style={[h4, {textAlign: 'center'}]}>
        {t('Home.daily.headerStartDate')} (
        {getIndonesianTimeZoneName({
          timezone: form?.pickup_location?.time_zone,
          lang: i18next.language,
        })}
        ){' '}
      </Text>
      <View style={[rowCenter, {justifyContent: 'center'}]}>
        <View style={{height: 180, zIndex: 99}}>
          {!loading && (
            <ScrollPicker
              dataSource={customHours?.length > 0 ? customHours : listHours}
              selectedIndex={activeIndex.hours || 0}
              onValueChange={(data: any, selectedIndex: any) => {
                setActiveIndex(prev => ({...prev, hours: selectedIndex}));
                setHours(data);
              }}
              wrapperHeight={180}
              wrapperColor="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              activeScreen={'HOUR'}
              highlightBorderWidth={2}
              setListMinutes={(idx: number) => {
                const time = moment().format('HH:mm').toString();
                const data = generateTimeLists(time, form.pickup_date);

                if (idx === 0) {
                  setListMinutes(data?.listMinutes);
                  setActiveIndex({...activeIndex, minutes: 0});
                } else {
                  setListMinutes(MINUTES);
                }
              }}
              activeItemTextStyle={styles.hoursActiveItemText}
              itemTextStyle={styles.hoursItemText}
            />
          )}
        </View>

        <Text
          style={[
            h1,
            {
              marginTop: -20,
            },
          ]}>
          :
        </Text>

        <View>
          {!loading && (
            <ScrollPicker
              dataSource={listMinutes}
              isHalf={listMinutes?.length === 2}
              activeScreen={'MINUTES'}
              selectedIndex={activeIndex.minutes || 0}
              renderItem={(data: any) => (
                <View
                  style={{
                    marginLeft: 50,
                    backgroundColor: 'red',
                  }}>
                  <Text style={{backgroundColor: 'red'}}>{data}</Text>
                </View>
              )}
              onValueChange={(data: any, selectedIndex: any) => {
                setActiveIndex(prev => ({...prev, minutes: selectedIndex}));
                setMinutes(data);
                // setMinutes('00');
              }}
              wrapperColor="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              activeItemColor={'red'}
              highlightBorderWidth={2}
              activeItemTextStyle={styles.minuteActiveItemText}
              itemTextStyle={styles.minuteItemText}
            />
          )}
        </View>
      </View>

      <Text style={[h4, {textAlign: 'center'}]}>
        {t('Home.daily.footerStartDate')}
      </Text>

      <Button
        title={t('global.button.done')}
        disabled={listHours[0] === '-' || listMinutes[0] === '-'}
        _theme="navy"
        styleWrapper={{marginTop: 20}}
        onPress={() => {
          onSubmit({
            hours,
            minutes,
          });
        }}
      />
    </View>
  );
};

export default PickupTimeModalContent;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16, width: '100%'},
  line: {
    borderBottomColor: theme.colors.grey5,
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  hoursItemText: {
    fontSize: 20,
    marginLeft: 20,
    padding: 20,
    lineHeight: 26,
    textAlign: 'center',
    color: '#B4B4B4',
  },
  hoursActiveItemText: {
    fontSize: 23,
    marginLeft: 20,
    color: theme.colors.navy,
  },
  minuteActiveItemText: {
    fontSize: 23,
    lineHeight: 26,
    marginRight: 20,
    color: theme.colors.navy,
  },
  minuteItemText: {
    fontSize: 20,
    marginRight: 20,
    lineHeight: 26,
    textAlign: 'center',
    color: '#B4B4B4',
  },
});
