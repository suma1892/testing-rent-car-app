/* eslint-disable react-hooks/exhaustive-deps */
import {appDataState} from 'redux/features/appData/appDataSlice';
import {getSummaryOrder} from 'redux/features/order/orderAPI';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

const useOrderDetailAirportTransfer = () => {
  const dispatch = useAppDispatch();
  const {formAirportTransfer} = useAppSelector(appDataState);

  const handleSummarizeOrderAirportTransfer = () => {
    const payload: any = {
      order_type_id: 7,
      start_booking_date: formAirportTransfer.pickup_date,
      start_booking_time: formAirportTransfer.pickup_time,

      rental_delivery_id: formAirportTransfer?.pickup_location?.id,
      rental_return_id: formAirportTransfer?.dropoff_location?.id,
      adult_passenger: formAirportTransfer?.adults,
      child_passenger: formAirportTransfer?.child,
      large_suitcase: formAirportTransfer?.large_suitcase,
      regular_suitcase: formAirportTransfer?.suitcase,
    };
    console.log('payload airport summary ', payload);
    dispatch(getSummaryOrder(payload));
  };

  useFocusEffect(
    useCallback(() => {
      handleSummarizeOrderAirportTransfer();
    }, [
      formAirportTransfer.pickup_date,
      formAirportTransfer.pickup_time,
      formAirportTransfer?.airport_transfer_package_id,
      formAirportTransfer.pickup_location?.location_id,
      formAirportTransfer.sub_service_id,
      formAirportTransfer?.adults,
      formAirportTransfer?.child,
      formAirportTransfer?.large_suitcase,
      formAirportTransfer?.suitcase,
    ]),
  );

  return {};
};

export default useOrderDetailAirportTransfer;
