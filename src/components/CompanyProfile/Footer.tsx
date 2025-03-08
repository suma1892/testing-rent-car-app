import Button from 'components/Button';
import React from 'react';
import {Image} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  img_appstore,
  img_google_play,
  img_mobile,
  img_website,
} from 'assets/images';

const Footer = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 32,
          color: theme.colors.white,
          fontStyle: 'italic',
          fontWeight: '800',
        }}>
        {t('company_profile.how_to')}
      </Text>
      <Text
        style={{
          fontSize: 32,
          color: '#F1A33A',
          fontStyle: 'italic',
          fontWeight: '800',
        }}>
        {t('company_profile.rent_a_car')}
      </Text>

      <Button
        _theme="orange"
        title={t('company_profile.mobile_app')}
        onPress={() => {}}
        styleWrapper={styles.buttonWrapper}
        styleText={styles.buttonName}
      />
      <Image
        source={img_mobile}
        style={styles.imgMobile}
        resizeMode="contain"
      />

      <Button
        _theme="orange"
        title={t('company_profile.website')}
        onPress={() => {}}
        styleWrapper={styles.buttonWrapper}
        styleText={styles.buttonName}
      />
      <Image
        source={img_website}
        style={styles.imgWebsite}
        resizeMode="contain"
      />

      <View style={{marginTop: 48}}>
        <Text style={styles.howToRentCar}>
          {t('company_profile.how_to_rent_a_car')}
        </Text>
        <Text style={[styles.getRideAvailableOn, {marginTop: 11}]}>
          {t('company_profile.get_and_ride_is_already_on')}{' '}
          <Text style={styles.highlightedText}>
            {t('company_profile.mobile_apps')}
          </Text>
        </Text>
        <Text style={styles.getRideAvailableOn}>
          {t('company_profile.and')}{' '}
          <Text style={styles.highlightedText}>
            {t('company_profile.website')}
          </Text>
        </Text>

        <Text style={styles.availableOn}>
          {t('company_profile.available_on')}
        </Text>
        <View style={styles.storeContainer}>
          <Image
            source={img_appstore}
            style={[styles.storeImg, {marginRight: 13}]}
            resizeMode="contain"
          />
          <Image
            source={img_google_play}
            style={styles.storeImg}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: theme.colors.navy,
  },
  buttonWrapper: {
    marginTop: 40,
    width: '45%',
    borderRadius: 100,
  },
  buttonName: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '800',
  },
  imgMobile: {width: 135, height: 275, marginTop: 14, alignSelf: 'center'},
  imgWebsite: {width: 314, height: 183, marginTop: 14, alignSelf: 'center'},
  howToRentCar: {fontSize: 20, fontWeight: '700', color: theme.colors.white},
  getRideAvailableOn: {fontSize: 16, color: theme.colors.white},
  highlightedText: {fontStyle: 'italic', fontWeight: '700'},
  availableOn: {
    marginTop: 11,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  storeContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 18},
  storeImg: {width: 124, height: 37},
});
