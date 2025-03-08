import CountryFlag from 'react-native-country-flag';
import CustomModal from 'components/CustomModal/CustomModal';
import dialCodePhone from 'assets/data/dialCodePhone.json';
import React, {useCallback, useEffect, useState} from 'react';
import {h4, h5} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {WINDOW_HEIGHT} from '@gorhom/bottom-sheet';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectCountryCodeModalContent from 'components/SelectCountryCodeModalContent';
import {showBSheet} from 'utils/BSheet';
import countryCodes from 'utils/country-codes.json';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  onChangeText,
  value,
  placeholder,
  editable,
  defaultCode,
  maxLength = 15,
}) => {
  const {t} = useTranslation();
  const [code, setCode] = useState<string>(defaultCode || '+62');
  const [flag, setFlag] = useState<string>('ID');
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      if (defaultCode) {
        const selectedCode = dialCodePhone.find(code =>
          code.dial_code.includes(defaultCode),
        );
        if (selectedCode) {
          setCode(selectedCode.dial_code.slice(1));
          setFlag(selectedCode.code);
        }
      }
    }, [defaultCode, navigation]),
  );

  const handleOpenModalPhoneCode = () => {
    showBSheet({
      content: (
        <SelectCountryCodeModalContent
          headerTitle={t('settings.country_code')}
          data={countryCodes as any}
          onPress={(val: any) => {
            setCode(val.dial_code);
            onChangeText(val.dial_code, value);
            // setForm(prev => ({
            //   ...prev,
            //   code: val?.dial_code,
            //   wa_code: val?.dial_code,
            // }));
            handleOpenModalPhoneCode();
          }}
        />
      ),
      snapPoint: ['40%', '80%'],
    });
  };

  return (
    <React.Fragment>
      <View style={[rowCenter, {}]}>
        <TouchableOpacity
          disabled={!editable}
          style={[
            styles.countryCodeContainer,
            {
              flexBasis: '20%',
              backgroundColor: editable ? 'none' : theme.colors.grey6,
              height: 45,
            },
          ]}
          onPress={() => handleOpenModalPhoneCode()}>
          <Text style={[h4, {fontSize: 13}]}>
            +{code?.includes('+') ? code?.replace('+', '') : code}
          </Text>
          {/* <CountryFlag isoCode={flag} size={15} /> */}
        </TouchableOpacity>

        <View
          style={[
            styles.inputContainer,
            {
              flexBasis: '78%',
              backgroundColor: editable ? 'none' : theme.colors.grey6,
              height: 45,
            },
          ]}>
          <TextInput
            onChangeText={text => {
              onChangeText(code, text);
            }}
            placeholder={placeholder}
            style={{
              padding: 0,
              margin: 0,
              color: theme.colors.black,
              paddingVertical: 4,
            }}
            value={value}
            placeholderTextColor={theme.colors.grey5}
            keyboardType="numeric"
            maxLength={maxLength}
            editable={editable}
          />
        </View>
      </View>

      {/* <CustomModal
        trigger={trigger}
        onClose={() => setTrigger(false)}
        headerTitle={t('Account.select_country_code') as any}>
        <View style={styles.container}>
          <View style={[styles.inputContainer, styles.inputSearchContainer]}>
            <TextInput
              onChangeText={text => setKeyword(text)}
              placeholder={t('Account.search_country_code') as any}
              style={{padding: 0, margin: 0, color: theme.colors.black}}
              value={keyword}
            />
          </View>

          <FlatList
            data={dialCodePhone.filter(
              code =>
                code.code.toLowerCase().match(keyword.toLowerCase()) ||
                code.name.toLowerCase().match(keyword.toLowerCase()),
            )}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            keyExtractor={(item, i) => {
              return i.toString();
            }}
            initialNumToRender={10}
            windowSize={5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
          />
        </View>
      </CustomModal> */}
    </React.Fragment>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    borderColor: '#CBCBCB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#CBCBCB',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 5,
    marginRight: 7,
  },
  inputSearchContainer: {
    width: '90%',
    marginHorizontal: '5%',
    backgroundColor: theme.colors.grey8,
  },
  list: {paddingBottom: 30, paddingHorizontal: '5%'},
  container: {
    marginVertical: 10,
    width: '100%',
    height: WINDOW_HEIGHT / 1.3,
  },
  lineBreak: {
    borderBottomColor: 'rgba(173, 162, 162, 0.5)',
    borderBottomWidth: 1,
  },
  buttonList: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
});
