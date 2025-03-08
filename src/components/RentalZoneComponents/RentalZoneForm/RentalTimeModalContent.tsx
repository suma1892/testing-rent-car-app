import Button from 'components/Button';
import React, {FC, useEffect, useMemo, useState} from 'react';
import ScrollPicker from 'lib/react-native-wheel-scroll-picker';
import {h1, h4} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {utilsState} from 'redux/features/utils/utilsSlice';

type RentalTimeModalContentProps = {
  onSubmit: ({hours, minutes}: {hours: string; minutes: string}) => void;
  title?: string;
  value: string;
  startTime?: string;
  isEndTime?: boolean;
};

const ORIGINAL_HOURS = [
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

const RentalTimeModalContent: FC<RentalTimeModalContentProps> = ({
  onSubmit,
  title = '',
  value,
  startTime,
  isEndTime,
}) => {
  const {t} = useTranslation();
  const isShowBsheet = useAppSelector(utilsState).isShowBSHeet;
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState('-');
  const [minutes, setMinutes] = useState('-');

  const [activeIndex, setActiveIndex] = useState({
    hours: 0,
    minutes: 0,
  });

  const HOURS = useMemo(() => {
    // if (isEndTime && startTime) {
    //   const selectedHours = startTime.slice(0, startTime.length / 2);
    //   const hoursIndex = ORIGINAL_HOURS.findIndex(
    //     x => (parseInt(x) < 10 ? `${x}` : x) === selectedHours,
    //   );
    //   const endSliceLength = ORIGINAL_HOURS.length - 1 - hoursIndex;
    //   const endIndex =
    //     endSliceLength >= 13 ? 13 + hoursIndex : ORIGINAL_HOURS.length - 1;

    //   // return [...ORIGINAL_HOURS.slice(hoursIndex, endIndex), '-'];
    //   return [...ORIGINAL_HOURS.slice(hoursIndex, endIndex)];
    // }

    return ORIGINAL_HOURS;
  }, [isEndTime, startTime]);

  const MINUTES = useMemo(() => {
    if (activeIndex.hours === 0) {
      return ORIGINAL_MINUTES.slice(1, 2);
    }

    if (hours === '22') {
      return ORIGINAL_MINUTES.slice(0, 1);
    }

    return ORIGINAL_MINUTES;
  }, [activeIndex.hours]);

  useEffect(() => {
    setLoading(true);
    if (isShowBsheet && value) {
      const selectedHours = value.slice(0, value.length / 2);
      const selectedMinutes = value.slice(-value.length / 2);

      setTimeout(() => {
        const hoursIndex = HOURS.findIndex(
          x => (parseInt(x) < 10 ? `${x}` : x) === selectedHours,
        );
        const minutesIndex = MINUTES.findIndex(x => x == selectedMinutes);

        setHours(selectedHours);
        setMinutes(selectedMinutes);
        setActiveIndex({
          hours: hoursIndex,
          minutes: minutesIndex,
        });
      }, 300);
    }

    setLoading(false);
  }, [isShowBsheet]);

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 20}]}>
        {title || t('Home.daily.rent_start_time')}
      </Text>
      <View style={styles.line} />

      <Text style={[h4, {textAlign: 'center'}]}>
        {t('Home.daily.headerStartDate')}
      </Text>
      <View style={[rowCenter, {justifyContent: 'center'}]}>
        <View style={{height: 180, zIndex: 99}}>
          {!loading && (
            <ScrollPicker
              dataSource={HOURS}
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
              dataSource={MINUTES}
              isHalf={MINUTES?.length === 2}
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

export default RentalTimeModalContent;

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
