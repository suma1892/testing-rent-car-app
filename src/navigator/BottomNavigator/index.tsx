import React from 'react';
import TabItem from './TabItem';
import {boxShadow} from 'utils/mixins';
import {colors} from 'theme/colors';
import {StyleSheet, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'; // Sesuaikan tipe dari React Navigation

const BottomNavigator: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const handlePress = (
    routeName: string,
    routeKey: string,
    isFocused: boolean,
  ) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleLongPress = (routeKey: string) => {
    navigation.emit({
      type: 'tabLongPress',
      target: routeKey,
    });
  };

  return (
    <View
      style={[
        styles.container,
        boxShadow('#000', {height: 0, width: 5}, 6.27, 0.34),
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <TabItem
            key={route.key}
            title={`${label}`}
            active={isFocused}
            onPress={() => handlePress(route.name, route.key, isFocused)}
            onLongPress={() => handleLongPress(route.key)}
          />
        );
      })}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
});
