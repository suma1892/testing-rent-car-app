import React, {memo} from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {ConditionDetailProps} from './detailCarComponent.interface';
import {h1, h4} from 'utils/styles';
import {iconCustomSize, iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {getIndonesianTimeZoneName, theme} from 'utils';
import {useAppSelector} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {vehiclesState} from 'redux/features/vehicles/vehiclesSlice';
import {
  ic_clock,
  ic_disable,
  ic_dog,
  ic_durian,
  ic_info_blue,
  ic_nosmoke,
} from 'assets/icons';
import i18n from 'assets/lang/i18n';
import {appDataState} from 'redux/features/appData/appDataSlice';

const ConditionDetail = ({icon, title, show}: ConditionDetailProps) => {
  if (show) {
    return (
      <View style={styles.conditionDetailContainer}>
        <Image source={icon} style={iconSize} />
        <Text style={styles.conditionTitle}>{title}</Text>
      </View>
    );
  }

  return null;
};

const CarConditions = () => {
  const {t} = useTranslation();
  const vehicleById = useAppSelector(vehiclesState).vehicleById;
  const formDaily = useAppSelector(appDataState).formDaily;
  const condition = !formDaily.with_driver ? 'without_driver' : 'with_driver';
  const operational = vehicleById?.garage_data?.operational?.find(
    x => x?.service === condition,
  );
  const showConditions = () => {
    showBSheet({
      content: (
        <View style={styles.conditionModalContentContainer}>
          <Text style={h1}>{t('carDetail.car_conditions')}</Text>
          <BottomSheetScrollView>
            <Text style={[h4, {lineHeight: 24}]}>
              {t('carDetail.durian_detail')}
            </Text>
          </BottomSheetScrollView>
        </View>
      ),
      snapPoint: ['25%', '50%'],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('carDetail.car_conditions')}</Text>
      <ConditionDetail
        icon={ic_nosmoke}
        title={t('carDetail.smoking')}
        show={!vehicleById.smoke_allowed}
      />
      <ConditionDetail
        icon={ic_disable}
        title={t('carDetail.disability')}
        show={vehicleById.disablility_allowed}
      />
      <ConditionDetail
        icon={ic_dog}
        title={t('carDetail.pet')}
        show={vehicleById.pet_allowed}
      />

      <TouchableOpacity
        style={styles.showConditionButton}
        onPress={showConditions}>
        <Image source={ic_durian} style={iconSize} resizeMode="contain" />
        <Text style={styles.labelDurian}>
          {t('carDetail.durian')}{' '}
          <Image
            source={ic_info_blue}
            style={iconCustomSize(12)}
            resizeMode="contain"
          />
        </Text>
      </TouchableOpacity>

      <ConditionDetail
        icon={ic_clock}
        title={`${t('carDetail.operational_hours')} ${
          operational?.start_time
        } - ${operational?.end_time} (${getIndonesianTimeZoneName({
          lang: i18n.language as any,
          timezone: vehicleById?.garage_data?.location_time_zone as any,
        })})`}
        show={operational?.outside_operational_status!}
      />
      <View style={styles.lineHorizontal} />
    </View>
  );
};

export default memo(CarConditions);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  title: {
    ...h1,
    marginBottom: 5,
  },
  conditionDetailContainer: {
    ...rowCenter,
    marginBottom: 17,
    alignItems: 'flex-start',
  },
  conditionTitle: {
    ...h4,
    marginLeft: 10,
  },
  lineHorizontal: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey6,
    marginTop: 10,
  },
  showConditionButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 7,
  },
  conditionModalContentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
    paddingHorizontal: '5%',
  },
  labelDurian: {
    ...h4,
    marginLeft: 10,
    paddingBottom: 10,
    width: '90%',
  },
});
