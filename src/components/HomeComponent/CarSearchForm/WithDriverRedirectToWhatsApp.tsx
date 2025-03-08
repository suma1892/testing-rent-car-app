import Button from 'components/Button';
import {h5} from 'utils/styles';
import {ic_wa_2} from 'assets/icons';
import {img_with_driver_guide_1, img_with_driver_guide_2} from 'assets/images';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  View,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  Linking,
} from 'react-native';
import { showToast } from 'utils/Toast';

type GuideItem = {
  id: number;
  description: string;
  img: ImageSourcePropType;
};

const WithDriverRedirectToWhatsApp: React.FC = () => {
  const {t} = useTranslation();

  const guideList = [
    {
      id: 1,
      description: t('Home.withDriver.description_1'),
      img: img_with_driver_guide_1,
    },
    {
      id: 2,
      description: t('Home.withDriver.description_2'),
      img: img_with_driver_guide_2,
    },
    {
      id: 3,
      description: t('Home.withDriver.description_3'),
      img: img_with_driver_guide_1,
    },
  ];

  const renderItem = ({item}: {item: GuideItem}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={item.img} resizeMode="contain" style={styles.image} />
        </View>

        <Text style={[h5, styles.description]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={guideList} horizontal renderItem={renderItem} />

      <Button
        _theme="navy"
        title={t('Home.daily.continue_to_whatsapp')}
        onPress={() => {
          const url = 'whatsapp://send?phone=6281262511511';
          Linking.openURL(url).catch(err => {
            let message = err?.message
            if (message?.includes(`Could not open URL '${url}': No Activity found to handle Intent`)) {
              message = t('global.alert.error_redirect_to_whatsapp')
            }

            showToast({
              title: t('global.alert.failed'),
              type: 'error',
              message,
            });
          });
        }}
        styleWrapper={{
          marginTop: 40,
        }}
        rightIcon={ic_wa_2}
      />
    </View>
  );
};

export default WithDriverRedirectToWhatsApp;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  imageContainer: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    justifyContent: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
  },
  itemContainer: {
    width: 170,
    marginRight: 10,
  },
  description: {marginVertical: 10, fontSize: 14},
});
