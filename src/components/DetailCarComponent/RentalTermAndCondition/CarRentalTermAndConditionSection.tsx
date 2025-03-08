import CarRentalTitleButtonAction from './CarRentalTitleButtonAction';
import React, {useEffect, useState, memo} from 'react';
import RenderHTML from 'react-native-render-html';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getSnK} from 'redux/effects';
import {h1} from 'utils/styles';
import {ic_info_blue} from 'assets/icons';
import {iconSize, rowCenter, WINDOW_HEIGHT, WINDOW_WIDTH} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';

interface SnKData {
  term_condition_lines?: {
    term?: string;
  }[];
  childs?: {
    term_condition_lines?: {
      term?: string;
    }[];
  }[];
}
type IParams = {
  location_id?: number;
  sub_service_id?: number;
};

const CarRentalTermAndConditionSection: React.FC<IParams> = memo(param => {
  const {t, i18n} = useTranslation();
  const currentLanguage = i18n.language;
  const formDaily = useAppSelector(appDataState).formDaily;
  const [snk, setSnk] = useState<SnKData[]>();
  const [strSnk, setStrSnk] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      const res = await getSnK({
        location_id: param?.location_id || formDaily?.location_id,
        // sub_service_id: formDaily?.sub_service_id,
        sub_service_id: param?.sub_service_id || formDaily?.facility_id,
        language: currentLanguage.includes('id')
          ? 'ID'
          : currentLanguage.includes('cn')
          ? 'CN'
          : 'EN',
      });
      setSnk(res);
    };

    getData();
  }, [currentLanguage, formDaily?.location_id, formDaily?.sub_service_id]);

  useEffect(() => {
    const extractTerms = () => {
      try {
        const parentTerm = snk?.[0]?.term_condition_lines?.[0]?.term || '';
        const childTerm =
          snk?.[0]?.childs?.[0]?.term_condition_lines?.[0]?.term || '';

        // Clean up HTML and concatenate terms
        const sanitizedParentTerm = parentTerm
          .replace(/<br>/gi, '')
          .replace('<p></p>', '');
        const sanitizedChildTerm = childTerm.replace(/<br>/gi, '');

        setStrSnk(`${sanitizedParentTerm}<p>${sanitizedChildTerm}</p>`);
      } catch (error) {
        console.warn('Error extracting terms:', error);
      }
    };

    extractTerms();
  }, [snk]);

  return (
    <View style={styles.container}>
      <CarRentalTitleButtonAction snk={snk} />
      <View style={[rowCenter, {marginBottom: 10}]}>
        <Image source={ic_info_blue} style={iconSize} />
        <Text style={[h1, {color: theme.colors.blue}]}>
          {' '}
          {t('carDetail.important')}
        </Text>
      </View>
      {strSnk ? (
        <View
          style={{
            maxHeight: WINDOW_HEIGHT / 4,
            overflow: 'hidden',
          }}>
          <RenderHTML
            contentWidth={WINDOW_WIDTH}
            source={{
              html: strSnk,
            }}
            tagsStyles={tagsStyles}
          />
        </View>
      ) : (
        <Text style={{color: theme.colors.black}}>-</Text>
      )}
      <View style={styles.lineHorizontal} />
    </View>
  );
});

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
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
});

export default CarRentalTermAndConditionSection;
