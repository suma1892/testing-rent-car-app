import React from 'react';
import {h4} from 'utils/styles';
import {rowCenter, WINDOW_WIDTH} from 'utils/mixins';
import {StyleSheet, Text, TextStyle, View} from 'react-native';

type RowDetailProps = {
  title?: string;
  titleStyle?: TextStyle;
  description: string;
  descriptionStyle?: TextStyle;
};

const RowDetail: React.FC<RowDetailProps> = ({
  title,
  titleStyle,
  description,
  descriptionStyle,
}) => {
  return (
    <View style={[rowCenter, styles.container]}>
      <View
        style={{
          width: WINDOW_WIDTH / 1.8,
        }}>
        <Text style={[styles.textStyle, titleStyle]}>{title}</Text>
      </View>
      <Text style={[styles.textStyle, descriptionStyle]}>{description}</Text>
    </View>
  );
};

export default RowDetail;

const styles = StyleSheet.create({
  container: {justifyContent: 'space-between', width: '100%', marginTop: 15},
  textStyle: {
    fontSize: 12,
    fontWeight: '400',
  },
});
