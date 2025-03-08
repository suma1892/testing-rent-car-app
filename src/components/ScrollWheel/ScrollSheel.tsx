import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const ScrollWheel = ({ data, selectedValue, onSelect }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const itemHeight = 50; // tinggi setiap item
  const visibleItems = 3; // jumlah item yang ditampilkan
  const initialScrollIndex = data.indexOf(selectedValue) - 1; // index awal scroll
  const listHeight = itemHeight * visibleItems; // tinggi keseluruhan list

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  };

  const handleMomentumScrollEnd = () => {
    const selectedIndex = Math.round((scrollOffset + itemHeight * 1.5) / itemHeight);
    onSelect(data[selectedIndex]);
  };

  return (
    <View style={{ height: listHeight }}>
      <FlatList
        data={data}
        pagingEnabled
        initialScrollIndex={initialScrollIndex}
        getItemLayout={(data, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Text
            style={{
              height: itemHeight,
              textAlign: 'center',
              fontSize: 20,
              color: item === selectedValue ? 'red' : 'black'
            }}
          >
            {item}
          </Text>
        )}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />
    </View>
  );
};

const TimePicker = () => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ScrollWheel data={hours} selectedValue={hour} onSelect={setHour} />
      <Text style={{ fontSize: 20 }}>:</Text>
      <ScrollWheel data={minutes} selectedValue={minute} onSelect={setMinute} />
    </View>
  );
};

export default TimePicker;
