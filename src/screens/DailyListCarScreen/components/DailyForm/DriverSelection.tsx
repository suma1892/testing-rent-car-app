import React from 'react';
import {h1} from 'utils/styles';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_with_driver,
  ic_without_driver_active,
  ic_without_driver,
  ic_with_driver_active,
} from 'assets/icons';
import {Facility} from 'types/rental-location.types';
import {useMemo} from 'react';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  rentalLocationState,
  setRentalLocationParams,
} from 'redux/features/rentalLocation/rentalLocationSlice';

type DriverSelectionProps = {
  onSelect: (val: boolean) => void;
  selected: number;
  facilities?: Facility[];
};

const DriverSelection: React.FC<DriverSelectionProps> = ({
  onSelect,
  selected,
  facilities,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {services} = useAppSelector(rentalLocationState);

  const buttonList = [
    {
      id: 1,
      img: ic_without_driver,
      imgActive: ic_without_driver_active,
      name: t('Home.daily.without_driver'),
      withDriver: false,
      disabled: false,
      key: 'Without Driver',
    },
    {
      id: 2,
      img: ic_with_driver,
      imgActive: ic_with_driver_active,
      name: t('Home.daily.with_driver'),
      withDriver: true,
      disabled: false,
      key: 'With Driver',
    },
  ];

  const finalSection = useMemo(() => {
    if (facilities?.length) {
      const newFacilities = facilities?.map(facility => {
        const selectedSection = buttonList.find(
          button => button.key === facility?.name,
        );

        return {
          ...facility,
          ...selectedSection,
          facility_id: facility?.id,
        };
      });

      return newFacilities.sort((a, b) => a.id - b.id);
    }

    return buttonList;
  }, [facilities?.length, t]);

  return (
    <View style={styles.container}>
      {finalSection.map((button: any, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.button,
            {
              backgroundColor:
                selected === button.id ? theme.colors.navy : theme.colors.white,
              ...(selected === 2
                ? styles.buttonBorderRight
                : styles.buttonBorderLeft),
            },
          ]}
          onPress={() => {
            onSelect(button.withDriver!);

            const facilities = services
              ?.find(x => x?.name === 'Sewa Mobil')
              ?.sub_services?.find(x => x?.name === 'Daily')
              ?.facilities?.find(x => x?.name === button?.key);

            dispatch(setRentalLocationParams({facility_id: facilities?.id}));
          }}
          disabled={button.disabled}>
          <View style={rowCenter}>
            <Image
              source={selected === button.id ? button.imgActive : button.img}
              style={[
                iconSize,
                selected === button.id ? {} : {tintColor: theme.colors.navy},
              ]}
            />
            <Text
              style={[
                h1,
                {
                  marginLeft: 10,
                  color:
                    selected === button.id
                      ? theme.colors.white
                      : theme.colors.navy,
                },
              ]}>
              {button.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DriverSelection;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    flexBasis: '50%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonBorderLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  buttonBorderRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
