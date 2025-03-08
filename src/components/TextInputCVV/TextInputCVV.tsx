import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {rowCenter} from 'utils/mixins';
import {h5} from 'utils/styles';
import {theme} from 'utils';

const TextInputCVV = ({onChangeText}: {onChangeText: (v: string) => void}) => {
  const [input, setInput] = useState('');

  return (
    <View style={{flex: 1}}>
      <View
        style={[rowCenter, {marginTop: 12, justifyContent: 'space-between'}]}>
        <Text style={[h5, {fontSize: 12}]}>CVV</Text>
      </View>

      <View style={[rowCenter, styles.creditCard]}>
        <TextInput
          onChangeText={v => {
            setInput(v);
            onChangeText(v);
          }}
          placeholder="000"
          maxLength={3}
          value={input}
          style={{
            padding: 0,
            margin: 0,
            width: '100%',
            color: theme.colors.black,
          }}
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
};

export default TextInputCVV;

const styles = StyleSheet.create({
  creditCard: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
