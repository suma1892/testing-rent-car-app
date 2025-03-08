import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FC} from 'react';
import {img_coming_soon} from 'assets/images';

const TourLayout: FC = () => {
  return (
    <View>
      <Image
        source={img_coming_soon}
        style={{
          width: '90%',
          alignSelf: 'center',
          height: 300,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};

export default TourLayout;

const styles = StyleSheet.create({});
