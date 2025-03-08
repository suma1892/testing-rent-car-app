import React, {useState} from 'react';
import {h1, h2, h4} from 'utils/styles';
import {ic_blue_check, ic_info2, ic_uncheck} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {useTranslation} from 'react-i18next';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppSelector} from 'redux/hooks';

type HandleCheckDepositoProps = {
  checked?: boolean;
  onPress: (val: boolean) => void;
};

const HandleCheckDeposito: React.FC<HandleCheckDepositoProps> = ({checked = false, onPress}) => {
  const {t} = useTranslation();
  const [checkDeposito, setCheckDeposito] = useState(checked);
  const formDaily = useAppSelector(appDataState).formDaily;
  const handleShowInfoDeposito = () => {
    showBSheet({
      snapPoint: ['50%', '75%'],
      content: (
        <View style={{margin: 16}}>
          <Text style={[h1, {marginVertical: 15, fontSize: 20}]}>
            {t('detail_order.header_deposito')}
          </Text>
          <Text style={[h4, {lineHeight: 24}]}>
            {t('detail_order.desc_deposito', {
              value: formDaily?.with_driver ? '25' : '50',
            })}
          </Text>
        </View>
      ),
    });
  };

  return (
    <View style={[rowCenter, {marginVertical: 18}]}>
      <TouchableOpacity
        style={rowCenter}
        onPress={() => {
          onPress(!checkDeposito);
          setCheckDeposito(!checkDeposito);
        }}>
        <Image
          source={checkDeposito ? ic_blue_check : ic_uncheck}
          style={iconSize}
        />
        <Text style={[h2, {fontSize: 12, marginLeft: 5}]}>
          {t('detail_order.checkbox_deposito')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginLeft: 9}}
        onPress={handleShowInfoDeposito}>
        <Image source={ic_info2} style={iconSize} />
      </TouchableOpacity>
    </View>
  );
};

export default HandleCheckDeposito;
