import Accordion from 'react-native-collapsible/Accordion';
import {h1} from 'utils/styles';
import {ic_arrow_down, ic_arrow_up} from 'assets/icons';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function FAQ() {
  const {t} = useTranslation();
  const arrowRotation = useSharedValue(0);
  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      title: t('faq.0.title'),
      content: t('faq.0.content'),
    },
    {
      title: t('faq.1.title'),
      content: t('faq.1.content'),
    },
    {
      title: t('faq.2.title'),
      content: t('faq.2.content'),
    },
    {
      title: t('faq.3.title'),
      content: t('faq.3.content'),
    },
    {
      title: t('faq.4.title'),
      content: t('faq.4.content'),
    },
    {
      title: t('faq.5.title'),
      content: t('faq.5.content'),
    },
    {
      title: t('faq.6.title'),
      content: t('faq.6.content'),
    },
    {
      title: t('faq.7.title'),
      content: t('faq.7.content'),
    },
    {
      title: t('faq.8.title'),
      content: t('faq.8.content'),
    },
    {
      title: t('faq.9.title'),
      content: t('faq.9.content'),
    },
    {
      title: t('faq.10.title'),
      content: t('faq.10.content'),
    },
    {
      title: t('faq.11.title'),
      content: t('faq.11.content'),
    },
    {
      title: t('faq.12.title'),
      content: t('faq.12.content'),
    },
    {
      title: t('faq.13.title'),
      content: t('faq.13.content'),
    },
    {
      title: t('faq.14.title'),
      content: t('faq.14.content'),
    }
  ];

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${arrowRotation.value}deg`}],
    };
  });

  const _renderHeader = (section: any, i: any, isActive: any) => {
    return (
      <View
        style={[
          styles.header,
          {
            backgroundColor: i % 2 !== 0 ? '#fff' : '#F5F6FA',
            paddingHorizontal: 10,
          },
        ]}>
        <Text
          allowFontScaling={false}
          style={[styles.headerText, {width: '80%'}]}>
          {i + 1}. {section.title}
        </Text>

        {/* <Animated.View style={arrowStyle}> */}
        <Image
          source={isActive ? ic_arrow_up : ic_arrow_down}
          style={{
            height: 15,
            width: 15,
            resizeMode: 'contain',
          }}
        />
        {/* </Animated.View> */}
      </View>
    );
  };

  const _renderContent = (section: any, i: any) => {
    console.log('i = ', i);
    return (
      <View style={styles.content}>
        <Text
          allowFontScaling={false}
          style={{fontSize: 12, lineHeight: 20, color: '#000'}}>
          {section.content}
        </Text>
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    arrowRotation.value = withTiming(arrowRotation.value === 0 ? 180 : 0);
    setActiveSections(activeSections);
  };

  const _renderFooter = () => {
    return <View style={styles.footer} />;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', marginTop: 30}}>
      <Text style={[h1, styles.title]}>{t('tab_help_center.0.title')}</Text>
      <ScrollView>
        <Accordion
          underlayColor={'#FFF'}
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
          renderFooter={_renderFooter}
          containerStyle={{padding: 16}}
          expandMultiple={true}
        />
      </ScrollView>
    </View>
  );
}

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
    color: '#000',
  },
  headerTextRotate: {
    transform: [{rotate: '180deg'}],
    fontSize: 12,
  },
  content: {
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  textContent: {},
});
