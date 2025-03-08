import {h1, h4} from 'utils/styles';
import {rowCenter} from 'utils/mixins';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

export default function TermsConditions() {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff', marginTop: 30}}>
      <ScrollView>
        <Text style={[h1, styles.title]}>{t('tab_help_center.2.title')}</Text>

        {[...Array(9).fill('')].map((x, i) => (
          <View key={i}>
            <Text style={[h1, {fontSize: 16, marginVertical: 15}]}>
              {t(`s&k.${i}.title`)}
            </Text>

            {[...Array(t(`s&k.${i}.length`)).fill('')].map((x1, i1) => (
              <View
                key={`${i}-${i1}`}
                style={[rowCenter, {alignItems: 'flex-start'}]}>
                <Text style={[h4, {fontSize: 12, marginBottom: 10}]}>
                  {t(`s&k.${i}.description.${i1}`)}
                </Text>
              </View>
            ))}
          </View>
        ))}
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
