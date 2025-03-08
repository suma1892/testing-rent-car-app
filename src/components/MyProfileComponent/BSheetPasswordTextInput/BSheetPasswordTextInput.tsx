import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {ic_eye_close, ic_info_error} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

interface IProps {
  onChangeText: (text: string) => void;
  errorMessage?: string;
  label: string;
  placeholder: string;
}

const BSheetPasswordTextInput: React.FC<IProps> = ({
  onChangeText,
  errorMessage,
  label,
  placeholder,
}) => {
  const [showText, setShowText] = useState<boolean>(true);
  const [value, setValue] = useState('');

  return (
    <View style={{marginBottom: 20}}>
      <View style={rowCenter}>
        <Text style={[h1, {fontSize: 12, marginBottom: 15, marginTop: 5}]}>
          {label}
        </Text>
      </View>

      <View style={[rowCenter, styles.inputContainer]}>
        <BottomSheetTextInput
          onChangeText={v => {
            setValue(v);
            onChangeText(v);
          }}
          placeholder={placeholder}
          style={{padding: 0, margin: 0, color: theme.colors.black}}
          secureTextEntry={showText}
          value={value}
          placeholderTextColor={theme.colors.grey5}
        />

        <TouchableOpacity onPress={() => setShowText(!showText)}>
          <Image source={ic_eye_close} style={styles.eye} />
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <View style={[rowCenter, {marginTop: 5}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 12, color: theme.colors.red}]}>
            {' '}
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BSheetPasswordTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    borderColor: '#CBCBCB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  eye: {
    height: 20,
    width: 20,
  },
});
