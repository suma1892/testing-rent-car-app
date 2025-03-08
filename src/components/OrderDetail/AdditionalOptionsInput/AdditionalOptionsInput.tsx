import AdditionalOptionsModalContent from './AdditionalOptionsModalContent';
import React, {useState} from 'react';
import {
  colorSelecting,
  iconCustomSize,
  iconSize,
  rowCenter,
} from 'utils/mixins';
import {h1, h5} from 'utils/styles';
import {
  ic_arrow_right,
  ic_arrow_right_2,
  ic_edit2,
  ic_file_filled,
} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showBSheet} from 'utils/BSheet';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {appDataState} from 'redux/features/appData/appDataSlice';
import {useAppSelector} from 'redux/hooks';

export type SelectedAdditionalRequest = {
  id: number;
  price: number;
  checked: boolean;
  quantity?: number;
};

const AdditionalOptionsInput: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {formDaily} = useAppSelector(appDataState);

  const [additionalRequests, setAdditionalRequests] = useState<
    SelectedAdditionalRequest[]
  >([]);

  const handleAdditionalOptions = () => {
    navigation.navigate('AdditionalItem');
    // showBSheet({
    //   snapPoint: ['75%', '90%'],
    //   content: (
    //     <AdditionalOptionsModalContent
    //       defaultValues={additionalRequests}
    //       onPress={val => {
    //         setAdditionalRequests(val);
    //         onChange(val);
    //       }}
    //     />
    //   ),
    // });
  };

  return (
    <View style={styles.container}>
      <Text style={[h1]}>{t('detail_order.formDetail.additional')}</Text>
      <TouchableOpacity
        style={[rowCenter, styles.borderBottom]}
        onPress={handleAdditionalOptions}>
        <View style={[rowCenter]}>
          <Image source={ic_file_filled} style={iconSize} />
          <Text
            style={[
              h5,
              colorSelecting(additionalRequests.length),
              {marginLeft: 5},
            ]}>
            {additionalRequests.length > 0
              ? `${additionalRequests.length} ${t(
                  'detail_order.specialReq.selected',
                )}`
              : t('detail_order.formDetail.select_additional')}
          </Text>
        </View>
        <Image
          source={ic_arrow_right_2}
          style={[iconSize, {tintColor: '#000'}]}
        />
      </TouchableOpacity>
      {formDaily?.additional_item?.map((data, i, real) => (
        <View style={{marginBottom: 10}}>
          {data?.varieties?.map((variety, idx) => (
            <View
              key={idx}
              style={[rowCenter, {justifyContent: 'space-between'}]}>
              <View>
                <Text style={styles.textTitle}>
                  {data?.name} ({variety?.input_order})
                </Text>
                <Text style={styles.textDesc}>
                  {t('detail_order.add_item.color')}: {variety?.color}
                </Text>
              </View>

              <TouchableOpacity onPress={handleAdditionalOptions}>
                <Image source={ic_edit2} style={iconCustomSize(24)} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default AdditionalOptionsInput;

const styles = StyleSheet.create({
  container: {marginTop: 20, marginBottom: 0},
  borderBottom: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey5,
    padding: 5,
    borderRadius: 5,
    marginTop: 7,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  textTitle: {fontSize: 12, fontWeight: '700', color: '#000', marginBottom: 5},
  textDesc: {fontSize: 12, fontWeight: '400', color: '#000'},
});
