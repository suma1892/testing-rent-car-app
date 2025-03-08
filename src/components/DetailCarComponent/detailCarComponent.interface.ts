import {ImageSourcePropType} from 'react-native';
import {Category, IRentalZone} from 'types/order';
import {ReactElement} from 'react';

export type ZoneDetailProps = {
  pinpoinImage: ReactElement;
  free: boolean;
  data?: IRentalZone;
  label: string;
};

export type CostLabelProps = {
  free: boolean;
  data?: IRentalZone;
};

export type AdditionalFeeModalContentProps = {
  data?: Category[];
};

export type ConditionDetailProps = {
  icon: ImageSourcePropType;
  title: string;
  show: boolean;
};

export type InfoProps = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  show?: boolean;
}

export type BottomPriceButtonActionProps = {
  disabled: boolean;
}