import Checkbox from 'components/Checkbox/Checkbox';
import React, { memo } from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {iconCustomSize} from 'utils/mixins';
import {h1, h4} from 'utils/styles';

type PenaltiesWarningAlertProps = {
  show: boolean;
  value: boolean;
  onChange: (val: boolean) => void;
};

const PenaltiesWarningAlert = ({
  show,
  value,
  onChange,
}: PenaltiesWarningAlertProps) => {
  const {t} = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('global.penalties_warning_title')}</Text>
      <Text style={styles.description}>
        {t('global.penalties_warning_description')}
      </Text>

      <Checkbox
        label={t('detail_order.rentalZone.agreeState')}
        onChange={onChange}
        checked={value}
        customLabelStyle={{marginLeft: 5, fontSize: 12}}
        customContainerStyle={{margin: 0, marginTop: 10}}
        customCheckboxStyle={iconCustomSize(15)}
      />
    </View>
  );
};

export default memo(PenaltiesWarningAlert);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF1DE',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.orange,
    padding: 12,
    marginTop: 22,
  },
  title: {
    ...h1,
    color: theme.colors.navy,
  },
  description: {
    ...h4,
    color: theme.colors.grey0,
    marginTop: 5,
    fontSize: 12,
  },
});
