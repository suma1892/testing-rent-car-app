import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import PromoBundleCard from './PromoBundleCard';
import {getVehicles} from 'redux/features/vehicles/vehiclesAPI';
import {h1} from 'utils/styles';
import {IVehicles} from 'types/vehicles';
import {StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {WINDOW_WIDTH} from 'utils/mixins';

const PromoBundle: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(vehiclesState).vehicles;

  const renderItem = ({item}: {item: IVehicles}) => {
    return (
      <PromoBundleCard
        item={item}
        onPress={() => {}}
      />
    );
  };

  useEffect(() => {
    dispatch(getVehicles(''));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[h1, styles.title]}>{t('Home.promoBundle')}</Text>

      <CustomCarousel
        carouselWidth={WINDOW_WIDTH * (92 / 100)}
        data={[...vehicles].splice(0, 4)}
        renderItem={renderItem}
        showButtonNavigator={false}
        scrollAnimationDuration={2000}
        height={151}
        paginationSize={7}
        paginationColor="#F1A33A"
        paginationPosition={5}
        loop={false}
      />
    </View>
  );
};

export default PromoBundle;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6FA',
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  title: {marginBottom: 10, fontSize: 18},
  boxWrapper: {
    marginRight: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
});
