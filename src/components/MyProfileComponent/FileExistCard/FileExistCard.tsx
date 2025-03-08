import RemoveIdentityWarningModalContent from './RemoveIdentityWarningModalContent';
import {h4} from 'utils/styles';
import {ic_check2, ic_rounded_close} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {rowCenter} from 'utils/mixins';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type Props = {
  onRemoveImage: () => void;
};

const FileExistCard: React.FC<Props> = ({onRemoveImage}) => {
  const {t} = useTranslation();

  const openRemoveImageModal = () => {
    showBSheet({
      content: (
        <RemoveIdentityWarningModalContent
          onCancel={openRemoveImageModal}
          onOk={() => {
            onRemoveImage();
            openRemoveImageModal();
          }}
        />
      ),
      snapPoint: ['35%', '35%'],
    });
  };

  return (
    <View style={styles.container}>
      <View style={rowCenter}>
        <Image
          source={ic_check2}
          style={styles.checkImage}
          resizeMode="contain"
        />
        <Text style={[h4, styles.label]}>{t('profile.data_received')}</Text>
      </View>

      <TouchableOpacity onPress={openRemoveImageModal}>
        <Image source={ic_rounded_close} style={styles.closeImage} />
      </TouchableOpacity>
    </View>
  );
};

export default FileExistCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    borderRadius: 6,
    paddingHorizontal: '3%',
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
  closeImage: {
    width: 15,
    height: 15,
  },
});
