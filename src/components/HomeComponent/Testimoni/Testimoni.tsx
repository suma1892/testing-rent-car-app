import CustomerTestimoni from './partials/CustomerTestimoni';
import InfluencerTestimoni from './partials/InfluencerTestimoni';
import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';

const Testimoni = () => {
  return (
    <View style={styles.container}>
      <InfluencerTestimoni />
      <CustomerTestimoni />
    </View>
  );
};

export default memo(Testimoni);

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
});
