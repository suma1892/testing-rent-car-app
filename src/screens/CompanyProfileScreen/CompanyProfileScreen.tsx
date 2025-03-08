import Footer from 'components/CompanyProfile/Footer';
import hoc from 'components/hoc';
import React from 'react';
import SwitchLanguage from 'components/HomeComponent/SwitchLanguage/SwitchLanguage';
import TypeOfCars from 'components/CompanyProfile/TypeOfCars';
import {h1} from 'utils/styles';
import {Image} from 'react-native';
import {img_car1, img_car2, img_hero_compro} from 'assets/images';
import {rowCenter, WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_about_company,
  ic_car_interior,
  ic_clock2,
  ic_deco1,
  ic_driver1,
  ic_get_ride2,
  ic_our_services,
  ic_plane,
  ic_self_drive,
  ic_service,
  ic_typecars,
  ic_user,
  ic_vm,
  ic_vm2,
} from 'assets/icons';

const CompanyProfileScreen = () => {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SwitchLanguage />

      <ScrollView>
        <Image
          source={img_hero_compro}
          style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT / 2}}
        />
        <View style={styles.comproBtnWrapper}>
          <Text style={styles.textBtn}>
            {t('company_profile.company_profile')}
          </Text>
        </View>

        <View
          style={{
            height: WINDOW_HEIGHT / 2.5,
            backgroundColor: '#11334D',
          }}>
          <View style={styles.profileWrapper}>
            <Image source={img_car1} style={styles.carProfile} />
          </View>
        </View>

        <View style={{backgroundColor: '#fff'}}>
          <View
            style={[
              rowCenter,
              {justifyContent: 'space-around', marginVertical: 10},
            ]}>
            {/* <Image
              source={ic_about_company}
              style={{height: 78, width: 152}}
              resizeMode="contain"
            /> */}
            <View style={{width: '45%'}}>
              <Text style={[h1, styles.vission]}>
                {t('company_profile.about_company')}
              </Text>
            </View>
            <Image
              source={ic_get_ride2}
              style={{height: 47, width: 115}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.profileWrapper2}>
            <Image source={img_car1} style={styles.carProfile2} />
          </View>

          <View style={styles.descWrapper}>
            <Text style={styles.descCompany}>
              {t('company_profile.about_company_description')}
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Image
              source={ic_car_interior}
              style={{height: 500, width: WINDOW_WIDTH}}
            />

            <Image
              source={ic_deco1}
              style={{
                height: 500,
                width: 100,
                position: 'absolute',
                right: 0,
              }}
            />
          </View>
        </View>

        <View style={{margin: 20}}>
          <Text style={[h1, styles.vission]}>
            {`${t('company_profile.vision')} ${t('company_profile.and')}`}{' '}
            <Text style={{color: theme.colors.orange}}>
              {t('company_profile.mission')}
            </Text>
          </Text>

          <Text style={[h1, {fontSize: 20, marginTop: 20}]}>
            {t('company_profile.vision')}
          </Text>
          <Text style={[styles.descCompany, {color: '#000', marginTop: 10}]}>
            {t('company_profile.vision_description')}
          </Text>

          <Text style={[h1, {fontSize: 20, marginTop: 20}]}>
            {t('company_profile.mission')}
          </Text>

          <View style={[rowCenter, {width: WINDOW_WIDTH - 50}]}>
            <View style={styles.numberWrapper}>
              <Text style={{color: '#fff'}}>1.</Text>
            </View>
            <Text
              style={[
                styles.descCompany,
                {color: '#000', marginTop: 10, marginLeft: 10},
              ]}>
              {t('company_profile.mission_description.first')}
            </Text>
          </View>

          <View style={[rowCenter, {width: WINDOW_WIDTH - 50}]}>
            <View style={styles.numberWrapper}>
              <Text style={{color: '#fff'}}>2.</Text>
            </View>
            <Text
              style={[
                styles.descCompany,
                {color: '#000', marginTop: 10, marginLeft: 10},
              ]}>
              {t('company_profile.mission_description.second')}
            </Text>
          </View>

          <View style={[rowCenter, {width: WINDOW_WIDTH - 50}]}>
            <View style={styles.numberWrapper}>
              <Text style={{color: '#fff'}}>3.</Text>
            </View>
            <Text
              style={[
                styles.descCompany,
                {color: '#000', marginTop: 10, marginLeft: 10},
              ]}>
              {t('company_profile.mission_description.third')}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.navy,
          }}>
          <Text style={[h1, styles.vission, {color: theme.colors.white}]}>
            {`${t('company_profile.vision')} ${t('company_profile.and')}`}{' '}
            <Text style={{color: theme.colors.orange}}>
              {t('company_profile.mission')}
            </Text>
          </Text>

          <View style={styles.icWrapper}>
            <Image
              source={ic_clock2}
              style={styles.icVm}
              resizeMode="contain"
            />
          </View>

          <View style={{padding: 20}}>
            <Text
              style={{
                fontSize: 20,
                color: '#fff',
                textAlign: 'center',
              }}>
              {t('company_profile.easy_access')}
            </Text>

            <Text
              style={[
                {
                  color: '#fff',
                  marginTop: 10,
                  textAlign: 'center',
                  lineHeight: 24,
                },
              ]}>
              {t('company_profile.easy_access_description')}
            </Text>
          </View>

          <View style={styles.icWrapper}>
            <Image source={ic_user} style={styles.icVm} resizeMode="contain" />
          </View>

          <View style={{padding: 20}}>
            <Text
              style={{
                fontSize: 20,
                color: '#fff',
                textAlign: 'center',
              }}>
              {t('company_profile.high_quality')}
            </Text>

            <Text
              style={[
                {
                  color: '#fff',
                  marginTop: 10,
                  textAlign: 'center',
                  lineHeight: 24,
                },
              ]}>
              {t('company_profile.high_quality_description')}
            </Text>
          </View>

          <View style={styles.icWrapper}>
            <Image
              source={ic_service}
              style={styles.icVm}
              resizeMode="contain"
            />
          </View>

          <View style={{padding: 20}}>
            <Text style={styles.title}>
              {t('company_profile.best_service')}
            </Text>

            <Text style={[styles.desc]}>
              {t('company_profile.best_service_description')}
            </Text>
          </View>
        </View>
        <View>
          {/* <Image
            source={ic_our_services}
            style={{
              width: 200,
              height: 40,
              alignSelf: 'center',
              marginVertical: 20,
            }}
            resizeMode="contain"
          /> */}
          <Text style={[h1, styles.vission]}>
            {t('company_profile.our_services')}
          </Text>
          <Text style={[h1, styles.vission]}>
            {`${t('company_profile.vision')} ${t('company_profile.and')}`}{' '}
            <Text style={{color: theme.colors.orange}}>
              {t('company_profile.mission')}
            </Text>
          </Text>
          <Image
            source={img_car2}
            style={{
              width: WINDOW_WIDTH,
              height: WINDOW_HEIGHT / 1.5,
              alignSelf: 'center',
            }}
          />
          <View style={{padding: 30, backgroundColor: theme.colors.navy}}>
            <Image
              source={ic_driver1}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />

            <Text
              style={[styles.title, {alignSelf: 'baseline', marginTop: 20}]}>
              {t('company_profile.car_rental_with_driver')}
            </Text>
            <Text style={[styles.desc, {textAlign: 'left'}]}>
              {t('company_profile.car_rental_with_driver_description')}
            </Text>
          </View>

          <View
            style={{
              padding: 30,
              backgroundColor: theme.colors.navy,
              marginTop: 20,
            }}>
            <Image
              source={ic_self_drive}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />

            <Text
              style={[styles.title, {alignSelf: 'baseline', marginTop: 20}]}>
              {t('company_profile.self_drive')}
            </Text>
            <Text style={[styles.desc, {textAlign: 'left'}]}>
              {t('company_profile.self_drive_description')}
            </Text>
          </View>

          <View
            style={{
              padding: 30,
              backgroundColor: theme.colors.navy,
              marginTop: 20,
            }}>
            <Image
              source={ic_plane}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />

            <Text
              style={[styles.title, {alignSelf: 'baseline', marginTop: 20}]}>
              {t('company_profile.car_rental_airport_transfer')}
            </Text>
            <Text style={[styles.desc, {textAlign: 'left'}]}>
              {t('company_profile.car_rental_airport_transfer_description')}
            </Text>
          </View>
        </View>

        <TypeOfCars />
        <Footer />
      </ScrollView>
    </View>
  );
};

