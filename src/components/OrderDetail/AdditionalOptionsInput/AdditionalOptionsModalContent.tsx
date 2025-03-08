import AdditionalRequestRenderItem from './AdditionalRequestRenderItem';
import Button from 'components/Button';
import {additionalRequestState} from 'redux/features/additionalRequests/additionalRequestSlice';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {h1} from 'utils/styles';
import {StyleSheet, Text, View} from 'react-native';
import {toggleBSheet} from 'redux/features/utils/utilsSlice';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {WINDOW_HEIGHT} from 'utils/mixins';

type SelectedAdditionalRequest = {
  id: number;
  price: number;
  checked: boolean;
  quantity?: number;
};

type Props = {
  defaultValues: SelectedAdditionalRequest[];
  onPress: (val: SelectedAdditionalRequest[]) => void;
};

const AdditionalOptionsModalContent: React.FC<Props> = ({
  onPress,
  defaultValues,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const additionalRequests = useAppSelector(additionalRequestState);
  const [selectedAdditionalRequests, setSelectedAdditionalRequests] = useState<
    SelectedAdditionalRequest[]
  >([]);

  const {data} = additionalRequests;

  const renderItem = ({item}: {item: any}) => {
    return (
      <AdditionalRequestRenderItem
        defaultValue={defaultValues.find(val => val.id === item.id)}
        item={item}
        onSelect={val => {
          const isExist = selectedAdditionalRequests.findIndex(
            selected => selected.id === val.id,
          );

          if (isExist !== -1) {
            const newAdditionalRequests = [...selectedAdditionalRequests];
            newAdditionalRequests[isExist].checked = val.checked;
            newAdditionalRequests[isExist].price = val.price;
            newAdditionalRequests[isExist].quantity = val.quantity;
            setSelectedAdditionalRequests(newAdditionalRequests);
          } else {
            setSelectedAdditionalRequests(prev => [...prev, val]);
          }
        }}
      />
    );
  };

  useEffect(() => {
    if (defaultValues.length) {
      setSelectedAdditionalRequests(defaultValues);
    }
  }, [defaultValues]);

  return (
    <View style={styles.container}>
      <Text style={[h1, {fontSize: 18}]}>
        {t('detail_order.formDetail.select_special_request')}
      </Text>
      <BottomSheetFlatList
        contentContainerStyle={styles.listContainer}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button
        _theme="navy"
        title={t('global.button.done')}
        onPress={() => {
          onPress(
            selectedAdditionalRequests.filter(selected => selected.checked),
          );
          dispatch(toggleBSheet(false));
        }}
        styleWrapper={{
          position: 'absolute',
          bottom: 50,
        }}
      />
    </View>
  );
};

export default AdditionalOptionsModalContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: '95%',
  },
  listContainer: {width: '100%', height: WINDOW_HEIGHT / 1.5, marginTop: 20},
});
