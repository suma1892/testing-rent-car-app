import {Dimensions, PixelRatio, ViewStyle} from 'react-native';
import theme from './theme';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
// const guidelineBaseWidth = 375;

export const scaleSize = (size: number) => size;

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

function dimensions(
  top: number,
  right = top,
  bottom = top,
  left = right,
  property: string,
) {
  const styles = {} as any;

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(
  top: number,
  right: number,
  bottom: number,
  left: number,
) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(
  top: number,
  right: number,
  bottom: number,
  left: number,
) {
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
  color: string,
  offset = {height: 2, width: 2},
  radius = 8,
  opacity = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}

export const iconSize = {
  height: 21,
  width: 21,
};

export const rowCenter: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const container: ViewStyle = {
  padding: 16,
  backgroundColor: '#fff',
  flex: 1,
};

export const iconCustomSize = (value: number) => {
  return {
    height: value,
    width: value,
  };
};

export const colorSelecting = (value: any) => {
  return {
    color: value ? theme.colors.black : theme.colors.grey4,
  };
};
