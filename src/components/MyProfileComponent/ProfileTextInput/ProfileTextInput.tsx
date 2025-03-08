import PhoneNumberInput from '../PhoneNumberInput/PhoneNumberInput';
import {h1} from 'utils/styles';
import {ic_info_error} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {ProfileTextInputProps} from './types';
import {theme} from 'utils';

const ProfileTextInput: React.FC<ProfileTextInputProps> = ({
  onChangeText,
  errorMessage,
  value,
  label,
  placeholder,
  type = 'default',
  rightImageSource,
  editable = true,
  keyboardType,
  includeCheckbox,
  defaultCode,
  maxLength = 300,
}) => {
  return (
    <View style={{marginBottom: 20}}>
      <View
        style={[
          rowCenter,
          !!includeCheckbox ? {justifyContent: 'space-between'} : {},
        ]}>
        <Text style={[h1, {fontSize: 12, marginBottom: 10, marginTop: 5}]}>
          {label}
        </Text>
        {includeCheckbox}
      </View>

      {type === 'default' ? (
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: editable ? 'none' : theme.colors.grey6},
          ]}>
          {!!rightImageSource && (
            <Image
              source={rightImageSource}
              style={[iconCustomSize(20), {marginRight: 10}]}
            />
          )}

          <TextInput
            onChangeText={onChangeText as any}
            placeholder={placeholder}
            style={{padding: 0, margin: 0, color: '#000', width: '100%'}}
            value={value}
            editable={editable}
            keyboardType={keyboardType}
            placeholderTextColor={theme.colors.grey5}
            maxLength={maxLength}
          />
        </View>
      ) : (
        <PhoneNumberInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          value={value}
          editable={editable}
          maxLength={maxLength}
          defaultCode={defaultCode}
        />
      )}

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

export default ProfileTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CBCBCB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
