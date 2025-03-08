import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {theme} from 'utils';
import {t} from 'i18next';
import {rowCenter} from 'utils/mixins';
import {h1, h4} from 'utils/styles';
import CustomTextInput from 'components/TextInput';
import Button from 'components/Button';
import {sendCallCenter} from 'redux/features/appData/appDataAPI';
import {useAppDispatch} from 'redux/hooks';
import {showToast} from 'utils/Toast';
import { useTranslation } from 'react-i18next';

interface IForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface IFormError {
  error_name: string;
  error_email: string;
  error_subject: string;
  error_message: string;
}
const ContactUs = () => {
  const [form, setForm] = useState<IForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loader, setLoader] = useState(false);

  const [formError, setFormError] = useState<IFormError>({
    error_email: '',
    error_message: '',
    error_name: '',
    error_subject: '',
  });
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const handleSend = async () => {
    let status = true;
    const _errorMessage: any = {};
    Object.keys(form).map((x) => {
      if (form[x as keyof IForm] === '') {
        status = false;
        // _errorMessage[`error_${x}`] = `${x} tidak boleh kosong`;
        if(x === 'name') {
          _errorMessage[`error_${x}`] = t('contact-us.error.name');
        }
        if(x === 'message') {
          _errorMessage[`error_${x}`] = t('contact-us.error.critic');
        }
        if(x === 'email') {
          _errorMessage[`error_${x}`] = t('contact-us.error.email');
        }
        if(x === 'subject') {
          _errorMessage[`error_${x}`] = t('contact-us.error.topic');
        }
      }
    });
    setFormError(_errorMessage);
    if (!status) return;
    setLoader(true)
    const res = await dispatch(sendCallCenter(form));

    if (res.type.includes('fulfilled')) {
      showToast({
        title: t('contact-us.toast.title_success'),
        message: t('contact-us.toast.message_success'),
        type: 'success',
      });
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setFormError({
        error_email: '',
        error_message: '',
        error_name: '',
        error_subject: '',
      });
    } else {
      showToast({
        title: t('contact-us.toast.title_error'),
        message: t('contact-us.toast.message_error'),
        type: 'warning',
      });
    }
    setLoader(false)
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', marginTop: 30}}>
      <ScrollView>
        <Text style={[h1, styles.title]}>{t('tab_help_center.3.title')}</Text>
        <View style={{marginTop: 20}} />
        <CustomTextInput
          title={t('contact-us.title.name')!}
          placeholder={t('contact-us.placeholder.name')!}
          value={form.name}
          errorMessage={formError.error_name}
          onChangeText={v => {
            setForm({...form, name: v});
            setFormError({...formError, [`error_name`]: ''});
          }}
        />
        <View style={{marginTop: 20}} />
        <CustomTextInput
          title={t('contact-us.title.email')!}
          value={form.email}
          placeholder={t('contact-us.placeholder.email')!}
          errorMessage={formError.error_email}
          keyboardType="email-address"
          onChangeText={v => {
            setForm({...form, email: v});
            setFormError({...formError, [`error_email`]: ''});
          }}
        />
        <View style={{marginTop: 20}} />

        <CustomTextInput
          title={t('contact-us.title.topic')!}
          value={form.subject}
          placeholder={t('contact-us.placeholder.topic')!}
          errorMessage={formError.error_subject}
          onChangeText={v => {
            setForm({...form, subject: v});
            setFormError({...formError, [`error_subject`]: ''});
          }}
        />

        <View style={{marginTop: 20}} />
        <CustomTextInput
          title={t('contact-us.title.critic')!}
          placeholder={t('contact-us.placeholder.critic')!}
          value={form.message}
          errorMessage={formError.error_message}
          onChangeText={v => {
            setForm({...form, message: v});
            setFormError({...formError, [`error_message`]: ''});
          }}
          multiline
          numberOfLines={10}
          textAreastyle={styles.textArea}
        />

        <Button
          _theme="orange"
          title={t('contact-us.btn.send')!}
          onPress={handleSend}
          styleWrapper={{marginTop: 20}}
          isLoading={loader}
        />
      </ScrollView>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    // alignSelf: 'center',
    color: theme.colors.navy,
    marginTop: 20,
  },
  header: {
    paddingVertical: 16,
    borderColor: '#C4C4C4',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  headerText: {
    fontSize: 14,
  },
  headerTextRotate: {
    transform: [{rotate: '180deg'}],
    fontSize: 12,
  },
  content: {
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  textArea: {
    height: 328,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
});
