import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {theme} from 'utils';
import {FONT_SIZE_12} from 'utils/typography';
import CustomTextInput from 'components/TextInput';
import {showBSheet} from 'utils/BSheet';
import SelectCountryCodeModalContent from 'components/SelectCountryCodeModalContent';
import countryCodes from 'utils/country-codes.json';
import {h1, h4} from 'utils/styles';
import Tooltip from 'react-native-walkthrough-tooltip';
import {ic_exclamation} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {useTranslation} from 'react-i18next';

const InputPhoneNumber = ({form, setForm}: {form: any; setForm: any}) => {
  const {t} = useTranslation();
  const handleOpenModalPhoneCode = () => {
    showBSheet({
      content: (
        <SelectCountryCodeModalContent
          headerTitle={t('settings.country_code')}
          data={countryCodes as any}
          onPress={(val: any) => {
            setForm(prev => ({
              ...prev,
              code: val?.dial_code,
              wa_code: val?.dial_code,
            }));
            handleOpenModalPhoneCode();
          }}
        />
      ),
      snapPoint: ['40%', '80%'],
    });
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View>
      <View style={[rowCenter, {marginTop: 20}]}>
        <Text style={[styles.title, h4, {marginRight: 5}]}>
          {t('register.phone_number')}
          {/* <Text style={{color: theme.colors.red}}>{'*'}</Text> */}
        </Text>
        <Tooltip
          isVisible={showTooltip}
          content={
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 24,
                color: theme.colors.black,
              }}>
              {t('detail_order.message_tooltip_phone')}
            </Text>
          }
          // placement="top"
          onClose={() => setShowTooltip(false)}>
          <TouchableHighlight
            style={{}}
            onPress={() => setShowTooltip(prev => !prev)}>
            <Image source={ic_exclamation} style={[iconCustomSize(12)]} />
          </TouchableHighlight>
        </Tooltip>
      </View>
      <View
        style={[
          {
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 10,
          },
        ]}>
        <View style={{width: '20%'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleOpenModalPhoneCode();
            }}>
            <Text style={styles.buttonText}>
              {!!form?.code && `${form?.code}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '75%'}}>
          <CustomTextInput
            placeholder={t('register.enter_phone_number')}
            maxLength={15}
            style={{marginTop: 0}}
            onChangeText={v => {
              setForm({...form, phone: v, wa: v});
            }}
            value={form?.phone}
            keyboardType="number-pad"
          />
        </View>
      </View>
    </View>
  );
};

export default InputPhoneNumber;

const styles = StyleSheet.create({
  button: {
    // flexDirection: 'row',
    alignItems: 'center',
    // height: 40,
    paddingVertical: 14.5,
    // paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    // marginTop: 4,
    borderColor: theme.colors.grey5,
    zIndex: 1,
  },
  buttonText: {
    // flex: 1,
    // textAlign: 'center',
    ...h4,
  },
  title: {
    fontSize: FONT_SIZE_12,
  },
});
