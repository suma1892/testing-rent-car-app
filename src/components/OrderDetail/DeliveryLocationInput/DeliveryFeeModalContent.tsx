import {h5} from 'utils/styles';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const DeliveryFeeModalContent: React.FC = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[h5]}>
        {t('detail_order.formDetail.delivery_fee_is_charged')}
      </Text>
    </View>
  );
};

export default DeliveryFeeModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
});
