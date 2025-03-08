import appBar from 'components/AppBar/AppBar';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import hoc from 'components/hoc';
import Loading from 'components/Loading/Loading';
import MyInboxCard from 'components/MyInboxComponent/MyInboxCard/MyInboxCard';
import React, {useCallback, useEffect, useState} from 'react';
import {getInboxes} from 'redux/features/inbox/myInboxAPI';
import {h1} from 'utils/styles';
import {ic_arrow_left_white, ic_inbox_not_found} from 'assets/icons';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {inboxState, setPage} from 'redux/features/inbox/myInboxSlice';
import {theme} from 'utils';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

const MyBooking: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const inboxData = useAppSelector(inboxState);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh(true);
    dispatch(setPage(1));
    setRefresh(false);
  };

  const handleMore = () => {
    if (inboxData.page < inboxData.data.pagination.total_page) {
      setRefresh(true);
      dispatch(setPage(inboxData.data.pagination.next_page));
      setRefresh(false);
    }
  };

  const renderItem = ({item}: any) => {
    return <MyInboxCard item={item} />;
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getInboxes());
    }, []),
  );

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
              {t('myInbox.tabBarLabel')}
            </Text>
          </TouchableOpacity>
        ),
      }),
    );
  }, [navigation]);

  if (inboxData.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inboxData.data?.inboxes || []}
        renderItem={renderItem}
        keyExtractor={(item, i) => {
          return i.toString();
        }}
        refreshing={refresh}
        onRefresh={() => {
          return handleRefresh();
        }}
        onEndReached={() => {
          return handleMore();
        }}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        ListEmptyComponent={
          <DataNotFound
            imageComponent={
              <Image
                source={ic_inbox_not_found}
                style={[iconCustomSize(220), {marginBottom: 80}]}
                resizeMode="contain"
              />
            }
            title={t('notification.not_found_title') as any}
            description={t('notification.not_found_description') as any}
          />
        }
      />
    </View>
  );
};

export default hoc(MyBooking, theme.colors.navy, false, 'light-content');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
});
