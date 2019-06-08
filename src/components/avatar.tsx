import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

const CHARS_ONLY = /[a-zA-Zа-яА-Я ]+/g;
const WORDS_SPLIT_REGEX = /[\s"\-',+]+/;

export function Avatar({ style, width, height, title }) {
  return (
    <View style={[s.container, { width, height }, style, { backgroundColor: getAvatarBgColor(title) }]}>
      <Text style={s.text}>{getAvatarInitials(title)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  } as TextStyle,
});

export function getAvatarInitials(name: string): string {
  if (name) {
    const words = name
      .match(CHARS_ONLY)
      .join('')
      .trim()
      .split(WORDS_SPLIT_REGEX)
      .filter(value => value !== '');

    const lastWord = words.length - 1;

    return words
      .filter((v, i) => i === 0 || i === lastWord)
      .slice(0, 2)
      .map(x => x[0].toUpperCase())
      .join('\u2006');
  }

  return '';
}

const avatarBgColors = [
  '#EF5350',
  '#EC407A',
  '#AB47BC',
  '#7E57C2',
  '#42A5F5',
  '#26A69A',
  '#66BB6A',
  '#D4E157',
  '#FFCA28',
  '#FF7043',
  '#8D6E63',
  '#BDBDBD',
];

export function getAvatarBgColor(name: string): string {
  if (name) {
    return avatarBgColors[
      name
        .split(' ')
        .filter(value => value !== '')
        .map(x => x.charCodeAt(0))
        .reduce((prev, cur) => prev + cur, 0) % avatarBgColors.length
    ];
  }

  return avatarBgColors[Math.floor(Math.random() * avatarBgColors.length)];
}
