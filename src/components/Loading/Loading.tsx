import React from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {theme} from 'utils';

const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
