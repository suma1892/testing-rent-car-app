import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {URL_IMAGE} from '@env';
import {ic_read_message, ic_unread} from 'assets/icons';
import moment from 'moment';
import Animated, {Layout} from 'react-native-reanimated';
import {theme} from 'utils';
import {WINDOW_WIDTH, iconCustomSize} from 'utils/mixins';
import {
  FONT_SIZE_10,
  FONT_SIZE_12,
  FONT_WEIGHT_REGULAR,
  FONT_WEIGHT_SEMI_BOLD,
} from 'utils/typography';
import {ItemChat} from 'types/websocket.types';
import Config from 'react-native-config';

const RenderItemChat = ({
  item,
  openImageInFullScreen,
  isUser,
  showDate,
}: {
  item: ItemChat;
  openImageInFullScreen: (file: string) => void;
  isUser: boolean;
  showDate?: boolean;
}) => {
  const renderDateHeader = () => {
    if (!showDate) return null;

    return (
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateHeaderText}>
          {moment(item.created_at).calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: 'dddd, DD MMMM YYYY',
            sameElse: 'dddd, DD MMMM YYYY',
          })}
        </Text>
      </View>
    );
  };
  return (
    <Animated.View layout={Layout.springify()}>
      {renderDateHeader()}
      {item?.file ? (
        <TouchableOpacity
          onPress={() => openImageInFullScreen(Config.URL_IMAGE + item?.file)}
          style={[
            isUser ? styles.outbox : styles.inbox,
            styles.chatItemWrapper,
          ]}>
          <Image
            source={{uri: Config.URL_IMAGE + item?.file}}
            style={{
              width: 150,
              maxWidth: WINDOW_WIDTH / 1.5,
              height: 150,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          {item?.message && (
            <View style={{alignSelf: 'flex-start', marginTop: 10}}>
              <Text
                style={[
                  styles.dateText,
                  {
                    fontWeight: FONT_WEIGHT_SEMI_BOLD,
                    color: isUser ? theme.colors.white : theme.colors.black,
                  },
                ]}>
                {item?.message}
              </Text>
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[styles.dateText, !isUser && {color: '#9C9CA3'}]}>
              {moment(item.created_at).format('HH:mm')}
            </Text>
            <Image
              source={item?.is_read ? ic_read_message : ic_unread}
              style={iconCustomSize(15)}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={[styles.messageItem, isUser ? styles.outbox : styles.inbox]}>
          <View style={{maxWidth: WINDOW_WIDTH / 2}}>
            <Text
              style={[
                styles.messageText,
                {
                  color: isUser ? theme.colors.white : theme.colors.black,
                },
              ]}>
              {item.message}
            </Text>
          </View>
          <Text style={[styles.dateText, !isUser && {color: '#9C9CA3'}]}>
            {moment(item.created_at).format('HH:mm')}
          </Text>
          <Image
            source={item?.is_read ? ic_read_message : ic_unread}
            style={iconCustomSize(15)}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default memo(RenderItemChat);

const styles = StyleSheet.create({
  chatItemWrapper: {
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue,
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  outbox: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.blue,
  },
  inbox: {
    alignSelf: 'flex-start',
    backgroundColor: '#97979733',
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: WINDOW_WIDTH / 1.5,
  },
  messageText: {
    fontSize: FONT_SIZE_12,
    fontWeight: FONT_WEIGHT_REGULAR,
    color: theme.colors.white,
    marginRight: 10,
    lineHeight: 19,
  },
  dateText: {
    fontSize: FONT_SIZE_10,
    fontWeight: FONT_WEIGHT_REGULAR,
    color: theme.colors.white,
    marginRight: 4,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: FONT_SIZE_10,
    color: theme.colors.grey1,
    backgroundColor: theme.colors.grey6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
