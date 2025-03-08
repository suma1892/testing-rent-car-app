import DriverSelection from '../DriverSelection/DriverSelection';
import WithDriverForm from '../CarSearchForm/WithDriverForm';
import WithDriverRedirectToWhatsApp from '../CarSearchForm/WithDriverRedirectToWhatsApp';
import WithoutDriverForm from '../CarSearchForm/WithoutDriverForm';
import {Facility} from 'types/rental-location.types';
import {useAppDispatch} from 'redux/hooks';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  appDataState,
  resetFormDaily,
} from 'redux/features/appData/appDataSlice';

type DailyLayoutProps = {
  reset?: boolean;
  facilities?: Facility[];
};

const DailyLayout: FC<DailyLayoutProps> = ({reset = true, facilities}) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {globalConfig, formDaily} = useSelector(appDataState);
  const [withDriver, setWithDriver] = useState(formDaily.with_driver);

  const withDriverFormConfigValue = useMemo(
    () =>
      globalConfig.find(config => config.key === 'with_driver_form')?.value ||
      false,
    [globalConfig],
  );

  const WithDriverFormComponent = useMemo(
    () =>
      withDriverFormConfigValue ? WithDriverForm : WithDriverRedirectToWhatsApp,
    [withDriverFormConfigValue],
  );

  const resetForm = useCallback(() => {
    if (reset) {
      dispatch(
        resetFormDaily({
          with_driver: false,
        }),
      );
      setWithDriver(false);
    }
  }, [reset, dispatch]);

  useEffect(() => {
    setWithDriver(formDaily.with_driver);
  }, [formDaily.with_driver]);

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        resetForm();
      }
    }, [isFocused, resetForm]),
  );

  return (
    <View style={{flex: 1, marginHorizontal: 16, marginTop: 16}}>
      <DriverSelection
        onSelect={setWithDriver}
        selected={withDriver ? 2 : 1}
        facilities={facilities}
      />
      {withDriver ? (
        <WithDriverFormComponent reset={reset} />
      ) : (
        <WithoutDriverForm reset={reset} />
      )}
    </View>
  );
};

export default memo(DailyLayout);
