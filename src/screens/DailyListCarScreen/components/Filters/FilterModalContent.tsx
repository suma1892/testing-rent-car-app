import Button from 'components/Button';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import React, {useEffect, useState} from 'react';
import SelectBrand from './SelectBrand';
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {h1, h5} from 'utils/styles';
import {
  ic_glasses,
  ic_radio_button_active,
  ic_radio_button_inactive,
} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {idrFormatter} from 'utils/functions';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {currencyFormat} from 'utils/currencyFormat';

type Value = {
  name: string;
  price: number;
  passanger: number;
  brands: number[];
  priceSort: 'asc' | 'desc';
};

type Props = {
  value: Value;
  onSubmit: (val: Value) => void;
};

const chairOptions = [
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
];

const FilterModalContent: React.FC<Props> = ({value, onSubmit}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const priceSortingList = [
    {label: t('list_car.lowest_price'), value: 'asc'},
    {label: t('list_car.highest_price'), value: 'desc'},
  ];

  const [state, setState] = useState({
    carName: '',
    rangeValue: 1,
    selectedChair: 4,
    selectedPriceSorting: 'asc' as 'asc' | 'desc',
    selectedBrandIds: [] as number[],
  });

  const {
    carName,
    rangeValue,
    selectedChair,
    selectedPriceSorting,
    selectedBrandIds,
  } = state;

  const resetValue = () => {
    setState({
      carName: '',
      rangeValue: 1,
      selectedChair: 4,
      selectedPriceSorting: 'asc',
      selectedBrandIds: [],
    });
  };

  useEffect(() => {
    setState({
      carName: value.name || '',
      rangeValue: value.price ? value.price / 3000000 : 1,
      selectedChair: value.passanger || 4,
      selectedPriceSorting: value.priceSort || 'asc',
      selectedBrandIds: value.brands.length > 0 ? value.brands : [],
    });
  }, [value]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={[h1, styles.titleText]}>{t('list_car.filter')}</Text>
          <TouchableOpacity onPress={resetValue}>
            <Text style={[h5, styles.resetText]}>{t('list_car.reset')}</Text>
          </TouchableOpacity>
        </View>
        <View style={[rowCenter, styles.searchWrapper]}>
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder={t('list_car.search_car') || ''}
            value={carName}
            onChangeText={text => setState({...state, carName: text})}
          />
          <Image source={ic_glasses} style={iconSize} />
        </View>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={[styles.container, styles.scrollViewContent]}>
        <Text style={[h1, styles.sectionTitle]}>{t('list_car.filter_by')}</Text>
        <Text style={h5}>{t('list_car.price_range_perday')}</Text>

        <CustomSlider
          sliderValue={rangeValue}
          renderCaption={
            <Text style={[h5, styles.greyText]}>
              {currencyFormat(0)} -{' '}
              {rangeValue
                ? `${currencyFormat(
                    3000000 * parseFloat(rangeValue.toFixed(2)),
                  )}`
                : 'IDR 0'}
            </Text>
          }
          renderFooter={
            <View style={styles.footerSlider}>
              <Text style={[h5, styles.greyText]}>{currencyFormat(0)}</Text>
              <Text style={[h5, styles.greyText]}>
                {currencyFormat(3000000)}
              </Text>
            </View>
          }
          onChange={(val: any) => setState({...state, rangeValue: val?.[0]})}>
          <Slider />
        </CustomSlider>

        <Text style={[h1, styles.sectionTitle]}>{t('list_car.sort_by')}</Text>
        <Text style={[h1, styles.sectionTitle]}>
          {t('list_car.seat_capacity')}
        </Text>

        {chairOptions.map(opt => (
          <TouchableOpacity
            key={opt.label}
            style={styles.option}
            onPress={() => setState({...state, selectedChair: opt.value})}>
            <Image
              source={
                selectedChair === opt.value
                  ? ic_radio_button_active
                  : ic_radio_button_inactive
              }
              style={iconSize}
            />
            <Text style={[h5, styles.optionText]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[h1, styles.sectionTitle]}>{t('list_car.price')}</Text>

        {priceSortingList.map(opt => (
          <TouchableOpacity
            key={opt.label}
            style={styles.option}
            onPress={() =>
              setState({
                ...state,
                selectedPriceSorting: opt.value as 'asc' | 'desc',
              })
            }>
            <Image
              source={
                selectedPriceSorting === opt.value
                  ? ic_radio_button_active
                  : ic_radio_button_inactive
              }
              style={iconSize}
            />
            <Text style={[h5, styles.optionText]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        <SelectBrand
          value={selectedBrandIds}
          onChange={ids => setState({...state, selectedBrandIds: ids})}
        />

        <Button
          _theme="navy"
          title={t('global.button.next')}
          onPress={() => {
            onSubmit({
              name: carName,
              price: 3000000 * parseFloat(rangeValue.toFixed(2)),
              passanger: selectedChair,
              brands: selectedBrandIds,
              priceSort: selectedPriceSorting,
            });
            dispatch(toggleBSheet(false));
          }}
          styleWrapper={styles.submitButton}
        />
      </BottomSheetScrollView>
    </>
  );
};

export default FilterModalContent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: 18,
  },
  resetText: {
    fontSize: 15,
  },
  searchWrapper: {
    width: '100%',
    backgroundColor: theme.colors.grey7,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  searchInput: {
    width: '95%',
    padding: 0,
    margin: 0,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  sectionTitle: {
    marginVertical: 15,
  },
  greyText: {
    color: theme.colors.grey5,
  },
  footerSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 20,
  },
});
