import React from 'react';
import {h1, h4} from 'utils/styles';
import {
  ic_check,
  ic_cn,
  ic_en,
  ic_getride,
  ic_id,
  ic_pure_check,
} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {showToast} from 'utils/Toast';
import {showBSheet} from 'utils/BSheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useAppDispatch} from 'redux/hooks';
import {changeLanguage} from 'redux/features/utils/utilsSlice';

const DATA = [
  {
    icon: ic_id,
    title: 'Indonesia',
    id: 'id',
    isAvail: true,
  },
  {
    icon: ic_en,
    title: 'English',
    id: 'en',
    isAvail: true,
  },
  {
    icon: ic_cn,
    title: '中文',
    id: 'cn',
    isAvail: true,
  },
];
const SwitchLanguage = () => {
  const {i18n, t} = useTranslation();
  const isLang = i18n.language || 'id';
  const dispatch = useAppDispatch();

  const showLanguage = () => {
    showBSheet({
      content: (
        <View style={{width: '90%', margin: 20, flex: 1}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
            }}>
            {t('Home.select_title_lang')}
          </Text>

          <BottomSheetFlatList
            data={DATA}
            style={{marginTop: 20}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                disabled={!item?.isAvail}
                onPress={() => {
                  i18n.changeLanguage(item?.id);
                  showLanguage();
                  dispatch(changeLanguage(item?.id));
                }}
                style={[
                  rowCenter,
                  {
                    padding: 20,
                    borderBottomColor: theme.colors.grey7,
                    borderBottomWidth: 1,
                  },
                ]}>
                <Image
                  source={isLang.includes(item?.id) && ic_pure_check}
                  style={[iconCustomSize(20), {marginRight: 15}]}
                />
                <Image
                  source={item.icon}
                  style={[iconCustomSize(20), {marginRight: 15}]}
                />
                <Text
                  style={[
                    h4,
                    {
                      color: item.isAvail
                        ? theme.colors.black
                        : theme.colors.grey5,
                    },
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ),
      snapPoint: ['40%', '50%'],
    });
  };

  const getIcon = () => {
    if (isLang.includes('id')) {
      return ic_id;
    }
    if (isLang.includes('en')) {
      return ic_en;
    }
    if (isLang.includes('cn')) {
      return ic_cn;
    }
  };
  const getTitle = () => {
    if (isLang.includes('id')) {
      return 'ID';
    }
    if (isLang.includes('en')) {
      return 'EN';
    }
    if (isLang.includes('cn')) {
      return '中文';
    }
  };

  return (
    <View style={[rowCenter, {justifyContent: 'space-between', margin: 16}]}>
      <Image
        source={ic_getride}
        style={{height: 28, width: 63, resizeMode: 'contain'}}
      />

      <TouchableOpacity
        style={[rowCenter, styles.switchWrapper1]}
        onPress={showLanguage}>
        <Image source={getIcon()} style={[iconCustomSize(18)]} />
        <Text style={[{fontSize: 14, fontWeight: '700', marginLeft: 6}]}>
          {getTitle()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SwitchLanguage;

const styles = StyleSheet.create({
  switchWrapper1: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.navy,
    borderRadius: 19,
  },
  switchWrapper2: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
