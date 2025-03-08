import appBar from 'components/AppBar/AppBar';
import hoc from 'components/hoc';
import React, {useEffect, useState} from 'react';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {voucherState} from 'redux/features/voucher/voucherSlice';
import {colors} from 'theme/colors';
import UnclaimedMenu from 'components/Voucher/UnclaimedMenu';
import ClaimedMenu from 'components/Voucher/ClaimedMenu';

const VoucherSCreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [selectedMenu, setSelectedMenu] = useState(0);

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
              {t('voucher.title')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  const TopNav = [
    {
      text: t('voucher.btn_unclaimed'),
    },
    {
      text: t('voucher.btn_claimed'),
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          rowCenter,

          {
            margin: 20,
            alignItems: 'center',
            backgroundColor: '#fff',
          },
        ]}>
        {TopNav.map((x, i) => (
          <TouchableOpacity
            key={i}
            style={[
              selectedMenu === i ? styles.activeMenu : styles.inactiveMenu,
              {
                borderTopRightRadius: i === 1 ? 10 : 0,
                borderBottomRightRadius: i === 1 ? 10 : 0,
                borderTopLeftRadius: i === 0 ? 10 : 0,
                borderBottomLeftRadius: i === 0 ? 10 : 0,
              },
            ]}
            onPress={() => setSelectedMenu(i)}>
            <Text
              style={
                selectedMenu === i ? styles.textActive : styles.textInactive
              }>
              {x?.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMenu === 0 && <UnclaimedMenu />}
      {selectedMenu === 1 && <ClaimedMenu />}
    </View>
  );
};

export default hoc(VoucherSCreen, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: '5%',
    paddingTop: 10,
    gap: 20,
  },
  cardFooter: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingBottom: 30,
  },
  cardImage: {
    width: '100%',
    height: 105,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  btnUse: {
    backgroundColor: colors.primary,
    width: '25%',
    alignItems: 'center',
    padding: 5,
    borderRadius: 7,
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  activeMenu: {
    width: '50%',
    backgroundColor: theme.colors.navy,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  inactiveMenu: {
    width: '50%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.navy,
    padding: 10,
    alignItems: 'center',
  },
  textActive: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textInactive: {
    color: theme.colors.navy,
    fontSize: 12,
    fontWeight: '400',
  },
});
