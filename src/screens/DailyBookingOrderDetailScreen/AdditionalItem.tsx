import Accordion from 'react-native-collapsible/Accordion';
import React, {useEffect, useMemo, useState} from 'react';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {getAddonById} from 'redux/effects';
import {iconCustomSize, WINDOW_WIDTH} from 'utils/mixins';
import {currencyFormat} from 'utils/currencyFormat';
import {differenceInCalendarDays, parse} from 'date-fns';

interface VarietyImage {
  id: number;
  file_name: string;
}

interface Variety {
  id: number;
  color: string;
  max_order: number;
  stock: number;
  available_stock: number;
  quantity: number;
  images: VarietyImage[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  created_at: string | null;
  warehouse_id: number;
  varieties: Variety[];
}

const AdditionalItem = ({transactionKey}: {transactionKey: string}) => {
  const {t} = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const arrowRotation = useSharedValue(0);
  const [data, setData] = useState<Product[]>([]);

  const bookingDetail = useAppSelector(state => state.myBooking);
  const {selected} = bookingDetail;

  const SECTIONS = [
    {
      title: t('myBooking.add_item.title'),
    },
  ];

  const getAddonDetail = async () => {
    try {
      const res = await getAddonById(transactionKey);
      setData(res);
    } catch (error) {}
  };

  useEffect(() => {
    getAddonDetail();
    return () => {};
  }, [transactionKey]);

  const _renderHeader = (section: any, i: any, isActive: any) => {
    return (
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerText}>
          {section.title}
        </Text>

        <Image
          source={isActive ? ic_arrow_up : ic_arrow_down}
          style={{
            height: 15,
            width: 15,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  const _renderContent = () => {
    return (
      <View style={styles.content}>
        {data?.map((x, i) => (
          <View
            key={i}
            style={[
              // rowCenter,
              {
                justifyContent: 'space-between',
                marginBottom: 14,
                flexDirection: 'row',
              },
            ]}>
            <Image
              source={{uri: x?.varieties?.[0]?.images?.[0]?.file_name}}
              style={[iconCustomSize(82), {borderRadius: 10, marginRight: 10}]}
            />

            <View>
              <View style={{height: 53, width: WINDOW_WIDTH / 3}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.add_item.goods')}
                </Text>
                <Text style={styles.highlightedText}>{x?.name || '-'}</Text>
              </View>
              <View style={{height: 53, width: WINDOW_WIDTH / 3}}>
                <Text style={[styles.unhighlightedText, {marginTop: 14}]}>
                  {t('myBooking.add_item.rent_amount')}
                </Text>
                <Text style={styles.highlightedText}>
                  {x?.varieties?.[0]?.quantity || '-'}
                </Text>
              </View>
            </View>

            <View>
              <View style={{height: 53, width: WINDOW_WIDTH / 3}}>
                <Text style={styles.unhighlightedText}>
                  {t('myBooking.add_item.total_price')}
                </Text>
                <Text style={styles.highlightedText}>
                  {currencyFormat(
                    x?.unit_price *
                      x?.varieties?.[0]?.quantity *
                      (selected?.order_detail?.without_driver
                        ? dayDifference
                        : selected?.order_detail?.booking_zones?.length),
                  ) || '-'}
                  {'\n'}
                  {`(${
                    selected?.order_detail?.without_driver
                      ? dayDifference
                      : selected?.order_detail?.booking_zones?.length
                  } ${t('Home.daily.day')})`}
                </Text>
              </View>

              <View style={{height: 53, width: WINDOW_WIDTH / 3}}>
                <Text style={[styles.unhighlightedText, {marginTop: 14}]}>
                  {t('myBooking.add_item.color_variant')}
                </Text>
                <Text style={[styles.highlightedText, {width: '70%'}]}>
                  {x?.varieties?.[0]?.color || '-'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const parsedStartDate = useMemo(
    () =>
      parse(
        selected?.order_detail?.start_booking_date!,
        'yyyy-MM-dd',
        new Date(),
      ),
    [selected?.order_detail?.start_booking_date],
  );
  const parsedEndDate = useMemo(
    () =>
      parse(
        selected?.order_detail?.end_booking_date!,
        'yyyy-MM-dd',
        new Date(),
      ),
    [selected?.order_detail?.start_booking_date],
  );

  const dayDifference = useMemo(
    () => differenceInCalendarDays(parsedEndDate, parsedStartDate),
    [parsedEndDate, parsedStartDate],
  );

  const _updateSections = (activeSections: any) => {
    arrowRotation.value = withTiming(arrowRotation.value === 0 ? 180 : 0);
    setActiveSections(activeSections);
  };

  if (data?.length <= 0) return;

  return (
    <View style={styles.container}>
      <Accordion
        underlayColor={'#FFF'}
        sections={SECTIONS}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        expandMultiple={true}
      />
    </View>
  );
};

export default AdditionalItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: theme.colors.grey6,
    elevation: 4,
    paddingHorizontal: '5%',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    marginTop: 16,
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 18,
  },
  headerText: {
    fontSize: 14,
    color: '#000',
    width: '80%',
    fontWeight: '700',
    fontFamily: 'Inter-Medium',
  },
  content: {
    backgroundColor: '#fff',
  },
  highlightedText: {
    color: theme.colors.black,
    fontSize: 12,
    fontWeight: '700',
  },
  unhighlightedText: {
    color: theme.colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
