import appBar from 'components/AppBar/AppBar';
import Button from 'components/Button';
import CustomSwitch from 'components/CustomSwitch/CustomSwitch';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import React, {useCallback, useEffect, useState} from 'react';
import {h1, h5} from 'utils/styles';
import {ic_arrow_left_white} from 'assets/icons';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NotificationDataResult} from 'types/notification';
import {notificationState} from 'redux/features/notifications/notificationSlice';
import {rowCenter} from 'utils/mixins';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from 'redux/features/notifications/notificationAPI';

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(notificationState);
  const {t} = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [activity, setActivity] = useState<NotificationDataResult[]>([]);
  const [reminder, setReminder] = useState<NotificationDataResult[]>([]);

  const methods = {
    compare: (a: NotificationDataResult, b: NotificationDataResult) => {
      if (a.key < b.key) {
        return -1;
      }
      if (a.key > b.key) {
        return 1;
      }
      return 0;
    },
    handleSubmit: () => {
      setLoading(true);
      dispatch(updateNotificationSettings(activity.concat(reminder)));
      setLoading(false);
    },
    updateHandler: (
      item: NotificationDataResult,
      type: 'activity' | 'reminder',
    ) => {
      if (type === 'activity') {
        const res = activity.filter(notif => notif != item);
        const store = {...item, value: !item.value};

        setActivity([...res, store].sort(methods.compare));
      }

      if (type === 'reminder') {
        const res = reminder.filter(notif => notif != item);
        const store = {...item, value: !item.value};

        setReminder([...res, store].sort(methods.compare));
      }
    },
  };

  useEffect(() => {
    dispatch(getNotificationSettings());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (notifications.data.length == 0) return;
      const activityFilter = notifications.data.filter(
        (item: NotificationDataResult) => item.type == 'activity',
      );
      const reminderFilter = notifications.data.filter(
        (item: NotificationDataResult) => item.type == 'reminder',
      );

      setActivity(() => activityFilter.sort(methods.compare));
      setReminder(() => reminderFilter.sort(methods.compare));
    }, [notifications.data]),
  );

  useEffect(() => {
    if (notifications.isUpdateSuccess) {
      showToast({
        title: t('global.alert.success'),
        type: 'success',
        message: t('global.alert.success_change_notification'),
      });
      navigation.goBack();
    }
  }, [notifications.isUpdateSuccess]);

  useEffect(() => {
    navigation.setOptions(
      appBar({
        leading: (
          <TouchableOpacity
            style={rowCenter}
            onPress={() => navigation.goBack()}>
            <Image
              source={ic_arrow_left_white}
              style={{
                height: 20,
                width: 20,
                marginLeft: 16,
              }}
            />
            <Text style={[h1, {color: 'white', marginLeft: 10}]}>
              {t('settings.notification')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  if (notifications.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={h1}>{t('settings.activity')}</Text>
        <Text style={[h5, styles.title]}>{t('settings.activityDesc')}</Text>

        {activity.length > 0 &&
          activity.map((item, i) => (
            <CustomSwitch
              key={i}
              label={
                item.key === 'native'
                  ? t('settings.push_notif')
                  : item.key === 'sms'
                  ? t('settings.sms')
                  : t('settings.email')
              }
              defaultValue={item.value}
              onValueChange={() => methods.updateHandler(item, 'activity')}
            />
          ))}

        <View style={styles.line} />

        <Text style={[h1, {marginTop: 10}]}>{t('settings.reminder')}</Text>
        <Text style={[h5, styles.title]}>{t('settings.reminderDesc')}</Text>

        {reminder.length > 0 &&
          reminder.map((item, i) => (
            <CustomSwitch
              key={i}
              label={
                item.key == 'native'
                  ? t('settings.push_notif')
                  : item.key == 'sms'
                  ? t('settings.sms')
                  : t('settings.email')
              }
              defaultValue={item.value}
              onValueChange={() => methods.updateHandler(item, 'reminder')}
            />
          ))}
      </View>

      <Button
        _theme="navy"
        onPress={methods.handleSubmit}
        title={t('global.button.save')}
        isLoading={loading}
      />
    </View>
  );
};

export default hoc(
  NotificationScreen,
  theme.colors.navy,
  false,
  'light-content',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: '5%',
    justifyContent: 'space-between',
  },
  title: {fontSize: 12, color: theme.colors.grey5, marginBottom: 10},
  line: {
    borderWidth: 0.5,
    borderColor: theme.colors.grey5,
    marginVertical: 10,
  },
});
