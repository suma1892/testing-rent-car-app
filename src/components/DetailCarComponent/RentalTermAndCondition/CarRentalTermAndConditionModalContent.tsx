import React, {useEffect, useState, useMemo} from 'react';
import RenderHtml from 'react-native-render-html';
import {h1} from 'utils/styles';
import {ic_info_blue} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {BottomSheetScrollView, WINDOW_WIDTH} from '@gorhom/bottom-sheet';

interface CarRentalTermAndConditionModalContentProps {
  snk: any;
}

const CarRentalTermAndConditionModalContent: React.FC<
  CarRentalTermAndConditionModalContentProps
> = ({snk}) => {
  const {t} = useTranslation();
  const [strSnk, setStrSnk] = useState<string>('');

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

  const renderContent = useMemo(() => {
    return (
      <RenderHtml
        contentWidth={WINDOW_WIDTH}
        source={{html: strSnk}}
        tagsStyles={tagsStyles}
      />
    );
  }, [strSnk]);

  return (
    <View style={styles.container}>
      <Text style={h1}>{t('carDetail.rental_rules')}</Text>
      <View style={styles.importantLabelContainer}>
        <Image source={ic_info_blue} style={iconSize} />
        <Text style={styles.importantLabel}>{t('carDetail.important')}</Text>
      </View>
      <BottomSheetScrollView style={styles.scrollView}>
        {renderContent}
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
  scrollView: {
    marginBottom: 50,
    marginTop: 20,
  },
});
