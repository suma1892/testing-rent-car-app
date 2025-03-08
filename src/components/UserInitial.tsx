import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from 'utils';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names?.map(n => n[0]?.toUpperCase());
  return initials.slice(0, 2).join('');
};

const UserInitial = ({name, size = 50}: {name: string; size: number}) => {
  // const backgroundColor = getRandomColor();
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.navy,
          width: size,
          height: size,
          borderRadius: size - 30,
        },
      ]}>
      <Text style={[styles.text, {fontSize: size / 2.5}]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserInitial;
