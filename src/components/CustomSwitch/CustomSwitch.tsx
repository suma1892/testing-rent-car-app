import {Switch, View, Text} from 'react-native';
import {useState, useEffect} from 'react';
import {h5} from 'utils/styles';
import {rowCenter} from 'utils/mixins';

type Props = {
  label: string;
  defaultValue: boolean;
  onValueChange: (val: boolean) => void;
};

const CustomSwitch: React.FC<Props> = ({label, defaultValue, onValueChange}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const toggleSwitch = () => {
    onValueChange(!isEnabled);
    setIsEnabled(previousState => !previousState);
  };

  useEffect(() => {
    if (defaultValue) {
      setIsEnabled(defaultValue);
    }
  }, [defaultValue])
  

  return (
    <View
      style={[
        rowCenter,
        {justifyContent: 'space-between', marginVertical: 10},
      ]}>
      <Text style={[h5, {fontSize: 12}]}>{label}</Text>
      <Switch
        trackColor={{false: '#D9D9D9', true: '#0085FF'}}
        thumbColor="#f4f3f4"
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default CustomSwitch;
