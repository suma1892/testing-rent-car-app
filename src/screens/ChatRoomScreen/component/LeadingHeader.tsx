import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ic_arrow_left, ic_ask_cs, ic_gnr_chat} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize} from 'utils/mixins';
import {
  FONT_SIZE_12,
  FONT_WEIGHT_SEMI_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const LeadingHeader = ({
  room_type,
  order_key,
}: {
  room_type: string;
  order_key: string;
}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <View style={[rowCenter, {justifyContent: 'space-between', margin: 16}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={[rowCenter]}>
          <Image
            source={ic_arrow_left}
            style={[iconCustomSize(20), {marginRight: 10}]}
          />
          <View style={[rowCenter]}>
            <Image
              source={ic_ask_cs}
              style={[iconCustomSize(40), {marginRight: 10}]}
            />
            <View>
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_SEMI_BOLD,
                }}>
                {room_type === 'cs-order'
                  ? t('myInbox.order_help')
                  : t('myInbox.header')}
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZE_12,
                  fontWeight: FONT_WEIGHT_REGULAR,
                  color: theme.colors.grey4,
                }}>
                {room_type === 'cs-order' ? order_key : t('myInbox.active')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LeadingHeader;

const styles = StyleSheet.create({});
