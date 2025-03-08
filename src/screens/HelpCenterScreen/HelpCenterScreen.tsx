import appBar from 'components/AppBar/AppBar';
import ContactUs from 'components/HomeComponent/ContactUs/ContactUs';
import FAQ from 'components/HomeComponent/FAQ/FAQ';
import hoc from 'components/hoc';
import PrivacyPolicy from 'components/HomeComponent/PrivacyPolicy/PrivacyPolicy';
import React, {FC, useEffect, useState} from 'react';
import TermsConditions from 'components/HomeComponent/TermsConditions/TermsConditions';
import {h1} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ITAB = 'faq' | 'privacy-policy' | 's&k' | 'call-center';
const HelpCenterScreen: FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState<ITAB>('faq');

  const DATA_TAB: any = [
    {
      id: t('tab_help_center.0.id'),
      title: t('tab_help_center.0.title'),
    },
    {
      id: t('tab_help_center.1.id'),
      title: t('tab_help_center.1.title'),
    },
    {
      id: t('tab_help_center.2.id'),
      title: t('tab_help_center.2.title'),
    },
    {
      id: t('tab_help_center.3.id'),
      title: t('tab_help_center.3.title'),
    },
  ];

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
              {t('help_center.header')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={[rowCenter, {marginLeft: 16, marginTop: 16}]}>
        <ScrollView horizontal>
          {DATA_TAB.map((x: {id: ITAB; title: string}, i: number) => (
            <TouchableOpacity
              key={`${x.id}-${x.title}`}
              style={
                selectedTab === x.id ? styles.activeTab : styles.inactiveTab
              }
              onPress={() => setSelectedTab(x.id)}>
              <Text
                style={
                  selectedTab === x.id ? styles.activeText : styles.inactiveText
                }>
                {x.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          margin: 16,
          marginTop: 0,
          flex: 1,
        }}>
        {selectedTab === 'faq' && <FAQ />}
        {selectedTab === 'privacy-policy' && <PrivacyPolicy />}
        {selectedTab === 's&k' && <TermsConditions />}
        {selectedTab === 'call-center' && <ContactUs />}
      </View>
    </View>
  );
};

export default hoc(HelpCenterScreen, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  activeTab: {
    paddingHorizontal: 33,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.navy,
    marginRight: 10,
  },
  inactiveTab: {
    paddingHorizontal: 33,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.navy,
    marginRight: 10,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  inactiveText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.navy,
  },
});
