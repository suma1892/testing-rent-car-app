import * as React from 'react';

import {SBItem} from './SBItem';

import type {ScaledSize} from 'react-native';
import {Dimensions} from 'react-native';
import {getLoyalty} from 'redux/effects';
import {showToast} from 'utils/Toast';

export const HEADER_HEIGHT = 100;

export const ElementsText = {
  AUTOPLAY: 'AutoPlay',
};

export const window: ScaledSize = false
  ? {
      ...Dimensions.get('window'),
      width: 700,
    }
  : Dimensions.get('window');

export interface IDataCarousel {
  level: 'Bronze' | 'Gold' | 'Platinum';
  price: number;
  icon: any;
  color: `#${string}`;
}
export interface UserLevel {
  current_total_transaction: number;
  current_level: string;
  next_level: string;
  next_level_total_transaction: number;
}

function LeftAlign({}) {
  const [loyaltyData, setLoyaltyData] = React.useState<UserLevel>();
  React.useEffect(() => {
    const func = async () => {
      try {
        const res = await getLoyalty();
        setLoyaltyData(res);
      } catch (error) {
        showToast({
          message: 'alert.warning',
          title: 'alert.warning',
          type: 'warning',
        });
      }
    };

    func();
    return () => {};
  }, []);

  return <SBItem item={loyaltyData!} />;
}

export default LeftAlign;
