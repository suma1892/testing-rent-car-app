import {h1} from 'utils/styles';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  ic_image_file,
  ic_info_error,
  ic_rounded_close,
  ic_rounded_image_file,
} from 'assets/icons';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface IProps {
  onPress: () => void;
  onDelete: () => void;
  selected?: string;
  errorMessage?: string;
  label?: string;
  selectedImageLabel: string;
  containerStyle?: ViewStyle;
}

const UploadImageInput: React.FC<IProps> = ({
  onPress,
  selected,
  errorMessage,
  onDelete,
  label,
  selectedImageLabel,
  containerStyle = {marginTop: 10},
}) => {
  const {t} = useTranslation();

  return (
    <View style={containerStyle}>
      {label && (
        <View style={[rowCenter]}>
          <Text style={[h1, {fontSize: 12, marginBottom: 10, marginTop: 15}]}>
            {label}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.uploadInputContainer} onPress={onPress}>
        <Image source={ic_image_file} style={{width: 29, height: 37}} />
        <Text>
          {t('global.upload_your_image_here')}{' '}
          {/* <Text style={[h1, {fontSize: 14, color: theme.colors.blue}]}>
            {t('global.browse')}
          </Text> */}
        </Text>
      </TouchableOpacity>

      {selected && (
        <View style={styles.uploadedImage}>
          <View style={styles.imageDetail}>
            <Image
              source={ic_rounded_image_file}
              style={{width: 28, height: 28, marginRight: 10}}
              resizeMode="contain"
            />
            <Text style={[h1, {fontSize: 14}]}>{selectedImageLabel}</Text>
          </View>

          <TouchableOpacity onPress={onDelete}>
            <Image source={ic_rounded_close} style={{width: 15, height: 15}} />
          </TouchableOpacity>
        </View>
      )}

      {errorMessage && (
        <View style={[rowCenter, {marginTop: 5}]}>
          <Image source={ic_info_error} style={iconCustomSize(15)} />
          <Text style={[h1, {fontSize: 12, color: theme.colors.red}]}>
            {' '}
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default UploadImageInput;

const styles = StyleSheet.create({
  uploadInputContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.grey3,
    borderRadius: 5,
    height: 165,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
