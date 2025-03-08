import {h1, h4} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function PrivacyPolicy() {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff', marginTop: 30}}>
      <ScrollView>
        <Text style={[h1, styles.title]}>{t('tab_help_center.1.title')}</Text>

        <Text style={[h1, {fontSize: 16, marginVertical: 10}]}>
          {t('privacy_policy.0.title')}
        </Text>

        <View style={[rowCenter, {alignItems: 'flex-start'}]}>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>1. </Text>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>
            {t('privacy_policy.0.sub.0.title')}
          </Text>
        </View>

        {[...Array(3).fill('')].map((x, i) => (
          <View
            key={i}
            style={[rowCenter, {alignItems: 'flex-start', marginLeft: 10}]}>
            <Text style={[{marginTop: -3}, h1]}>• </Text>
            <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
              {t(`privacy_policy.0.sub.0.description.${i}`)}
            </Text>
          </View>
        ))}

        <View style={[rowCenter, {alignItems: 'flex-start'}]}>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>2. </Text>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>
            {t('privacy_policy.0.sub.1.title')}
          </Text>
        </View>

        {[...Array(8).fill('')].map((x, i) => (
          <View
            key={i}
            style={[rowCenter, {alignItems: 'flex-start', marginLeft: 10}]}>
            <Text style={[{marginTop: -3}, h1]}>• </Text>
            <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
              {t(`privacy_policy.0.sub.1.description.${i}`)}
            </Text>
          </View>
        ))}

        <View style={[rowCenter, {alignItems: 'flex-start'}]}>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>3. </Text>
          <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>
            {t('privacy_policy.0.sub.2.title')}
            <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
              {'\n' + t('privacy_policy.0.sub.2.sub_title')}
            </Text>
          </Text>
        </View>

        {[...Array(9).fill('')].map((x, i) => (
          <>
            {i === 6 ? (
              <View>
                <View
                  key={i}
                  style={[
                    rowCenter,
                    {alignItems: 'flex-start', marginLeft: 10},
                  ]}>
                  <Text style={[{marginTop: -3}, h1]}>• </Text>
                  <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
                    {t(`privacy_policy.0.sub.2.description.${i}.title`)}
                  </Text>
                </View>
                {[...Array(5).fill('')].map((x1, i1) => (
                  <View
                    key={i1}
                    style={[
                      rowCenter,
                      {alignItems: 'flex-start', marginLeft: 20},
                    ]}>
                    <Text style={[{marginTop: -3}, h1]}>• </Text>
                    <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
                      {t(
                        `privacy_policy.0.sub.2.description.${i}.description.${i1}`,
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View
                key={i}
                style={[rowCenter, {alignItems: 'flex-start', marginLeft: 10}]}>
                <Text style={[{marginTop: -3}, h1]}>• </Text>
                <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
                  {t(`privacy_policy.0.sub.2.description.${i}`)}
                </Text>
              </View>
            )}
          </>
        ))}

        <Text style={[h1, {fontSize: 16, marginTop: 25, marginBottom: 15}]}>
          {t('privacy_policy.1.title')}
        </Text>

        <Text style={[h1, {fontSize: 12, marginBottom: 10}]}>
          {t('privacy_policy.1.sub_title1')}
        </Text>

        <Text style={[h4, {fontSize: 12}]}>
          {t('privacy_policy.1.sub_title2')}
        </Text>

        <Text style={[h1, {fontSize: 16, marginTop: 25, marginBottom: 15}]}>
          {t('privacy_policy.2.title')}
        </Text>

        <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
          {t('privacy_policy.2.sub_title1')}
        </Text>

        <Text style={[h1, {fontSize: 12}]}>
          {t('privacy_policy.2.sub_title2')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    // alignSelf: 'center',
    color: theme.colors.navy,
    marginTop: 20,
  },
  header: {
    paddingVertical: 16,
    borderColor: '#C4C4C4',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  headerText: {
    fontSize: 14,
  },
  headerTextRotate: {
    transform: [{rotate: '180deg'}],
    fontSize: 12,
  },
  content: {
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  textContent: {},
});
