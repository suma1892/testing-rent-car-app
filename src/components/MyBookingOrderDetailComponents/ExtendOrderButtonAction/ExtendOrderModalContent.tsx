import Button from 'components/Button';
import CustomTextInput from 'components/TextInput';
import React, {useState} from 'react';
import TimeWheel from '../TimeWheel/TimeWheel';
import {h1, h5} from 'utils/styles';
import {ic_calendar, ic_clock, ic_daily_car_active} from 'assets/icons';
import {iconSize, rowCenter} from 'utils/mixins';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils';
import {useTranslation} from 'react-i18next';

type Form = {
  numberOfDays: string;
  rentalHours: string;
  returnTime: string;
};

type ExtendOrderModalContentProps = {
  onSubmit: (val: Form) => void;
};

const ExtendOrderModalContent: React.FC<ExtendOrderModalContentProps> = ({
  onSubmit,
}) => {
  const {t} = useTranslation();
  const [form, setForm] = useState<Form>({
    numberOfDays: '',
    rentalHours: '',
    returnTime: '',
  });
  const [showWheel, setShowWheel] = useState(false);

  const showTime = () => {
    return form.rentalHours
      ? `${
          form.rentalHours.slice(0, form.rentalHours.length / 2) +
          ' : ' +
          form.rentalHours.slice(-form.rentalHours.length / 2)
        }`
      : '00 : 00';
  };

  return (
    <View style={styles.bsheetWrapper}>
      <TouchableOpacity style={styles.buttonContainer}>
        <View style={rowCenter}>
          <Image source={ic_daily_car_active} style={iconSize} />
          <Text style={[h1, styles.tab]}>{t('Home.daily.title')}</Text>
        </View>
        <View style={styles.lineMenu} />
      </TouchableOpacity>

      <CustomTextInput
        title={t('detail_order.extendOrder.numberOfDays') as any}
        placeholder={t('detail_order.extendOrder.numberOfDaysPlaceholder')}
        leftIcon={ic_calendar}
        errorMessage=""
        onChangeText={v => {
          setForm(prev => ({...prev, numberOfDays: v}));
        }}
        value={form.numberOfDays}
        styleTitle={{
          fontSize: 12,
        }}
        outline
        keyboardType="number-pad"
      />

      <View style={styles.rentalHoursWrapper}>
        <Text style={[h1, {fontSize: 12}]}>
          {t('Home.daily.rent_start_time')}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setShowWheel(true);
          }}
          style={[rowCenter, styles.wrapper]}>
          <Image source={ic_clock} style={iconSize} />

          <View>
            <Text style={[h5, styles.time]}>{showTime()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.returnTimeWrapper}>
        <Text style={[h1, {fontSize: 12}]}>
          {t('Home.daily.rent_end_time')}
        </Text>

        <View style={[rowCenter, styles.wrapper]}>
          <Image source={ic_clock} style={iconSize} />

          <View>
            <Text style={[h5, styles.time]}>{showTime()}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.btnWrapper]}>
        <Button
          _theme="navy"
          title={t('global.button.next')}
          onPress={() => onSubmit(form)}
        />
      </View>

      <TimeWheel
        form={form}
        setForm={setForm}
        showWheel={showWheel}
        setShowWheel={setShowWheel}
      />
    </View>
  );
};

export default ExtendOrderModalContent;

const styles = StyleSheet.create({
  bsheetWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    width: '97%',
    paddingLeft: '2%',
    paddingRight: '5%',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  formWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.grey6,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 0,
    width: '100%',
  },
  tab: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
  lineMenu: {
    borderBottomColor: theme.colors.navy,
    borderBottomWidth: 2.5,
    marginTop: 5,
  },
  rentalHoursWrapper: {width: '100%', marginBottom: 10, marginTop: 20},
  returnTimeWrapper: {width: '100%', marginVertical: 10},
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey5,
    width: '100%',
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  time: {marginLeft: 10, color: theme.colors.grey4},
});
