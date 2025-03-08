import {img_coming_soon} from 'assets/images';
import {View, StyleSheet, Image} from 'react-native';

const RentMotorCycleNavigation: React.FC = () => {
  return (
    <View style={styles.wrapper}>
      <View style={{width: '100%'}}>
        <Image
          source={img_coming_soon}
          resizeMode="contain"
          style={{width: '100%'}}
        />
      </View>
    </View>
  );
};

export default RentMotorCycleNavigation;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -10,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: '5%',
    width: '100%',
  },
});
