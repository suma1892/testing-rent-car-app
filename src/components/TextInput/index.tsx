import {ic_eye_close} from 'assets/icons';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {deepClone, theme} from 'utils';
import {iconSize} from 'utils/mixins';
import {h4} from 'utils/styles';
import {FONT_SIZE_12, FONT_SIZE_14} from 'utils/typography';

interface ITextInput extends TextInputProps {
  title?: string;
  placeholder: string;
  errorMessage?: string;
  leftIcon?: any;
  disabled?: boolean;
  styleTitle?: TextStyle;
  outline?: boolean;
  textAreastyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  isImportant?: boolean;
}

const CustomTextInput = ({
  title,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  value,
  errorMessage,
  isImportant = false,
  leftIcon,
  disabled,
  styleTitle,
  outline,
  keyboardType,
  autoCapitalize,
  textAreastyle,
  style,
  maxLength,
}: ITextInput) => {
  const [showText, setShowText] = useState<boolean>(deepClone(secureTextEntry));
  const shake = useSharedValue(0);
  const _err = deepClone(errorMessage || '');

  const rText = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: shake.value,
        },
      ],
    };
  });

  useEffect(() => {
    shake.value = withSequence(
      withTiming(-10, {duration: 50}),
      withRepeat(withTiming(10, {duration: 200}), 3, true),
      withTiming(0, {duration: 50}),
    );
  }, [_err]);

  const inputStyles = outline
    ? [
        styles.outlineInputWrapper,
        {
          borderBottomColor: errorMessage
            ? theme.colors.red
            : theme.colors.grey5,
        },
      ]
    : [
        styles.inputWrapper,
        {
          borderColor: errorMessage ? theme.colors.red : theme.colors.grey5,
          backgroundColor: disabled ? theme.colors.grey8 : theme.colors.white,
        },
      ];

  return (
    <View>
      {title && (
        <Text style={[h4, styleTitle]}>
          {title}
          <Text style={{color: theme.colors.red}}>
            {isImportant ? '*' : ''}
          </Text>
        </Text>
      )}
      <View style={[inputStyles as any, style]}>
        {leftIcon && (
          <Image source={leftIcon} style={[iconSize, {marginRight: 10}]} />
        )}
        <TextInput
          placeholder={placeholder}
          maxLength={maxLength}
          style={[
            styles.input,
            {
              color: disabled ? theme.colors.grey3 : theme.colors.black,
              width: !secureTextEntry ? '100%' : '93%',
            },
            textAreastyle && {
              ...textAreastyle,
            },
          ]}
          secureTextEntry={showText}
          onChangeText={onChangeText}
          placeholderTextColor={theme.colors.grey5}
          value={value}
          editable={!disabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowText(!showText)}
            style={{marginRight: 20}}>
            <Image source={ic_eye_close} style={styles.eye} />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && (
        <Animated.Text style={[styles.textError, rText]}>
          {errorMessage}
        </Animated.Text>
      )}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  outlineInputWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginTop: 5,
  },
  inputWrapper: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
    width: '100%',
  },
  input: {
    margin: 0,
    padding: 0,
  },
  eye: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: FONT_SIZE_14,
  },
  textError: {
    fontSize: FONT_SIZE_12,
    color: theme.colors.red,
    marginTop: 3,
    fontWeight: '500',
    marginRight: 0,
  },
});
