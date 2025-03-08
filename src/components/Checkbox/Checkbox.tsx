import {ic_blue_check, ic_uncheck} from 'assets/icons';
import { memo } from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {iconSize, rowCenter} from 'utils/mixins';
import {h5} from 'utils/styles';

type Props = {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  customContainerStyle?: ViewStyle;
  customLabelStyle?: TextStyle;
  customCheckboxStyle?: ImageStyle;
  disabled?: boolean;
};

const Checkbox: React.FC<Props> = ({
  label,
  checked,
  onChange,
  customContainerStyle,
  customLabelStyle,
  customCheckboxStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[rowCenter, styles.container, customContainerStyle]}
      onPress={() => onChange(!checked)}>
      <Image
        source={checked ? ic_blue_check : ic_uncheck}
        style={[iconSize, customCheckboxStyle]}
      />
      <Text style={[h5, customLabelStyle]}> {label}</Text>
    </TouchableOpacity>
  );
};

export default memo(Checkbox);

const styles = StyleSheet.create({
  container: {margin: 16},
});
