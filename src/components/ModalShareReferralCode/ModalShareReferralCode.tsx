import Clipboard from '@react-native-clipboard/clipboard';
import Config from 'react-native-config';
import React, {useEffect, useRef, useState} from 'react';
import Share, {ShareSingleOptions} from 'react-native-share';
import {iconCustomSize, rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {img_share} from 'assets/images';
import {showToast} from 'utils/Toast';
import {useTranslation} from 'react-i18next';
import {
  ic_arrow_left_3,
  ic_arrow_right_3,
  ic_close,
  ic_copas,
  ic_instagram_share2,
  ic_messenger,
  ic_share,
  ic_telegram_share,
  ic_whatsapp_share,
  ic_x_share,
} from 'assets/icons';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import Button from 'components/Button';
import i18n from 'assets/lang/i18n';
import {theme} from 'utils';
import {h2, h3, h4} from 'utils/styles';

type ModalShareReferralCodeProps = {
  referral: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const ShareOptions = [
  {
    icon: ic_messenger,
    url: 'https://facebook.com',
    social: Share.Social.MESSENGER,
  },
  {icon: ic_x_share, url: 'https://twitter.com', social: Share.Social.TWITTER},
  {
    icon: ic_whatsapp_share,
    url: 'https://whatsapp.com',
    social: Share.Social.WHATSAPP,
  },
  {
    icon: ic_instagram_share2,
    url: 'https://instagram.com',
    social: Share.Social.INSTAGRAM,
  },
  {
    icon: ic_telegram_share,
    url: 'https://web.telegram.org',
    social: Share.Social.TELEGRAM,
  },
];

const ModalShareReferralCode: React.FC<ModalShareReferralCodeProps> = ({
  referral,
  modalVisible,
  setModalVisible,
}) => {
  const {t} = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const url = `${Config.APP_URL}/referral/${referral || ''}`;
    if (i18n.language.includes('id')) {
      setMessage(
        `Mau dapat poin ekstra? Pesan mobil di Get&Ride sekarang juga lewat link referral ini ${url}. Kamu akan dapat bonus poin sebesar 0,5% dari transaksi pertama kamu! Download Aplikasi Get&Ride Sekarang! Tersedia di App Store & Play Store`,
      );
    } else if (i18n.language.includes('cn')) {
      setMessage(
        `想获得额外积分吗？现在通过这个推荐链接 ${url} 在 Get&Ride 预订汽车。您将获得首笔交易 0.5% 的额外积分！立即下载 Get&Ride 应用程序！可在 App Store 和 Play Store 上获取`,
      );
    } else {
      setMessage(
        `Want to get extra points? Book a car at Get&Ride now via this referral link ${url}. You will get a bonus point of 0.5% from your first transaction! Download the Get&Ride App Now! Available on the App Store & Play Store`,
      );
    }

    return () => {};
  }, [t, referral]);

  const handleShare = async () => {
    try {
      const title = 'Get&Ride Referral';
      // const message = await t('referral_code.referral_message', {
      //   url: encodedReferralLink,
      // });
      const options = Platform.select({
        ios: {
          activityItemSources: [
            {
              // For sharing text.
              placeholderItem: {type: 'text', content: message},
              item: {
                default: {type: 'text', content: message},
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: {
                // For showing app icon on share preview.
                title: message,
              },
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message}`,
        },
      });
      // await Share.shareSingle({
      //   title: '',
      //   social,
      //   url: `${Config.APP_URL}/referral/${referral}`,
      //   type: 'text/*',
      //   message: '',
      // } as ShareSingleOptions);
      Share.open(options as any);
    } catch (e) {
      console.log('catch: ', e);
    }
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={img_share} style={styles.shareImage} />
          <TouchableOpacity
            style={styles.icClose}
            onPress={() => setModalVisible(!modalVisible)}>
            <Image source={ic_close} style={styles.icCloseImage} />
          </TouchableOpacity>
          <Text style={styles.textTitle}>{t('Account.invite_friend')}</Text>
          <View style={{width: '80%', marginBottom: 12}}>
            <Text style={styles.textDesc}>
              {t('Account.invite_friend_desc')}
            </Text>
          </View>
          <View style={styles.codeWrapper}>
            <View style={styles.textCodeWrapper}>
              <Text style={styles.referralCode}>{referral}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(`${message}`);
                showToast({
                  title: t('global.alert.success'),
                  message: t('global.alert.copy_referral_code'),
                  type: 'success',
                });
              }}
              style={styles.copasWrapper}>
              <Image source={ic_copas} style={styles.copasIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.shareContainer}>
            <Text style={styles.shareText}>{t('Account.share')}</Text>
            <TouchableOpacity
              style={[rowCenter, styles.btnShare]}
              onPress={handleShare}>
              <Image source={ic_share} style={[iconCustomSize(24)]} />
              <Text style={[h2, {color: theme.colors.white, marginLeft: 4}]}>
                {t('referral_code.share')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 8, 8, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    overflow: 'hidden',
  },
  shareImage: {
    width: 139,
    height: 131,
    marginTop: 20,
  },
  icClose: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  icCloseImage: {
    width: 15,
    height: 15,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 20,
  },
  textDesc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  codeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    marginTop: 10,
    width: WINDOW_WIDTH / 1.8,
  },
  textCodeWrapper: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
  },
  referralCode: {
    fontSize: 14,
    fontWeight: '700',
  },
  copasWrapper: {
    flex: 1,
    backgroundColor: '#F1A33A',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  copasIcon: {
    width: 19,
    height: 19,
    tintColor: '#fff',
  },
  shareContainer: {
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  shareText: {
    fontSize: 10,
    fontWeight: '400',
    marginTop: 20,
  },
  shareActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  arrowButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 100,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  scrollViewContainer: {
    width: '70%',
  },
  shareWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  shareOption: {
    marginRight: 10,
  },
  shareIcon: {
    width: 50,
    height: 50,
  },
  btnShare: {
    backgroundColor: theme.colors.orange,
    width: '70%',
    paddingVertical: 10,
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 5,
  },
});

export default ModalShareReferralCode;
