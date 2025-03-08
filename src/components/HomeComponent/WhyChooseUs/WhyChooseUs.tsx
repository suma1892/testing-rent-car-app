import {h1} from 'utils/styles';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {memo} from 'react';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {img_car_model} from 'assets/images';
import {
  ic_car1,
  ic_check,
  ic_clock1,
  ic_electrik,
  ic_mesin,
  ic_pendingin,
  ic_price1,
  ic_service1,
  ic_transmisi,
} from 'assets/icons';

const WhyChooseUs = () => {
  const {t} = useTranslation();

  return (
    <View style={{padding: 20}}>
      <Text style={styles.title}>{t('whyChooseUs.title1')}</Text>
      <Text style={styles.description}>{t('whyChooseUs.description1')}</Text>

      <View style={styles.carWrapper}>
        <Image source={img_car_model} style={styles.carModel} />

        <View style={styles.topLeftIc}>
          <Text style={[h1, {marginBottom: 10, textAlign: 'center'}]}>
            {t('whyChooseUs.badgeName1')}
          </Text>
          <Image source={ic_clock1} style={iconCustomSize(55)} />
        </View>

        <View style={styles.topRightIc}>
          <Text style={[h1, {marginBottom: 10, textAlign: 'center'}]}>
            {t('whyChooseUs.badgeName2')}
          </Text>
          <Image source={ic_car1} style={iconCustomSize(55)} />
        </View>

        <View style={styles.bottomLeftIc}>
          <Text style={[h1, {marginBottom: 10, textAlign: 'center'}]}>
            {t('whyChooseUs.badgeName3')}
          </Text>
          <Image source={ic_price1} style={iconCustomSize(55)} />
        </View>

        <View style={styles.bottomRightIc}>
          <Text style={[h1, {marginBottom: 10, textAlign: 'center'}]}>
            {t('whyChooseUs.badgeName4')}
          </Text>
          <Image source={ic_service1} style={iconCustomSize(55)} />
        </View>
      </View>

      <Text style={[styles.title, {marginTop: 30}]}>
        {t('whyChooseUs.title2')}
      </Text>
      <Text style={styles.description}>{t('whyChooseUs.description2')}</Text>

      <View
        style={[rowCenter, {justifyContent: 'space-between', marginTop: 20}]}>
        <View>
          <Image source={ic_mesin} style={iconCustomSize(55)} />
          <View style={rowCenter}>
            <Text style={[h1, {fontSize: 12, marginRight: 5}]}>
              {t('whyChooseUs.badgeName5')}
            </Text>
            <Image source={ic_check} style={iconCustomSize(14)} />
          </View>
        </View>

        <View>
          <Image source={ic_transmisi} style={iconCustomSize(55)} />
          <View style={rowCenter}>
            <Text style={[h1, {fontSize: 12, marginRight: 5}]}>
              {t('whyChooseUs.badgeName6')}
            </Text>
            <Image source={ic_check} style={iconCustomSize(14)} />
          </View>
        </View>

        <View>
          <Image source={ic_pendingin} style={iconCustomSize(55)} />
          <View style={rowCenter}>
            <Text style={[h1, {fontSize: 12, marginRight: 5}]}>
              {t('whyChooseUs.badgeName7')}
            </Text>
            <Image source={ic_check} style={iconCustomSize(14)} />
          </View>
        </View>

        <View>
          <Image source={ic_electrik} style={iconCustomSize(55)} />
          <View style={rowCenter}>
            <Text style={[h1, {fontSize: 12, marginRight: 5}]}>
              {t('whyChooseUs.badgeName8')}
            </Text>
            <Image source={ic_check} style={iconCustomSize(14)} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(WhyChooseUs);

const styles = StyleSheet.create({
  itemContainer: {
    height: 360,
    width: WINDOW_WIDTH - 60,
    // padding: '10%',
    alignSelf: 'center',
    marginTop: 80,
  },
  mainTitle: {
    fontSize: 21,
    color: theme.colors.navy,
    lineHeight: 31,
    position: 'absolute',
    top: 20,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 26,
  },
  description: {
    fontSize: 12,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  carWrapper: {
    height: 323,
    width: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  carModel: {
    width: 164,
    height: 322,
    resizeMode: 'contain',
  },
  topLeftIc: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
  },
  topRightIc: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomLeftIc: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
  bottomRightIc: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
  },
});
