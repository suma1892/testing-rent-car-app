/* eslint-disable react-hooks/exhaustive-deps */
import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import Config from 'react-native-config';
import hoc from 'components/hoc';
import ImagePickerModal from 'components/MyProfileComponent/ImagePickerModal/ImagePickerModal';
import PasswordConfirmationModalContent from 'components/MyProfileComponent/PasswordConfirmationModalContent/PasswordConfirmationModalContent';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  appDataState,
  resetFormDaily,
} from 'redux/features/appData/appDataSlice';
import {editUser, uploadFile} from 'redux/features/user/userAPI';
import {getRefferalPoint, getUser} from 'redux/features/appData/appDataAPI';
import {colors, h1, h2, h4, h5} from 'utils/styles';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImagePickerResponse} from 'react-native-image-picker';
import {logout} from 'redux/features/auth/authSlice';
import {resetUser, userState} from 'redux/features/user/userSlice';
import {rowCenter} from 'utils/mixins';
import {showBSheet} from 'utils/BSheet';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {toggleBSheet, toggleLoader} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  ic_arrow_left_white,
  ic_bronze,
  ic_card,
  ic_copas,
  ic_empty_profile,
  ic_getride1,
  ic_gold,
  ic_loyalty,
  ic_notif,
  ic_notification_bell,
  ic_password_lock,
  ic_pen,
  ic_platinum,
  ic_point,
  ic_profile_active,
  ic_referral_code,
  ic_share,
} from 'assets/icons';
import {
  notificationState,
  resetNotification,
} from 'redux/features/notifications/notificationSlice';
import {
  accountBankState,
  resetAccountBank,
} from 'redux/features/accountBank/accountBankSlice';
import {bg_bronze, bg_gold, bg_platinum} from 'assets/images';
import {getLoyalty} from 'redux/effects';
import {UserLevel} from 'components/Loyalty/Carousel/left-align';
import ModalShareReferralCode from 'components/ModalShareReferralCode/ModalShareReferralCode';
import i18n from 'assets/lang/i18n';
import DeviceInfo from 'react-native-device-info';

const AccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const user = useAppSelector(userState);
  const accountBankUpdateSuccess =
    useAppSelector(accountBankState).isUpdateSuccess;
  const userProfile = useAppSelector(appDataState).userProfile;
  const refferalPoint = useAppSelector(appDataState).refferal_point;
  const notificationUpdateStatus =
    useAppSelector(notificationState).isUpdateSuccess;

  const {t} = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const methods = {
    handleLogout: async () => {
      // dispatch(toggleLoader(true));
      setLoadingLogout(true);
      // setTimeout(() => {
      await dispatch(logout());
      // dispatch(toggleLoader(false));
      dispatch(
        resetFormDaily({
          with_driver: false,
        }),
      );
      navigation.navigate('MainTab', {screen: 'Home'} as any);
      setLoadingLogout(false);
      // }, 1000);
    },
    openCamera: (val: ImagePickerResponse['assets']) => {
      dispatch(uploadFile({file: val?.[0], name: 'photo_profile'}));
      methods.showPasswordConfirmationModal();
    },
    openImageLibrary: async (val: ImagePickerResponse['assets']) => {
      dispatch(uploadFile({file: val?.[0], name: 'photo_profile'}));
      methods.showPasswordConfirmationModal();
    },
    handleSubmit: (password: string) => {
      setLoading(true);

      if (!password) {
        setLoading(false);
        return;
      }

      const formData = {
        name: userProfile.name,
        phone_code: userProfile.phone_code.slice(1),
        phone: userProfile.phone.slice(1),
        email: userProfile.email,
        wa_number: userProfile.wa_number,
        photo_ktp: userProfile.personal_info.ktp,
        photo_license: userProfile.personal_info.sim,
        photo_profile: user.data.photo_profile,
        password,
      };

      dispatch(editUser(formData)).then(() => {
        dispatch(toggleBSheet(false));
        showToast({
          title: t('global.alert.success'),
          type: 'success',
          message: t('global.alert.success_change_profile_picture'),
        });
        dispatch(getUser());
      });
      setLoading(false);
    },
    showImagePickerOptionsModal: () => {
      showBSheet({
        snapPoint: ['30%', '30%'],
        content: (
          <ImagePickerModal
            onCameraChange={methods.openCamera}
            onImageLibraryChange={methods.openImageLibrary}
          />
        ),
      });
    },
    showPasswordConfirmationModal: () => {
      showBSheet({
        snapPoint: ['35%', '35%'],
        content: (
          <PasswordConfirmationModalContent
            loading={loading}
            onSubmit={val => methods.handleSubmit(val)}
          />
        ),
      });
    },
  };

  const ProfileImage = useMemo(
    () => (
      <Image
        source={
          userProfile.photo_profile
            ? {
                uri: Config.URL_IMAGE + userProfile.photo_profile,
              }
            : ic_empty_profile
        }
        style={styles.image}
        resizeMode="cover"
      />
    ),
    [userProfile.photo_profile],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser());
      dispatch(getRefferalPoint());
    }, []),
  );

  useEffect(() => {
    if (user.isChangePasswordSuccess || user.isUpdateSuccess) {
      dispatch(resetUser());
    }

    if (notificationUpdateStatus) {
      dispatch(resetNotification());
    }

    if (accountBankUpdateSuccess) {
      dispatch(resetAccountBank());
    }
  }, [user, notificationUpdateStatus, accountBankUpdateSuccess]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('Account.header')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  const [loyaltyData, setLoyaltyData] = React.useState<UserLevel>();
  React.useEffect(() => {
    const func = async () => {
      try {
        const res = await getLoyalty();
        setLoyaltyData(res);
      } catch (error) {
        showToast({
          message: 'alert.warning',
          title: 'alert.warning',
          type: 'warning',
        });
      }
    };

    func();
    return () => {};
  }, []);

  const getIcon = () => {
    if (loyaltyData?.current_level === 'Platinum') {
      return ic_platinum;
    }
    if (loyaltyData?.current_level === 'Gold') {
      return ic_gold;
    }
    if (loyaltyData?.current_level === 'Bronze') {
      return ic_bronze;
    }
    return ic_bronze;
  };

  const getBg = () => {
    if (loyaltyData?.current_level === 'Platinum') {
      return bg_platinum;
    }
    if (loyaltyData?.current_level === 'Gold') {
      return bg_gold;
    }
    if (loyaltyData?.current_level === 'Bronze') {
      return bg_bronze;
    }
    return bg_bronze;
  };

  const getBadge = () => {
    if (i18n.language !== 'cn') {
      return loyaltyData?.current_level;
    }
    if (loyaltyData?.current_level === 'Gold') {
      return '金牌';
    }
    if (loyaltyData?.current_level === 'Platinum') {
      return '白金';
    }
    if (loyaltyData?.current_level === 'Bronze') {
      return '青铜';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{marginBottom: 30}}>
        <ImageBackground
          source={getBg()}
          style={[rowCenter, {justifyContent: 'space-between', padding: '5%'}]}>
          <View style={[rowCenter]}>
            <View style={styles.imageContainer}>{ProfileImage}</View>
            <View style={{marginLeft: 10}}>
              <Text style={[h2]}>{userProfile?.name}</Text>
              <View style={[rowCenter]}>
                <Image
                  source={getIcon()}
                  resizeMode="cover"
                  style={{width: 30, height: 30, borderRadius: 10}}
                />
                <Text style={{fontSize: 12}}>
                  {t('Account.badge')}{' '}
                  <Text style={{fontWeight: '700'}}>{getBadge()}</Text>
                </Text>
              </View>
              {/* <Text style={[h4]}>{userProfile?.phone}</Text> */}
            </View>
          </View>
          {/* <TouchableOpacity onPress={methods.showImagePickerOptionsModal}>
            <Image source={ic_pen} style={styles.camera} />
          </TouchableOpacity> */}
        </ImageBackground>

        <View style={{paddingHorizontal: '10%'}}>
          <TouchableOpacity
            style={styles.pointWrapper}
            onPress={() => {
              navigation.navigate('HistoryPoint');
            }}>
            <Text style={[h1, {fontSize: 16}]}>{t('Account.my_point')}</Text>
            <View style={[rowCenter, {marginTop: 7}]}>
              <Image source={ic_point} style={{width: 15, height: 15}} />
              <Text style={[h1, styles.textPoint]}>{refferalPoint?.point}</Text>
            </View>
            <View style={[rowCenter, {marginTop: 15}]}>
              <Text style={[h5, {color: colors.gray400}]}>
                {t('Account.referral_code')} :
              </Text>
              {userProfile?.refferal && (
                <TouchableOpacity
                  style={[rowCenter]}
                  onPress={() => {
                    // Clipboard.setString(
                    //   `${Config.APP_URL}/referral/${userProfile?.refferal}`,
                    // );
                    // showToast({
                    //   title: t('global.alert.success'),
                    //   message: t('global.alert.copy_referral_code'),
                    //   type: 'success',
                    // });
                    setModalVisible(true);
                  }}>
                  <Text style={[h1]}> {userProfile?.refferal}</Text>
                  <Image
                    source={ic_share}
                    style={{width: 20, height: 20, marginLeft: 5}}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={ic_profile_active} style={styles.icon} />
              <Text style={[h5]}>{t('settings.profile')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Image source={ic_password_lock} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_2')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Notification')}>
              <Image source={ic_notification_bell} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_3')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Loyalty')}>
              <Image source={ic_loyalty} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_6')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            {/* <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('RefferalCode')}>
              <Image source={ic_referral_code} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_7')}</Text>
            </TouchableOpacity>
            <View style={styles.line} /> */}

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('UserInformation')}>
              <Image source={ic_card} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_5')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('HelpCenter')}>
              <Image source={ic_notif} style={styles.icon} />
              <Text style={[h5]}>{t('Account.menu_4')}</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CompanyProfile')}>
              <Image source={ic_getride1} style={styles.icon} />
              <Text style={[h5]}>{t('settings.aboutUs')}</Text>
            </TouchableOpacity>
          </View>
          {Config.ENV !== 'production' && (
            <Text style={[h4, {textAlign: 'center', marginVertical: 20}]}>
            test{DeviceInfo.getVersion()}-{Config.ENV}
            </Text>
          )}
          <Button
            _theme="navy"
            onPress={methods.handleLogout}
            title={t('Account.logout').toUpperCase()}
            styleWrapper={{marginTop: 20}}
          />
          {/* <Text
            style={[
              h4,
              {
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 20,
              },
            ]}>
            Versi 1.22
          </Text> */}
          {/* <TouchableOpacity
            onPress={() => {
              try {
                crashlytics().crash();
              } catch (error) {
                console.log('test carsh');
              }
            }}>
            <Text style={{alignSelf: 'center', marginTop: 20}}>test crash</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* <Button
        _theme="navy"
        title="cek"
        onPress={() => {
          navigation.navigate('MainTab');
          navigation.navigate('ReferralCodeDeeplink', {
            referralCode: 'FER532123',
          });
        }}
      /> */}
      <ModalShareReferralCode
        referral={userProfile?.refferal}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </ScrollView>
  );
};

export default hoc(AccountScreen, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    // padding: '5%',
    justifyContent: 'space-between',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    // marginTop: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    width: 37,
    height: 37,
    backgroundColor: '#344F67',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -10,
  },
  camera: {
    width: 15,
    height: 15,
  },
  buttonContainer: {
    marginTop: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 23,
    marginRight: 15,
  },
  line: {
    marginVertical: 20,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
  },
  passwordModalContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  pointWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: colors.gray500,
    padding: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: 'white',
    marginTop: 20,
  },
  textPoint: {color: '#E9B522', marginLeft: 7, fontSize: 12},
});
