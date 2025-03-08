import LandingTimeOptionsModalContent from './LandingTimeOptionsModalContent';
import React, {FC} from 'react';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {showBSheet} from 'utils/BSheet';
import {Text, TouchableOpacity, View} from 'react-native';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';

type LandingTimeInputProps = {
  value: string;
  onSelect: ({hours, minutes}: {hours: string; minutes: string}) => void;
};

const LandingTimeInput: FC<LandingTimeInputProps> = ({value, onSelect}) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {formDaily, formAirportTransfer, sub_service_type} =
    useAppSelector(appDataState);

  const showLandingTimeOptionsModal = () => {
    showBSheet({
      snapPoint: ['65%', '65%'],
      content: (
        <LandingTimeOptionsModalContent
          value={value}
          onSubmit={val => {
            onSelect(val);
            dispatch(toggleBSheet(false));
          }}
        />
      ),
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={showLandingTimeOptionsModal}
        style={{
          paddingVertical: 13,
          borderColor: theme.colors.grey5,
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 10,
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            color: value ? theme.colors.black : theme.colors.grey4,
          }}>
          {value
            ? `${
                value.slice(0, value.length / 2) +
                ' : ' +
                value.slice(-value.length / 2)
              }`
            : t('detail_order.formDetail.desc_WITA', {
                value:
                  // sub_service_type === 'Airport Transfer'
                  //   ? formAirportTransfer?.pickup_location?.time_zone ||
                  //     formAirportTransfer?.dropoff_location?.id
                  //   : formDaily?.selected_location?.time_zone,
                  getIndonesianTimeZoneName({
                    lang: i18next.language,
                    timezone:
                      sub_service_type === 'Airport Transfer'
                        ? formAirportTransfer?.pickup_location?.time_zone ||
                          formAirportTransfer?.dropoff_location?.id
                        : formDaily?.selected_location?.time_zone,
                  }),
              })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingTimeInput;
