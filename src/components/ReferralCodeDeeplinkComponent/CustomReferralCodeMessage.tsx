import Button from 'components/Button';
import React, {FC} from 'react';
import {h1} from 'utils/styles';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type CustomReferralCodeMessageProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const CustomReferralCodeMessage: FC<CustomReferralCodeMessageProps> = ({
  title,
  description,
  image,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={[h1, styles.title]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        _theme="white"
        lineColor={theme.colors.navy}
        title={t('global.button.back_to_homepage')}
        onPress={() => navigation.navigate('MainTab')}
      />
    </View>
  );
};

export default CustomReferralCodeMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 190,
    height: 240,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.black,
  },
  description: {
    color: theme.colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
});
