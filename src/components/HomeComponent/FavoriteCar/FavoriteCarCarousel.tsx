import CustomCarousel from 'components/CustomCarousel/CustomCarousel';
import FavoriteCarCard from './FavoriteCarCard';
import React, {memo, useCallback, useMemo} from 'react';
import {IVehicles} from 'types/vehicles';
import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppSelector} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {WINDOW_WIDTH} from 'utils/mixins';

interface FavoriteCarCarouselProps {
  withDriverState: boolean;
}

const FavoriteCarCarousel: React.FC<FavoriteCarCarouselProps> = ({
  withDriverState,
}) => {
  const navigation = useNavigation();
  const {data: rentalLocationData, services} =
    useAppSelector(rentalLocationState);
  const {type_vehicles, isLoadingVehicle} = useAppSelector(vehiclesState);

  // Sorting vehicles by price
  const sortedVehicles = useMemo(() => {
    if (!type_vehicles || !Array.isArray(type_vehicles)) return [];
    return [...type_vehicles].sort((a, b) => a.price - b.price);
  }, [type_vehicles]);

  // Render item function
  const renderItem = useCallback(
    ({item}: {item: IVehicles}) => {
      const handlePress = () => {
        const name = withDriverState ? 'With Driver' : 'Without Driver';

        const subServiceId = services
          ?.find(service => service?.name === 'Sewa Mobil')
          ?.sub_services?.find(subService => subService?.name === 'Daily')
          ?.facilities?.find(facility => facility?.name === name)?.id;

        navigation.navigate('DetailCar', {
          vehicle_id: item.id,
          location_id: rentalLocationData?.[0]?.id ?? null,
          sub_service_id: subServiceId ?? null,
        });
      };

      return (
        <FavoriteCarCard
          item={item}
          withDriver={withDriverState}
          onPress={handlePress}
        />
      );
    },
    [navigation, services, rentalLocationData, withDriverState],
  );

  // Return null if data is still loading
  if (isLoadingVehicle) return null;

  // Render the carousel
  return (
    <CustomCarousel
      carouselWidth={WINDOW_WIDTH * 0.95}
      data={sortedVehicles}
      renderItem={renderItem}
      showButtonNavigator={false}
      scrollAnimationDuration={300}
      height={151}
      showScrollDot={true}
      paginationSize={7}
      paginationColor="#F1A33A"
      paginationPosition={5}
      loop={false}
    />
  );
};

export default memo(FavoriteCarCarousel);
