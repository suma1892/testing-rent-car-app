import React, {useEffect, useRef, useState} from 'react';
import {h5} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

const TextInputTimeExpired = ({
  onChangeText,
}: {
  onChangeText: (v: string) => void;
}) => {
  const {t} = useTranslation();
  const textRef1 = useRef<TextInput>(null);
  const textRef2 = useRef<TextInput>(null);

  const [inputs, setInputs] = useState({
    input1: '',
    input2: '',
  });

  useEffect(() => {
    onChangeText(inputs.input1 + inputs.input2);
    if (inputs.input1.length === 2) {
      textRef2.current?.focus();
    }
  }, [inputs]);

  return (
    <View style={{flex: 1}}>
      <View
        style={[rowCenter, {marginTop: 12, justifyContent: 'space-between'}]}>
        <Text style={[h5, {fontSize: 12}]}>{t('global.validity_period')}</Text>
      </View>

      <View style={[rowCenter, styles.creditCard]}>
        <TextInput
          onChangeText={v => setInputs({...inputs, input1: v})}
          placeholder="MM"
          maxLength={2}
          ref={textRef1}
          value={inputs.input1}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
        <Text> / </Text>
        <TextInput
          onChangeText={v => setInputs({...inputs, input2: v})}
          placeholder="YY"
          maxLength={2}
          ref={textRef2}
          value={inputs.input2}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
};

export default TextInputTimeExpired;

const styles = StyleSheet.create({
  creditCard: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