export default hoc(
  CompanyProfileScreen,
  theme.colors.white,
  false,
  'dark-content',
);

const styles = StyleSheet.create({
  comproBtnWrapper: {
    padding: 10,
    backgroundColor: '#F1A33A',
    width: '50%',
    alignItems: 'center',
    position: 'absolute',
    top: WINDOW_HEIGHT / 4 - 100,
    zIndex: 99,
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#fff',
    fontWeight: 'bold',
  },
  carProfile: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginLeft: 5,
  },
  profileWrapper: {
    backgroundColor: '#1C3D5D',
    alignSelf: 'center',
    width: 270,
    height: 270,
    borderRadius: WINDOW_WIDTH / 2,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carProfile2: {
    width: 280,
    height: 280,
    resizeMode: 'cover',
    marginLeft: 9,
  },
  profileWrapper2: {
    backgroundColor: '#1C3D5D',
    alignSelf: 'center',
    width: 290,
    height: 290,
    borderRadius: WINDOW_WIDTH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descCompany: {
    marginTop: 150,
    fontSize: 14,
    color: '#fff',
    lineHeight: 24,
  },
  descWrapper: {
    backgroundColor: '#1C3D5D',
    marginTop: -150,
    zIndex: -99,
    padding: 20,
    paddingBottom: 100,
  },
  numberWrapper: {
    height: 27,
    width: 27,
    borderRadius: WINDOW_WIDTH / 4,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icWrapper: {
    height: 120,
    width: WINDOW_WIDTH - 100,
    backgroundColor: '#F1A33A',
    borderBottomRightRadius: 100,
    borderTopRightRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  icVm: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  desc: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  vission: {
    fontSize: 35,
    marginTop: 20,
    alignSelf: 'center',
    fontStyle: 'italic',
    color: theme.colors.navy,
  },
});
