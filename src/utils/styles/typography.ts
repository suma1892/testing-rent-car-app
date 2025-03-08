import {TextStyle} from 'react-native';
import {Typography} from 'utils';
import theme from 'utils/theme';
import {colors} from './colors';

export const textBase: TextStyle = {
  // fontFamily: theme.Text.style.fontFamily,
  color: colors.primary,
};

export const h1: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '700',
};

export const h2: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '600',
};

export const h3: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '500',
};

export const h4: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '400',
};

export const h5: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '300',
};

export const paragraph: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '400',
};

export const large: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '700',
};

export const small: TextStyle = {
  ...textBase,
  fontSize: Typography.FONT_SIZE_SMALLER,
  fontWeight: '300',
};
