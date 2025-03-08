import Animated from 'react-native-reanimated';
import React from 'react';
import {ic_bronze, ic_gold, ic_platinum} from 'assets/icons';
import {idrFormatter} from 'utils/functions';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {UserLevel} from './left-align';
import {useTranslation} from 'react-i18next';
import {
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type ImageSourcePropType,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import type {AnimateProps} from 'react-native-reanimated';
import * as Progress from 'react-native-progress';
import i18next from 'i18next';
import {currencyFormat} from 'utils/currencyFormat';

interface Props extends AnimateProps<ViewProps> {
  style?: StyleProp<ViewStyle>;
  index?: number;
  pretty?: boolean;
  showIndex?: boolean;
  img?: ImageSourcePropType;
  item: UserLevel;
}

export const SBItem: React.FC<Props> = props => {
  const {
    style,
    showIndex = true,
    index,
    pretty,
    img,
    testID,
    item,
    ...animatedViewProps
  } = props;
  const {t} = useTranslation();

  const getIcon = () => {
    if (item?.current_level === 'Platinum') {
      return ic_platinum;
    }
    if (item?.current_level === 'Gold') {
      return ic_gold;
    }
    if (item?.current_level === 'Bronze') {
      return ic_bronze;
    }
  };

  const getColor = () => {
    if (item?.current_level === 'Platinum') {
      return '#D6540B';
    }
    if (item?.current_level === 'Gold') {
      return '#F1A33A';
    }
    if (item?.current_level === 'Bronze') {
      return '#D6540B';
    }
  };

  function calculateProgress(
    totalTransaction: number,
    nextLevelTotalTransaction: number,
  ) {
    if (nextLevelTotalTransaction !== 0) {
      const progressPercentage =
        (totalTransaction / nextLevelTotalTransaction) * 100;

      const progress = Math.min(progressPercentage, 100);
      return progress / 100;
    } else {
      return 0;
    }
  }
  const getBadge = () => {
    if (i18next.language !== 'cn') {
      return item?.current_level;
    }
    if (item?.current_level === 'Gold') {
      return '金牌';
    }
    if (item?.current_level === 'Platinum') {
      return '白金';
    }
    if (item?.current_level === 'Bronze') {
      return '青铜';
    }
  };

  if (!item) {
    return <Text>{t('loyalty.no_loyalty')}</Text>;
  }
  return (
    <LongPressGestureHandler>
      <Animated.View
        testID={testID}
        style={{flex: 1, backgroundColor: '#fff'}}
        {...animatedViewProps}>
        <View style={styles.itemContainer}>
          <View
            style={{
              height: 5,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: getColor(),
            }}></View>
          <View style={styles.itemWrapper}>
            <Image source={getIcon()} resizeMode="cover" style={styles.image} />
            <View style={{width: '80%', marginLeft: 10}}>
              <View style={[rowCenter, {justifyContent: 'space-between'}]}>
                <Text>{getBadge()}</Text>
                <Text>{currencyFormat(item?.current_total_transaction)}</Text>
              </View>
              <Progress.Bar
                progress={calculateProgress(
                  item?.current_total_transaction,
                  item?.next_level_total_transaction,
                )}
                width={null}
                style={{marginVertical: 10}}
                borderColor="#fff"
                unfilledColor={theme.colors.grey6}
                color={getColor()}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.grey4,
                  marginBottom: 20,
                }}>
                {t('loyalty.make_trx_until_to_get', {
                  total: currencyFormat(item?.next_level_total_transaction),
                  tier: item?.next_level,
                })}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: 'auto',
    borderRadius: 10,
    padding: 5,
  },
  title: {
    color: theme.colors.white,
    fontSize: 13,
  },
  description: {
    color: theme.colors.white,
    fontSize: 10,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
  },
});
