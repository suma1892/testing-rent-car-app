import React from 'react';
import theme from 'utils/theme';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {h1} from 'utils/styles';
import {iconCustomSize} from 'utils/mixins';

interface IButton {
  title: string;
  _theme: ITheme;
  styleWrapper?: ViewStyle;
  styleText?: TextStyle;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  lineColor?: string;
  rightIcon?: ImageSourcePropType;
}

type ITheme = 'white' | 'navy' | 'transparent' | 'red' | 'orange';

const BUTTON_COLORS = {
  white: theme.colors.white,
  navy: theme.colors.navy,
  transparent: 'transparent',
  red: theme.colors.white,
  orange: '#F1A33A'
};

const TEXT_COLORS = {
  white: theme.colors.navy,
  navy: theme.colors.white,
  red: '#FF5757',
  transparent: theme.colors.white,
  orange: theme.colors.white
};

const Button = ({
  title,
  _theme,
  styleWrapper,
  styleText,
  onPress,
  isLoading,
  disabled = false,
  lineColor,
  rightIcon,
}: IButton) => {
  return (
    <TouchableOpacity
      onPressOut={onPress}
      disabled={isLoading || disabled}
      style={[
        styles.buttonWrapper,
        ButtonTheme(_theme, isLoading),
        styleWrapper,
        disabled && {backgroundColor: theme.colors.grey6},
        lineColor && {borderColor: lineColor, borderWidth: 1},
      ]}>
      <View style={styles.content}>
        {!isLoading && (
          <Text style={[h1, TextTheme(_theme), styleText]}>{title}</Text>
        )}
        {isLoading && (
          <ActivityIndicator size={'small'} color={theme.colors.white} />
        )}
        {rightIcon && (
          <Image
            source={rightIcon}
            style={[iconCustomSize(20), {marginLeft: 5}]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const ButtonTheme: any = (_theme: ITheme, isLoading: boolean) => ({
  backgroundColor: isLoading ? '#5d6878' : BUTTON_COLORS[_theme],
  borderWidth: _theme === 'transparent' ? 1 : 0,
  borderColor: 'white',
});

const TextTheme: any = (_theme: ITheme) => ({
  color: TEXT_COLORS[_theme],
});

export default Button;

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  textTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});
