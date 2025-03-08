import BSheetPasswordTextInput from '../BSheetPasswordTextInput/BSheetPasswordTextInput';
import Button from 'components/Button';
import React, {useState} from 'react';
import {h2} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

type PasswordConfirmationModalContentProps = {
  loading: boolean;
  onSubmit: (val: string) => void;
};

const PasswordConfirmationModalContent: React.FC<
  PasswordConfirmationModalContentProps
> = ({loading, onSubmit}) => {
  const {t} = useTranslation();
  const [password, setPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [loader, setLoader] = useState(false);
  return (
    <View style={styles.passwordModalContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text textBreakStrategy="simple" style={h2}>
            {t('Account.password')}
          </Text>
        </View>
      </View>

      <BSheetPasswordTextInput
        label={t('Account.insert_password_to_update')}
        placeholder={t('Account.your_password')}
        onChangeText={v => {
          setPassword(v);
          setErrorPassword('');
        }}
        errorMessage={errorPassword}
      />

      <Button
        _theme="navy"
        onPress={async () => {
          if (password) {
            setLoader(true);
            await onSubmit(password);
            setLoader(false);
          } else {
            setErrorPassword(`${t('global.alert.enter_password')}`);
          }
        }}
        title={t('global.button.confirm')}
        isLoading={loader}
      />
    </View>
  );
};

export default PasswordConfirmationModalContent;

const styles = StyleSheet.create({
  passwordModalContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
});
