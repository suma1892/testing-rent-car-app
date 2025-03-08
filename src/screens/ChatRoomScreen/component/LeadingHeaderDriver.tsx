import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ic_arrow_left, ic_gnr_chat} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize} from 'utils/mixins';
import {
  FONT_SIZE_12,
  FONT_WEIGHT_SEMI_BOLD,
  FONT_WEIGHT_REGULAR,
} from 'utils/typography';
import {useNavigation} from '@react-navigation/native';
import UserInitial from 'components/UserInitial';
import {Room} from 'types/websocket.types';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppSelector} from 'redux/hooks';

const LeadingHeaderDriver = ({room}: {room: Room}) => {
  const navigation = useNavigation();
  const userProfile = useAppSelector(appDataState).userProfile;

  const cust_name =
    room?.participants?.filter(x => x?.user_name !== userProfile?.name)?.[0]
      ?.user_name || room?.participants?.[1]?.user_name || room?.driver_name;

  console.log('cust_name ', cust_name);
  console.log('room?.participants ', room?.participants);

  return (
    <View style={[rowCenter, {margin: 16}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={[rowCenter]}>
          <Image
            source={ic_arrow_left}
            style={[iconCustomSize(20), {marginRight: 10}]}
          />
          <UserInitial name={cust_name || ''} size={40} />

          <Text
            style={{
              fontSize: FONT_SIZE_12,
              fontWeight: FONT_WEIGHT_SEMI_BOLD,
              marginLeft: 10,
            }}>
            {cust_name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LeadingHeaderDriver;

const styles = StyleSheet.create({});
