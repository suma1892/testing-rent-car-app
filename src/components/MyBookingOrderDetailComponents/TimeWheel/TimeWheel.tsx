import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BottomSheetModal, SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
// import ScrollPicker from 'react-native-wheel-scrollview-picker';
import ScrollPicker from '../../../lib/react-native-wheel-scroll-picker';
import {theme} from 'utils';
import {rowCenter} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';

const JAM = [
  '7',
  '8',
  '9',
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
  '24',
  // '-',
];
const MENIT = [
  '00',
  '30',
  // '-'
];
const TimeWheel = ({form, setForm, showWheel, setShowWheel}: any) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginBottom2, setMarginBottom2] = useState(0);
  const {t} = useTranslation();

  const [jam, setJam] = useState('07');
  const [menit, setMenit] = useState('00');

  const [activeIndex, setActiveIndex] = useState({
    jam: 0,
    menit: 0,
  });

  // variables
  const snapPoints = useMemo(() => ['70%', '70%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setShowWheel(false);
      setMarginBottom(0);
      setMarginBottom2(0);
    }
  }, []);

  useEffect(() => {
    if (showWheel) {
      sheetRef.current?.present();
      let _jam = form?.rentalHours.slice(0, form.rentalHours.length / 2);
      let _menit = form.rentalHours.slice(-form.rentalHours.length / 2);

      const findIdxJam = JAM.findIndex(
        x => (parseInt(x) < 10 ? `0${x}` : x) === _jam,
      );
      const findIdxMenit = MENIT.findIndex(x => x === _menit);

      setActiveIndex({
        jam: findIdxJam,
        menit: findIdxMenit,
      });

      if (findIdxJam === 17) {
        setMarginBottom(50);
      } else {
        setMarginBottom(0);
      }

      if (findIdxMenit === 1) {
        setMarginBottom2(50);
      } else {
        setMarginBottom2(0);
      }
    }
  }, [showWheel]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={{backgroundColor: theme.colors.white}}
      handleStyle={{marginBottom: 8, marginTop: 4}}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.75,
        shadowRadius: 24,

        elevation: 24,
      }}>
      <View style={{flex: 1, backgroundColor: '#fff', padding: 16}}>
        <Text style={[h1, {fontSize: 20}]}>{t('Home.daily.startTime')}</Text>
        <View
          style={{
            borderBottomColor: theme.colors.grey5,
            borderBottomWidth: 1,
            marginVertical: 30,
          }}
        />

        <Text style={[h4, {textAlign: 'center'}]}>
          {t('Home.daily.headerStartDate')}
        </Text>
        <View
          style={[rowCenter, {alignItems: 'center', justifyContent: 'center'}]}>
          <View style={{height: 180, zIndex: 99}}>
            <ScrollPicker
              dataSource={JAM}
              selectedIndex={activeIndex.jam || 0}
              // scrollViewComponent={ScrollView}
              renderItem={(data: any) => (
                <View
                  style={
                    {
                      // height: 50,
                      // width: 100,
                      // alignSelf: 'center',
                      // backgroundColor: 'red',
                      // marginBottom: 10,
                    }
                  }>
                  {/* {data!== '-' && <Text>{data}</Text>} */}
                </View>
              )}
              onValueChange={(data: any, selectedIndex: any) => {
                //
                // setForm({...form, rentalHours: selectedIndex});
                setJam(data);
                if (selectedIndex === 17) {
                  setMarginBottom(50);
                } else {
                  setMarginBottom(0);
                }
                //
              }}
              wrapperHeight={180}
              // wrapperWidth={350}
              wrapperColor="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              // activeItemColor={'red'}
              highlightBorderWidth={2}
              activeItemTextStyle={{
                fontSize: 23,
                // lineHeight: 26,
                marginLeft: 20,
                // paddingBottom: marginBottom,
                // backgroundColor: 'red',
                color: theme.colors.navy,
              }}
              itemTextStyle={{
                fontSize: 20,
                marginLeft: 20,
                lineHeight: 26,
                // paddingBottom: marginBottom,
                textAlign: 'center',
                color: '#B4B4B4',
              }}
              // style={{height: 200}}
            />
          </View>

          <Text
            style={[
              h1,
              {
                position: 'absolute',
                alignSelf: 'center',
                // left: '36%',
                bottom: SCREEN_HEIGHT / 8.4,
              },
            ]}>
            {' '}
            :{' '}
          </Text>

          <View style={{}}>
            <ScrollPicker
              dataSource={MENIT}
              selectedIndex={activeIndex.menit || 0}
              // scrollViewComponent={BottomSheetScrollView}
              renderItem={(data: any) => (
                <View
                  style={{
                    // alignSelf: 'center',
                    marginLeft: 50,
                    backgroundColor: 'red',
                  }}>
                  <Text style={{backgroundColor: 'red'}}>{data}</Text>
                </View>
              )}
              onValueChange={(data: any, selectedIndex: any) => {
                setMenit(data);
                if (selectedIndex === 1) {
                  setMarginBottom2(50);
                } else {
                  setMarginBottom2(0);
                }
                //
              }}
              wrapperColor="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              activeItemColor={'red'}
              highlightBorderWidth={2}
              activeItemTextStyle={{
                fontSize: 23,
                lineHeight: 26,
                marginRight: 20,
                // paddingBottom: marginBottom2,
                color: theme.colors.navy,
              }}
              itemTextStyle={{
                fontSize: 20,
                marginRight: 20,
                lineHeight: 26,
                // paddingBottom: marginBottom2,
                textAlign: 'center',
                color: '#B4B4B4',
              }}

              // style={{height: 300, marginLeft: 20}}
            />
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
            let __jam = jam === '-' ? '24' : jam;
            let _jam = __jam.length === 1 ? `0${__jam}` : __jam;
            setForm({
              ...form,
              rentalHours: `${_jam}${menit === '-' ? '30' : menit}`,
            });
            sheetRef.current?.close();
          }}
        />
      </View>
    </BottomSheetModal>
  );
};

export default TimeWheel;

const styles = StyleSheet.create({});
