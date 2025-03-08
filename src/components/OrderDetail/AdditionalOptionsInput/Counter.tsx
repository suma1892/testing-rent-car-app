import {h5} from 'utils/styles';
import {ic_minus_circle_filled, ic_plus_circle_filled} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';

type Props = {
  defaultValue: number;
  selected: boolean;
  onChange: (count: number) => void;
};

const Counter = ({selected, onChange, defaultValue}: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if(selected) {
      setCount(defaultValue);
    } else {
      setCount(0);
    }
  }, [selected]);

  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity
        onPress={() => {
          if (count >= 0) {
            onChange(count === 0 ? count : count - 1);
            setCount(prev => (prev === 0 ? prev : prev - 1));
          }
        }}>
        <Image source={ic_minus_circle_filled} style={iconSize} />
      </TouchableOpacity>
      <Text style={h5}>{count}</Text>
      <TouchableOpacity onPress={() => {
        if (count <= 2) {
          onChange(count + 1);
          setCount(prev => prev + 1);
        }
      }}>
        <Image source={ic_plus_circle_filled} style={iconSize} />
      </TouchableOpacity>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexBasis: '20%',
  },
});
