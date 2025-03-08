import {colors, h1} from 'utils/styles';
import {ic_info_error} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

interface IProps {
  onChangeText: (text: string) => void;
  errorMessage?: string;
  value: string;
}

const SenderTextInput: React.FC<IProps> = ({
  onChangeText,
  errorMessage,
  value,
}) => {
  const {t} = useTranslation();

  return (
    <View style={{marginBottom: 20}}>
      <View style={[rowCenter, {marginTop: 10}]}>
        <Text style={[h1, {fontSize: 12, marginBottom: 10, marginTop: 15}]}>
          {t('upload_bank_transfer.sender_name')}
        </Text>
      </View>

      <View style={[rowCenter, styles.inputContainer]}>
        <TextInput
          onChangeText={onChangeText}
          placeholder={t('upload_bank_transfer.sender_name') as any}
          style={styles.textInput}
          placeholderTextColor={colors.gray500}
          value={value}
        />
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

export default SenderTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    borderColor: theme.colors.black,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  textInput: {
    padding: 0,
    margin: 0,
    width: '100%',
    color: theme.colors.black,
  },
});
