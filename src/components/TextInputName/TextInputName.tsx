import React, {useState} from 'react';
import {h5} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const TextInputName = ({onChangeText}: {onChangeText: (v: string) => void}) => {
  const {t} = useTranslation();
  const [input, setInput] = useState('');

  return (
    <View style={{marginBottom: 15}}>
      <View
        style={[rowCenter, {marginTop: 12, justifyContent: 'space-between'}]}>
        <Text style={[h5, {fontSize: 12}]}>{t('global.cardholder_name')}</Text>
      </View>

      <View style={[rowCenter, styles.creditCard]}>
        <TextInput
          onChangeText={v => {
            setInput(v);
            onChangeText(v);
          }}
          placeholder={t('global.cardholder_name') as any}
          maxLength={15}
          value={input}
          style={{
            padding: 0,
            margin: 0,
            width: '100%',
            color: theme.colors.black,
          }}
        />
      </View>
    </View>
  );
};

export default TextInputName;

const styles = StyleSheet.create({
  creditCard: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
