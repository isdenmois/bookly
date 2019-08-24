import React from 'react';
import { StyleSheet, View, TextStyle, ViewStyle, Text, TouchableOpacity, Linking } from 'react-native';
import pluralize from 'pluralize-ru';
import { color } from 'types/colors';
import { Thumbnail } from 'components';
import { thousandsSeparator } from 'utils/number-format';
import { Edition } from 'services/api/fantlab/editions';

interface Props {
  edition: Edition;
  translators: string[];
}

export class EditionCard extends React.PureComponent<Props> {
  get title() {
    const edition = this.props.edition;

    if (edition.published) {
      return edition.isbns.join(', ') || 'Без ISBN';
    }

    return 'Издание запланировано';
  }

  get translators() {
    const translators = this.props.translators;

    if (translators) {
      return translators.join(', ');
    }

    return 'Переводчик не указан';
  }

  get pageCount() {
    return pluralize(this.props.edition.pages, '%d страниц', '%d страница', '%d страницы', '%d страниц');
  }

  render() {
    const edition = this.props.edition;

    return (
      <View style={s.card}>
        <View style={s.thumbnail}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.openEditionPage}>
            <Thumbnail auto={null} width={76} height={117} url={edition.thumbnail} />
          </TouchableOpacity>
          <View style={s.yearBlock}>
            <Text style={s.yearText}>{edition.year}</Text>
          </View>
        </View>

        <View style={s.info}>
          <Text style={s.title}>{this.title}</Text>
          <Text style={s.description}>{this.translators}</Text>
          <Text style={s.description}>{this.pageCount}</Text>
          <Text style={s.description}>{thousandsSeparator(edition.copies)} экз.</Text>
        </View>
      </View>
    );
  }

  openEditionPage = () => Linking.openURL(`https:${this.props.edition.url}`);
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  info: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontFamily: 'sans-serif-medium',
    color: color.PrimaryText,
    marginBottom: 10,
  } as TextStyle,
  thumbnail: {
    marginRight: 20,
    position: 'relative',
  } as ViewStyle,
  description: {
    fontSize: 14,
    color: color.SecondaryText,
    marginBottom: 10,
  } as TextStyle,
  yearBlock: {
    backgroundColor: '#FFDE03',
    borderTopLeftRadius: 5,
    padding: 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
  } as ViewStyle,
  yearText: { color: 'black', fontSize: 16 } as TextStyle,
});
