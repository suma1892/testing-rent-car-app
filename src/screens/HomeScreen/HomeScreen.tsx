import Article from 'components/HomeComponent/Article/Article';
import FavoriteCar from 'components/HomeComponent/FavoriteCar/FavoriteCar';
import GetRideDescription from 'components/HomeComponent/GetRideDescription/GetRideDescription';
import hoc from 'components/hoc';
import HomeHero from 'components/HomeComponent/HomeHero/HomeHero';
import HomeTopNavigation from 'components/HomeComponent/HomeTopNavigation';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SwitchLanguage from 'components/HomeComponent/SwitchLanguage/SwitchLanguage';
import Testimoni from 'components/HomeComponent/Testimoni/Testimoni';
import WhyChooseUs from 'components/HomeComponent/WhyChooseUs/WhyChooseUs';
import {buttonList} from 'components/HomeComponent/HomeHero/HomeHero.datasource';

import {rentalLocationState} from 'redux/features/rentalLocation/rentalLocationSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {
  getRentalLocation,
  getServices,
} from 'redux/features/rentalLocation/rentalLocationAPI';
import {
  getBanners,
  getGlobalConfigs,
  getRefferalPoint,
  getUser,
} from 'redux/features/appData/appDataAPI';

type HeroState = {
  id: number;
  name: string;
  icon: string;
  sub_services: any[]; // Replace `any` with appropriate type
  img: string;
  imgActive: string;
  title: string;
};

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {rentalLocationParams, services} = useAppSelector(rentalLocationState);
  const [showBottom, setShowBottom] = useState(false);
  const [heroState, setHeroState] = useState<HeroState>({
    id: 0,
    name: '',
    icon: '',
    sub_services: [],
    img: '',
    imgActive: '',
    title: '',
  });

  // Fetch global configurations and user data on component mount
  useEffect(() => {
    dispatch(getGlobalConfigs());
    dispatch(getUser());
    dispatch(getBanners());
    dispatch(getRefferalPoint());
    dispatch(getServices());
  }, [dispatch]);

  const sortedServices = useMemo(() => {
    return services
      .map(service => {
        const selectedButton = buttonList.find(
          button => button.key === service.name,
        );
        return {
          ...service,
          img: selectedButton?.img || '',
          imgActive: selectedButton?.imgActive || '',
          title: selectedButton?.title || '',
          sequence: selectedButton?.sequence || 0,
        };
      })
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [services]);

  useEffect(() => {
    if (sortedServices?.length) {
      const service = sortedServices[0];
      const subService = service?.sub_services?.[0];
      const facility = subService?.facilities
        ?.slice()
        ?.sort((a, b) => b.name.localeCompare(a.name))?.[0];

      if (
        (rentalLocationParams.service_id || service?.id) &&
        (rentalLocationParams.sub_service_id || subService?.id)
      ) {
        // dispatch(
        //   getRentalLocation({
        //     service_id: rentalLocationParams.service_id || service?.id,
        //     sub_service_id:
        //       rentalLocationParams.sub_service_id || subService?.id,
        //     facility_id: rentalLocationParams.facility_id || facility?.id,
        //   }),
        // );
      }
    }
  }, [rentalLocationParams, sortedServices]);

  useEffect(() => {
    if (sortedServices?.length) {
      setHeroState(sortedServices[0]);
    }
  }, [sortedServices]);

  const renderItem = useCallback(
    () => (
      <>
        <HomeHero onSelectionChange={setHeroState as any} />
        <HomeTopNavigation selectedService={heroState} />
        <FavoriteCar />
        <GetRideDescription />
        <WhyChooseUs />
        <Testimoni />
        <Article />
      </>
    ),
    [showBottom, heroState],
  );

  // const onEndReached = useCallback(() => {
  //   if (showBottom) return;
  //   setLoader(true);
  //   setTimeout(() => {
  //     setShowBottom(true);
  //     setLoader(false);
  //   }, 150);
  // }, [showBottom]);

  return (
    <View style={styles.wrapper}>
      <SwitchLanguage />
      <FlatList
        data={[1]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `home_component_${item}_${index}`}
        // onEndReached={onEndReached}
        // ListFooterComponent={() => (
        //   <View style={styles.footer}>
        //     {loader && <ActivityIndicator size="small" />}
        //     <View style={styles.footerSpacing} />
        //   </View>
        // )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
  },
  footerSpacing: {
    marginBottom: 50,
  },
});

export default hoc(HomeScreen);
HomeScreen.whyDidYouRender = true;
