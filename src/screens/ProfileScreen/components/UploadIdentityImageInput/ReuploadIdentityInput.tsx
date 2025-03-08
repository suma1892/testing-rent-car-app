import {h4} from 'utils/styles';
import {ic_identity, ic_reupload, ic_rounded_close} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {memo} from 'react';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import { useTranslation } from 'react-i18next';

type Props = {
  onPress: () => void;
  onDelete: () => void;
  selected?: string;
  selectedImageLabel: string;
};

const ReuploadIdentityInput: React.FC<Props> = ({
  selected,
  selectedImageLabel,
  onPress,
  onDelete,
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.container, {borderColor: '#F1A33A'}]}>
      <View style={rowCenter}>
        <Image
          source={selected ? ic_identity : ic_reupload}
          style={styles.checkImage}
          resizeMode="contain"
        />
        <Text style={[h4, styles.reuploadLabel]}>
          {selected ? selectedImageLabel : t('profile.reupload')}
        </Text>
      </View>

      {selected ? (
        <TouchableOpacity onPress={onDelete}>
          <Image source={ic_rounded_close} style={{width: 15, height: 15}} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={{
            borderWidth: 1,
            paddingVertical: 3,
            paddingHorizontal: 8,
            borderColor: theme.colors.grey5,
            borderRadius: 5,
          }}>
          <Text style={[h4, {fontSize: 12, color: theme.colors.black}]}>
            {t('profile.select_file')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(ReuploadIdentityInput);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderRadius: 6,
    paddingHorizontal: '3%',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  checkImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  label: {
    color: theme.colors.blue,
    fontSize: 14,
  },
  reuploadLabel: {
    color: theme.colors.black,
    fontSize: 14,
    width: '70%',
  },
  closeImage: {
    width: 15,
    height: 15,
  },
});
