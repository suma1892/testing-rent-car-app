import CustomTextInput from 'components/TextInput';
import React, {useState} from 'react';
import {h4, h5} from 'utils/styles';
import {ic_plus_circle} from 'assets/icons';
import {iconSize} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  onChange: (text: string) => void;
  _open?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  value?: string;
  show?: boolean;
  title?: string;
  isImportant?: boolean;
};

const LocationDetailInput: React.FC<Props> = ({
  onChange,
  _open = true,
  isImportant = false,
  placeholder,
  keyboardType,
  style,
  value,
  show = true,
  title,
}) => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(_open);
  const [keyword, setKeyword] = useState('');

  if (show) {
    if (open) {
      return (
        <>
          <Text style={[h4, {marginTop: 10}]}>
            {title || t('detail_order.formDetail.detail_location_pickup_title')}
            <Text style={{color: theme.colors.red}}>
              {isImportant ? '*' : ''}
            </Text>
          </Text>
          <CustomTextInput
            placeholder={
              placeholder ||
              t('detail_order.formDetail.detail_location_placeholder')
            }
            style={[
              style,
              {
                borderWidth: 1,
                borderColor: theme.colors.grey5,
                padding: 10,
                // paddingVertical: 5,
                borderRadius: 5,
                marginTop: 7,
              },
            ]}
            errorMessage=""
            onChangeText={v => {
              setKeyword(v);
              onChange(v);
            }}
            value={value || keyword}
            styleTitle={{
              fontSize: 12,
            }}
            outline
            keyboardType={keyboardType ? keyboardType : 'default'}
          />
        </>
      );
    }

    return (
      <TouchableOpacity style={{marginTop: 10}} onPress={() => setOpen(true)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={ic_plus_circle} style={iconSize} />
          <Text style={[h5, {fontSize: 13, marginLeft: 5}]}>
            {t('detail_order.formDetail.add_location_details')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
};

export default LocationDetailInput;
