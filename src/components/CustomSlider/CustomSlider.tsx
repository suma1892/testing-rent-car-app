import {Children, cloneElement, useMemo} from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import {StyleSheet, View} from 'react-native';

type Props = {
  renderCaption: React.ReactElement;
  renderFooter?: React.ReactElement;
  children: React.ReactElement;
  sliderValue?: number;
  onChange?: (val: number | number[]) => void;
  trackMarks?: number[];
  vertical?: boolean;
};

const CustomSlider: React.FC<Props> = ({
  renderCaption,
  renderFooter,
  sliderValue,
  trackMarks,
  onChange,
  children,
}) => {
  let renderTrackMarkComponent: any;
  const value = useMemo(() => sliderValue || 0, [sliderValue])

  if (trackMarks?.length) {
    renderTrackMarkComponent = (index: number) => {
      const currentMarkValue = trackMarks[index];
      const style =
        currentMarkValue > Math.max(value)
          ? styles.activeMark
          : styles.inactiveMark;
      return <View style={style} />;
    };
  }

  const renderChildren = () => {
    return Children.map(children, (child: React.ReactElement) => {
      if (!!child && child.type === Slider) {
        return cloneElement(child, {
          onValueChange: (val: number | number[]) => {
            onChange?.(val);
          },
          renderTrackMarkComponent,
          trackMarks,
          value,
        });
      }

      return child;
    });
  };

  return (
    <View style={{width: '100%'}}>
      <View style={styles.titleContainer}>{renderCaption}</View>
      {renderChildren()}
      {renderFooter}
    </View>
  );
};

export default CustomSlider;

const borderWidth = 4;
const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
  },
  activeMark: {
    borderColor: 'red',
    borderWidth,
    left: -borderWidth / 2,
  },
  inactiveMark: {
    borderColor: 'grey',
    borderWidth,
    left: -borderWidth / 2,
  },
});
