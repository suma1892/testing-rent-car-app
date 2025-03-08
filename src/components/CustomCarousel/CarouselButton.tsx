import React from 'react';
import {ic_rounded_arrow_left, ic_rounded_arrow_right} from 'assets/icons';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface IProps {
  iconName: 'arrowright' | 'arrowleft';
  onPress: () => void;
  arrowLeftImage?: ImageSourcePropType;
  arrowRightImage?: ImageSourcePropType;
  arrowLeftPosition?: StyleProp<ViewStyle>;
  arrowRightPosition?: StyleProp<ViewStyle>;
}

const CarouselButton: React.FC<IProps> = props => {
  const {
    iconName,
    onPress,
    arrowLeftImage = ic_rounded_arrow_left,
    arrowRightImage = ic_rounded_arrow_right,
    arrowLeftPosition,
    arrowRightPosition,
  } = props;

  return (
    <TouchableOpacity
      style={[
        iconName === 'arrowleft' ? {left: 20} : {right: 20},
        styles.button,
        iconName === 'arrowleft' ? arrowLeftPosition : arrowRightPosition,
      ]}
      onPress={onPress}>
      <Image
        source={iconName === 'arrowleft' ? arrowLeftImage : arrowRightImage}
        style={styles.arrowImage}
      />
    </TouchableOpacity>
  );
};

export default CarouselButton;

const styles = StyleSheet.create({
  button: {
    width: 31,
    height: 31,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '45%',
  },
  arrowImage: {width: 30, height: 30},
});
