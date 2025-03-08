import React, {useEffect, useRef, useState} from 'react';
import {h5} from 'utils/styles';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_visa,
  ic_master_card,
  ic_american_express,
  ic_jcb,
} from 'assets/icons';

const TextInputCredit = ({
  onChangeText,
}: {
  onChangeText: (v: string) => void;
}) => {
  const {t} = useTranslation();
  const textRef1 = useRef<TextInput>(null);
  const textRef2 = useRef<TextInput>(null);
  const textRef3 = useRef<TextInput>(null);
  const textRef4 = useRef<TextInput>(null);

  const [inputs, setInputs] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
  });

  useEffect(() => {
    onChangeText(inputs.input1 + inputs.input2 + inputs.input3 + inputs.input4);

    if (inputs.input3.length === 4) {
      textRef4.current?.focus();
    } else if (inputs.input2.length === 4) {
      textRef3.current?.focus();
    } else if (inputs.input1.length === 4) {
      textRef2.current?.focus();
    }
  }, [inputs]);

  return (
    <View>
      <View
        style={[rowCenter, {marginTop: 12, justifyContent: 'space-between'}]}>
        <Text style={[h5, {fontSize: 12}]}>
          {t('global.credit_debit_card_no')}
        </Text>
        <View
          style={[rowCenter, {width: '40%', justifyContent: 'space-between'}]}>
          <Image source={ic_visa} style={iconSize} />
          <Image source={ic_master_card} style={iconSize} />
          <Image source={ic_american_express} style={iconSize} />
          <Image source={ic_jcb} style={iconSize} />
        </View>
      </View>

      <View style={[rowCenter, styles.creditCard]}>
        <TextInput
          onChangeText={v => setInputs({...inputs, input1: v})}
          placeholder="0000"
          maxLength={4}
          ref={textRef1}
          value={inputs.input1}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
        <Text> - </Text>
        <TextInput
          onChangeText={v => setInputs({...inputs, input2: v})}
          placeholder="0000"
          maxLength={4}
          ref={textRef2}
          value={inputs.input2}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
        <Text> - </Text>
        <TextInput
          onChangeText={v => setInputs({...inputs, input3: v})}
          placeholder="0000"
          maxLength={4}
          ref={textRef3}
          value={inputs.input3}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
        <Text> - </Text>
        <TextInput
          onChangeText={v => setInputs({...inputs, input4: v})}
          placeholder="0000"
          maxLength={4}
          ref={textRef4}
          value={inputs.input4}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
};

export default TextInputCredit;

const styles = StyleSheet.create({
  creditCard: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
