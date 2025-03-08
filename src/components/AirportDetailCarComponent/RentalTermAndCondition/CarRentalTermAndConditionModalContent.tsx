import React, {useEffect, useState} from 'react';
import {airportTransferRules} from './data';
import {BottomSheetScrollView, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {h1, h4} from 'utils/styles';
import {ic_info_blue} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import RenderHTML from 'react-native-render-html';

const CarRentalTermAndConditionModalContent = ({snk}: {snk: any}) => {
  const {t} = useTranslation();
  const [strSnk, setStrSnk] = useState('');

  useEffect(() => {
    const _func = () => {
      try {
        let str =
          snk?.[0]?.term_condition_lines?.[0]?.term +
          snk?.[0]?.childs?.[0]?.term_condition_lines?.[0]?.term;

        setStrSnk(str);
      } catch (error) {
        console.warn(error);
      }
    };
    _func();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('carDetail.rental_rules')}</Text>
      <View style={styles.importantLabelContainer}>
        <Image source={ic_info_blue} style={iconSize} />
        <Text style={styles.importantLabel}> {t('carDetail.important')}</Text>
      </View>
      {/* <BottomSheetScrollView>
        <View style={styles.listContainer}>
          {[...airportTransferRules].map((data, i) => (
            <View key={i}>
              <Text style={styles.descLabel}>{t(data.desc)}</Text>

              <View style={styles.listContainer2}>
                {data.list.map((child, j) => (
                  <View key={`text_${j}`} style={[{flexDirection: 'row'}]}>
                    <Text style={styles.descLabel2}>&#x2022; </Text>
                    <Text style={styles.descLabel2}>{t(child)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </BottomSheetScrollView> */}
      <BottomSheetScrollView style={{marginBottom: 50}}>
        <RenderHTML
          contentWidth={WINDOW_WIDTH}
          source={{html: strSnk}}
          tagsStyles={tagsStyles}
        />
      </BottomSheetScrollView>
    </View>
  );
};

export default CarRentalTermAndConditionModalContent;
const tagsStyles = {
  p: {
    margin: 0,
    padding: 5,
  },
  ul: {
    margin: 0,
    paddingLeft: 20,
  },
  ol: {
    margin: 0,
    paddingLeft: 20,
  },
  li: {
    marginBottom: 8,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  importantLabelContainer: {
    ...rowCenter,
    marginTop: 10,
  },
  importantLabel: {
    ...h1,
    color: theme.colors.blue,
  },
  listContainer: {
    paddingHorizontal: '5%',
  },
  descLabel: {
    ...h1,
    marginTop: 10,
  },
  listContainer2: {
    marginTop: 10,
    marginLeft: 5,
  },
  descLabel2: {
    ...h4,
    lineHeight: 24,
  },
});
