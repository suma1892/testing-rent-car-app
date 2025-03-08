import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {ic_left_arrow_rounded, ic_right_arrow_rounded} from 'assets/icons';
import {
  img_car,
  img_car1,
  img_car_2,
  img_car_3,
  img_sample_chair,
} from 'assets/images';
import {iconCustomSize, rowCenter} from 'utils/mixins';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
const IMAGE_LENGTH = 5;
const IMAGE = [img_sample_chair, img_car, img_car1, img_car_2, img_car_3];
const ImageCard = ({data = []}: {data: any}) => {
  const ref = useRef<FlatList>();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{height: 324}}>
        <FlatList
          ref={ref}
          data={data}
          scrollEnabled={false}
          style={{width: 324}}
          keyExtractor={(x, i) => i.toString()}
          pagingEnabled
          horizontal
          renderItem={({item, index}) => (
            <View style={{height: 324}}>
              <Image
                source={{uri: item?.file_name}}
                style={[iconCustomSize(324), {borderRadius: 10}]}
              />

              <TouchableOpacity
                onPress={() => {
                  if (activeIndex === 0) return;
                  ref.current?.scrollToIndex({
                    index: activeIndex - 1,
                    animated: true,
                  });
                  setActiveIndex(prev => prev - 1);
                }}
                style={{position: 'absolute', top: '50%', left: 10}}>
                <Image
                  source={ic_left_arrow_rounded}
                  style={[iconCustomSize(30)]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (activeIndex + 1 === data?.length) return;
                  ref.current?.scrollToIndex({
                    index: activeIndex + 1,
                    animated: true,
                  });
                  setActiveIndex(prev => prev + 1);
                }}
                style={{position: 'absolute', top: '50%', right: 10}}>
                <Image
                  source={ic_right_arrow_rounded}
                  style={[iconCustomSize(30)]}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <BottomSheetScrollView horizontal>
        <View style={[rowCenter, {margin: 10}]}>
          {data?.map((x: {file_name: any}, i: React.SetStateAction<number>) => (
            <TouchableOpacity
              key={i?.toString()}
              onPress={() => {
                ref.current?.scrollToIndex({index: i, animated: true});
                setActiveIndex(i);
              }}>
              <Image
                source={{uri: x?.file_name}}
                style={[
                  iconCustomSize(58),
                  {
                    marginRight: 10,
                    overflow: 'hidden',
                    borderRadius: 10,
                  },
                ]}
              />

              {activeIndex !== i && (
                <View style={[iconCustomSize(58), styles.blur]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  blur: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    borderRadius: 10,
  },
});
