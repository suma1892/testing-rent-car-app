import Button from 'components/Button';
import ExtendOrderModalContent from './ExtendOrderModalContent';
import React from 'react';
import {showBSheet} from 'utils/BSheet';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

const ExtendOrderButtonAction: React.FC = () => {
  const {t} = useTranslation();

  const handleExtendOrder = () => {
    showBSheet({
      snapPoint: ['60%', '60%'],
      content: <ExtendOrderModalContent onSubmit={() => {}} />,
    });
  };

  return (
    <View style={{marginBottom: 10}}>
      <Button
        _theme="white"
        lineColor="navy"
        title={t('global.button.extendOrder')}
        onPress={handleExtendOrder}
      />
    </View>
  );
};

export default ExtendOrderButtonAction;
