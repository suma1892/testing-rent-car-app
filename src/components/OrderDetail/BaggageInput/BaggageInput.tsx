import {View, Text, Image} from 'react-native';
import React from 'react';
import CustomTextInput from 'components/TextInput';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ic_exclamation} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import {showBSheet} from 'utils/BSheet';
import {useTranslation} from 'react-i18next';
import {theme} from 'utils';

const BaggageInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const {t} = useTranslation();
  const handleInfo = () => {
    showBSheet({
      snapPoint: ['30%', '30%'],
      content: (
        <View style={{margin: 10}}>
          <Text style={[h1, {fontSize: 18}]}>
            {t('detail_order.baggage_title_info')}
          </Text>
          <Text style={[h4, {lineHeight: 24, color: '#000', marginTop: 20}]}>
            {t('detail_order.baggage_desc_info')}
          </Text>
        </View>
      ),
    });
  };

  return (
    <View>
      <View style={[rowCenter]}>
        <Text style={[h4, {marginRight: 4}]}>
          {t('detail_order.baggage_title_info')}
          <Text style={{color: theme.colors.red}}>*</Text>
        </Text>
        <TouchableOpacity onPress={handleInfo}>
          <Image source={ic_exclamation} style={[iconCustomSize(12)]} />
        </TouchableOpacity>
      </View>
      <CustomTextInput
        title=""
        value={value}
        placeholder={t('detail_order.baggage_placeholder')}
        onChangeText={x => onChange(x?.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={2}
      />
    </View>
  );
};

export default BaggageInput;
