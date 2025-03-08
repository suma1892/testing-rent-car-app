import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {
  ic_user_placeholder,
  ic_message_inactive,
  ic_chat_active,
  ic_chat,
} from 'assets/icons';
import {theme} from 'utils';
import {rowCenter, iconCustomSize} from 'utils/mixins';
import {h1, h4, h5} from 'utils/styles';
import {API_MESSENGER} from '@env';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Room} from 'types/websocket.types';
import {useAppSelector} from 'redux/hooks';
import {showToast} from 'utils/Toast';
import Config from 'react-native-config';
import {useTranslation} from 'react-i18next';

const DriverInfo = ({
  driverData,
  navigateToChat,
  activeRoom,
}: {
  driverData: any;
  navigateToChat: () => void;
  activeRoom: Room;
}) => {
  const {t} = useTranslation();

  return (
    <View
      style={[
        rowCenter,
        {
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: theme.colors.grey5,
          padding: 20,
          borderRadius: 10,
          marginTop: 24,
        },
      ]}>
      {driverData?.name ? (
        <View style={[rowCenter, {justifyContent: 'space-between'}]}>
          <Image
            source={{uri: Config.URL_IMAGE + driverData?.PersonalInfos?.selfie}}
            style={[iconCustomSize(50), {borderRadius: 8}]}
          />
          <View style={{marginHorizontal: 8}}>
            <Text style={[h1]}>{driverData?.name}</Text>
            <View style={{width: WINDOW_WIDTH - 200}}>
              <Text style={[h5]}>{driverData?.phone}</Text>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.grey6,
                marginVertical: 5,
              }}
            />
            <Text style={[h4]}>
              {driverData?.vehicle?.name} ·{' '}
              {driverData?.vehicle?.license_number}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[rowCenter, {justifyContent: 'space-between'}]}>
          <Image source={ic_user_placeholder} style={iconCustomSize(50)} />
          <View style={{marginHorizontal: 8}}>
            <Text style={[h1]}>{t('myBooking.find_driver')}</Text>
            <View style={{width: WINDOW_WIDTH - 200}}>
              <Text style={[h4]}>{t('myBooking.find_driver_desc')}</Text>
            </View>
          </View>
        </View>
      )}
      <TouchableOpacity
        disabled={!activeRoom?.name && !driverData?.id}
        onPress={() => {
          navigateToChat();
        }}>
        <Image
          source={
            !activeRoom?.name && !driverData?.id ? ic_chat : ic_chat_active
          }
          style={iconCustomSize(28)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DriverInfo;

const styles = StyleSheet.create({});
