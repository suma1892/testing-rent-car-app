import React from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h5} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ic_with_driver,
  ic_without_driver,
  ic_with_driver_navy_active,
  ic_radio_button_active,
  ic_radio_button_inactive,
} from 'assets/icons';

type Props = {
  onChange: ({withDriver}: {withDriver: boolean}) => void;
};

const FavoriteCarDriverSelection: React.FC<Props> = ({onChange}) => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;
  const [selected, setSelected] = useState(formDaily.with_driver ? 1 : 2);

  const buttonList = [
    {
      id: 1,
      img: ic_with_driver,
      imgActive: ic_with_driver_navy_active,
      name: t('Home.daily.with_driver'),
      withDriver: true,
      disabled: false,
    },
    {
      id: 2,
      img: ic_without_driver,
      imgActive: ic_without_driver,
      name: t('Home.daily.without_driver'),
      withDriver: false,
      disabled: false,
    },
  ];

  return (
    <View style={styles.container}>
      {buttonList.reverse().map((button, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.button,
            {
              ...(selected === 2
                ? styles.buttonBorderRight
                : styles.buttonBorderLeft),
            },
          ]}
          onPress={() => {
            setSelected(button.id);
            onChange({withDriver: button.withDriver});
          }}
          disabled={button.disabled}>
          <View style={rowCenter}>
            <Image
              source={
                selected === button.id
                  ? ic_radio_button_active
                  : ic_radio_button_inactive
              }
              style={iconCustomSize(15)}
            />
            <Image
              source={selected === button.id ? button.imgActive : button.img}
              style={[iconSize, {marginLeft: 5, tintColor: theme.colors.navy}]}
            />
            <Text
              style={[
                selected === button.id ? h1 : h1,
                {
                  marginLeft: 5,
                  color:
                    selected === button.id
                      ? theme.colors.navy
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

export default memo(FavoriteCarDriverSelection);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: theme.colors.white
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
