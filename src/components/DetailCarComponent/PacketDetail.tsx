import React from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {h1, h4} from 'utils/styles';
import {ic_info3} from 'assets/icons';
import {iconCustomSize} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

const PacketDetail = () => {
  const {t} = useTranslation();
  const formDaily = useAppSelector(appDataState).formDaily;

  if (formDaily.with_driver) {
    return (
      <>
        <View style={styles.container}>
          <Image source={ic_info3} style={styles.imageInfo} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.title}>{t('carDetail.all_in_title')}</Text>
            {/* <Text style={[h4, {lineHeight: 24}]}>
              {t('carDetail.all_in_desc2')}
            </Text> */}
            {t('carDetail.all_in_desc2')
              .split('\n-')
              ?.map((x, i) => (
                <View key={`all_in_desc2_${i}`} style={{flexDirection: 'row'}}>
                  {i !== 0 && <Text>- </Text>}
                  <Text style={[h4, {lineHeight: 24}]} key={i}>
                    {x}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <View style={styles.container}>
          <Image source={ic_info3} style={styles.imageInfo} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.title}>{t('carDetail.all_in_tile2')}</Text>
            {/* <Text style={[h4, {lineHeight: 24}]}>
              {t('carDetail.all_in_desc3')}
            </Text> */}
            {t('carDetail.all_in_desc3')
              .split('\n- ')
              ?.map((x, i) => (
                <View key={`all_in_desc3_${i}`} style={{flexDirection: 'row'}}>
                  {i !== 0 && <Text>- </Text>}
                  <Text style={[h4, {lineHeight: 24}]} key={i}>
                    {x}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </>
    );
  }

  return null;
};

export default PacketDetail;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 30,
    paddingHorizontal: '5%',
  },
  imageInfo: {
    ...iconCustomSize(12),
    marginTop: 5,
  },
  title: {
    ...h1,
    color: theme.colors.navy,
  },
});
