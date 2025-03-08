import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {FONT_SIZE_10, FONT_WEIGHT_SEMI_BOLD} from 'utils/typography';
import {theme} from 'utils';
import {BigBoolean} from 'types/global.types';
import {useTranslation} from 'react-i18next';
import {WINDOW_WIDTH} from 'utils/mixins';

const TrailingHeader = ({
  onPress,
  isActiveRoom,
}: {
  onPress: any;
  isActiveRoom: BigBoolean;
}) => {
  const {t} = useTranslation();
  return (
    <>
      {isActiveRoom ? (
        <TouchableOpacity style={styles.btnEndChat} onPress={onPress}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: FONT_WEIGHT_SEMI_BOLD,
              textAlign: 'center',
            }}>
            {t('myInbox.end')}
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
};

export default TrailingHeader;

const styles = StyleSheet.create({
  btnEndChat: {
    height: 31,
    width: WINDOW_WIDTH / 4.5,
    marginRight: 16,
    borderWidth: 1,
    borderColor: theme.colors.navy,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
