import React, {memo, useState} from 'react';
import {h1, h5} from 'utils/styles';
import {iconCustomSize, iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  ic_arrow_down,
  ic_arrow_up,
  ic_blue_check,
  ic_uncheck,
} from 'assets/icons';

type CarOptionProps = {
  brand: {
    id: number;
    name: string;
  };
  value: number[];
  onChange: (val: number[]) => void;
};

const CarOption: React.FC<CarOptionProps> = ({brand, value, onChange}) => {
  const isSelected = value.includes(brand.id);

  const handlePress = () => {
    if (isSelected) {
      onChange(value.filter(val => val !== brand.id).sort());
    } else {
      onChange([...value, brand.id].sort());
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.carSelection}>
      <Text style={h5}>{brand.name}</Text>
      <Image
        source={isSelected ? ic_blue_check : ic_uncheck}
        style={iconSize}
      />
    </TouchableOpacity>
  );
};

type SelectBrandProps = {
  value: number[];
  onChange: (val: number[]) => void;
};

const SelectBrand: React.FC<SelectBrandProps> = ({value, onChange}) => {
  const {t} = useTranslation();
  const brands = useAppSelector(vehiclesState).brands;
  const [showCar, setShowCar] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.priceTitleContainer}>
        <Text style={h1}>{t('list_car.car_brand')}</Text>
        <TouchableOpacity onPress={() => setShowCar(prev => !prev)}>
          <Image
            source={showCar ? ic_arrow_down : ic_arrow_up}
            style={iconCustomSize(15)}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {showCar && (
        <View>
          {brands.map(brand => (
            <CarOption
              key={brand.id}
              brand={brand}
              value={value}
              onChange={onChange}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(SelectBrand);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  priceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  carSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
