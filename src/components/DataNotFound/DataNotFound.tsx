import {h1, h4} from 'utils/styles';
import {ic_not_found} from 'assets/icons';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {WINDOW_HEIGHT} from 'utils/mixins';
import {ReactNode} from 'react';

type DataNotFoundProps = {
  title?: string;
  description?: string;
  buttonComponent?: ReactNode;
  imageComponent?: ReactNode;
};

const DataNotFound: React.FC<DataNotFoundProps> = ({
  buttonComponent,
  imageComponent,
  ...rest
}) => {
  const {t} = useTranslation();
  const {
    title = t('myBooking.noOrder'),
    description = t('myBooking.noRental'),
  } = rest;

  return (
    <View style={styles.container}>
      {!!imageComponent ? (
        imageComponent
      ) : (
        <Image
          source={ic_not_found}
          style={{width: 150, height: 143, marginBottom: 30}}
          resizeMode="cover"
        />
      )}
      {title && <Text style={[h1, {textAlign: 'center'}]}>{title}</Text>}
      <Text
        style={[
          h4,
          {color: theme.colors.grey5, marginBottom: 30, textAlign: 'center'},
        ]}>
        {description}
      </Text>

      {buttonComponent}
    </View>
  );
};

export default DataNotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_HEIGHT / 1.5,
  },
});
