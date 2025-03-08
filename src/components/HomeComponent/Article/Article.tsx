import FastImage from 'react-native-fast-image';
import he from 'he';
import RenderHTML from 'react-native-render-html';
import {boxShadow, WINDOW_WIDTH} from 'utils/mixins';
import {getArtikels} from 'redux/features/appData/appDataAPI';
import {h1, h3} from 'utils/styles';
import {memo, useCallback, useEffect, useState} from 'react';
import {showToast} from 'utils/Toast';
import {theme} from 'utils';
import {useAppDispatch} from 'redux/hooks';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

const tagsStyles = {
  p: {
    fontSize: 12,
  },
};

const Article: React.FC = () => {
  const {t, i18n, ready} = useTranslation();
  const dispatch = useAppDispatch();
  const [articleList, setArticleList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await dispatch(getArtikels(i18n.language));
      setArticleList(res?.payload || []);
    } finally {
      setLoading(false);
    }
  }, [dispatch, i18n.language]);

  useEffect(() => {
    if (ready) {
      getArticles();
    }
  }, [ready, getArticles]);

  const handleLinkPress = useCallback(
    async (url: string) => {
      try {
        await Linking.openURL(url);
      } catch (error) {
        showToast({
          message: 'Link tidak bisa dibuka',
          title: t('global.alert.warning'),
          type: 'warning',
        });
      }
    },
    [t],
  );

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <TouchableOpacity
        style={[
          boxShadow('#000', {height: 1, width: 2}, 3.27, 0.24),
          styles.boxWrapper,
        ]}
        onPress={() => handleLinkPress(item?.link)}>
        <FastImage
          source={{
            uri: item?.jetpack_featured_media_url,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.thumbnailImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{padding: 10}}>
          <Text style={h1}>{he.decode(item?.title?.rendered || '')}</Text>
          <RenderHTML
            contentWidth={WINDOW_WIDTH}
            source={{
              html: item?.excerpt?.rendered || '',
            }}
            tagsStyles={tagsStyles}
          />
          <Text style={[h3, styles.readMore]}>{t('carDetail.learnMore')}</Text>
        </View>
      </TouchableOpacity>
    ),
    [handleLinkPress, t],
  );

  return (
    <View style={styles.container}>
      <Text style={[h1, styles.title]}>{t('Home.articleTitle')}</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1A33A" />
          <Text style={[h1, styles.loading]}>{t('global.loading')}...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{paddingLeft: 5}}
          horizontal
          data={articleList.slice(0, 5)}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      )}
    </View>
  );
};

export default memo(Article);

const styles = StyleSheet.create({
  container: {
    paddingLeft: '5%',
  },
  title: {
    marginTop: 20, 
    fontSize: 21, 
    marginBottom: 10
  },
  boxWrapper: {
    marginRight: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    width: 300,
  },
  thumbnailImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: 300,
    height: 200,
  },
  readMore: {fontSize: 13, marginTop: 10},
  loadingContainer: {
    height: 350,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 16, 
    color: theme.colors.navy, 
    marginVertical: 10
  },
});
