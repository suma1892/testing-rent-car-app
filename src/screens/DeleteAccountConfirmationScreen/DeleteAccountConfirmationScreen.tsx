import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox/Checkbox';
import React, {useEffect, useState} from 'react';
import {h1, h2, h5} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {sendOTPAccountDeletetion} from 'redux/features/deleteAccount/deleteAccountAPI';
import {useAppDispatch} from 'redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const DeleteAccountConfirmationScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('settings.profile')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation, t]);

  const notes = [t('delete_account.note_1'), t('delete_account.note_2')];

  const handleDeleteAccount = () => {
    dispatch(sendOTPAccountDeletetion());
    navigation.navigate('DeleteAccountOtp');
  };

  return (
    <View style={styles.container}>
      <Text style={[h2, {marginBottom: 10, fontSize: 20}]}>
        {t('delete_account.title')}
      </Text>
      <Text style={h5}>{t('delete_account.description_1')}</Text>
      <Text style={h5}>{t('delete_account.important_notes')}</Text>
      <View style={{marginLeft: 10, marginBottom: 10}}>
        {notes.map((note, i) => (
          <Text key={`note_${i}`} style={h5}>
            &#x2022; {note}
          </Text>
        ))}
      </View>
      <Text style={h5}>{t('delete_account.description_2')}</Text>

      <Checkbox
        label={t('delete_account.confirm_statement')}
        checked={checked}
        onChange={setChecked}
        customContainerStyle={{
          marginHorizontal: 0,
          alignItems: 'flex-start',
          marginTop: 25,
        }}
        customCheckboxStyle={iconCustomSize(15)}
      />

      <Button
        _theme="navy"
        title={`${t('global.button.yes')}, ${t(
          'global.button.delete_account',
        )}`}
        onPress={handleDeleteAccount}
        styleWrapper={{marginTop: 20}}
        disabled={!checked}
      />
    </View>
  );
};

export default DeleteAccountConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: '5%',
  },
});
