import Button from 'components/Button';
import React, {Dispatch, FC, SetStateAction} from 'react';
import useRentalDurationModalContent from '../hooks/useRentalDurationModalContent';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {IForm} from '../hooks/useDailyCarSearchForm';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from 'utils';
import {TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

export type RentalDurationModalContentProps = {
  form: IForm;
  setForm: Dispatch<SetStateAction<IForm>>;
  onSelect: (val: string) => void;
};

const RentalDurationModalContent: FC<RentalDurationModalContentProps> = ({
  form,
  setForm,
  onSelect,
}) => {
  const {t} = useTranslation();
  const {selectedDay, setSelectedDay, convertRentalStartDate, handleSubmit} =
    useRentalDurationModalContent({
      form,
      setForm,
      onSelect,
    });

  const renderItem = ({item}: {item: number}) => {
    return (
      <TouchableOpacity
        style={[
          styles.buttonOption,
          {backgroundColor: selectedDay === item ? '#F5F6FA' : '#FFFFFF'},
        ]}
        onPress={() => setSelectedDay(item)}>
        <Text style={styles.boldedLabel}>
          {item} {item > 1 ? t('Home.daily.days') : t('Home.daily.day')}{' '}
          <Text style={styles.thinLabel}>({convertRentalStartDate(item)})</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[h1, styles.headerTitle]}>
        {t('Home.daily.rental_duration')}
      </Text>

      <View style={styles.listContainer}>
        <BottomSheetFlatList
          data={Array.from({length: 14}, (_, index) => index + 1)}
          keyExtractor={i => `index_${i}`}
          renderItem={renderItem}
          contentContainerStyle={{paddingVertical: 9}}
        />
      </View>

      <Button
        title={t('global.button.done')}
        _theme="navy"
        styleWrapper={{marginTop: 20}}
        onPress={handleSubmit}
        disabled={!selectedDay}
      />
    </View>
  );
};

export default RentalDurationModalContent;

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%', backgroundColor: '#fff', padding: 16},
  headerTitle: {fontSize: 20, marginBottom: 18},
  listContainer: {
    width: '100%',
    height: 380,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 3,
  },
  buttonOption: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  boldedLabel: {
    color: theme.colors.black,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  thinLabel: {fontWeight: '400'},
});
